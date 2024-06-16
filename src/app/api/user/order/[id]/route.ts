import getPool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";

export async function GET(req: Request, {params} : {params: {id: number}}) {
    let conn;
    try {
        conn = await getPool.getConnection();
        
        const [resO]: any = await conn.execute(`
            SELECT 
                o.number, 
                o.customer_id, 
                o.address_id, 
                o.payment_method, 
                o.status, 
                o.status_text, 
                o.description, 
                o.quantity, 
                o.total, 
                o.order_on,
                c.username,
                CONCAT(a.fullname, ' | ', a.number, ', ', a.house, ', ', a.barangay, ', ', a.city, ', ', a.province) AS address
            FROM orders AS o 
            JOIN customers AS c ON c.id = o.customer_id
            JOIN addresses AS a ON a.id = o.address_id
            WHERE o.id = ?;`, [params.id]);

            const [resI]: any = await conn.execute(`
                SELECT 
                    p.product_name,
                    p.thumbnail,
                    oi.quantity,
                    pe.name as variant,
                    pe.price
                FROM order_items AS oi   
                JOIN products AS p ON p.id = oi.product_id
                JOIN product_entry AS pe ON pe.id = oi.product_entry_id
                JOIN orders AS o ON o.id = oi.order_id
                WHERE o.id = ?;
            `, [params.id]);
        
            const result = {...resO[0]};
            result["items"] = resI;

        return Response.json(result);
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error."}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        conn?.release();
    }
}

export async function PUT(req: Request, {params} : {params: {id: number}}) {
    let conn;
    try {
        const user = await getUser(req);
        conn = await getPool.getConnection();

        await conn.execute("UPDATE orders SET status = 4, status_text = ? WHERE id = ? AND status = 1 AND customer_id = ?;", ['Cancelled by customer.', params.id, user?.id]);
        
        return Response.json({message: "ok"});
    } catch(error) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error."}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        conn?.release();
    }
}