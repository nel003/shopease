import getPool from "@/database/connection";

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
                (SELECT CONCAT(a.fullname, ' | ', a.number, ', ', a.house, ', ', a.barangay, ', ', a.city, ', ', a.province) AS address FROM addresses AS a WHERE id = o.address_id) AS address
                
            FROM orders AS o 
            JOIN customers AS c ON c.id = o.customer_id
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
            console.log(resO)
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
        const { type, statusText, cancelMsg } = await req.json();
        conn = await getPool.getConnection();

        if(type === "cancel") {
            await conn.execute("UPDATE orders SET status = 4, status_text = ? WHERE id = ?;", [cancelMsg.trim() !== "" ? cancelMsg:'Cancelled', params.id]);
        }
        if(type === "complete") {
            await conn.execute("UPDATE orders SET status = 3, status_text = 'Completed.' WHERE id = ?;", [params.id]);
        }
        if(type === "update") {
            const status = statusText.split("@");
            await conn.execute("UPDATE orders SET status = ?, status_text = ? WHERE id = ?;", [status[1], status[0], params.id]);
        }

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