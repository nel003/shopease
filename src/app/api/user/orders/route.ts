import getPool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";
import { RowDataPacket } from "mysql2";

interface Orders extends RowDataPacket {
    order_id: number
    order_number: string
    product_name: string
    thumbnail: string
    price: number
    quantity: number
    total: number
    status: number
    status_text: number
    variant: string
    count: number
}

export async function GET(req: Request) {
    let conn;
    try {
        const params = new URL(req.url).searchParams;
        const type = params.get("type") || 0;

        const user = await getUser(req);
        conn = await getPool.getConnection();
        const listObj: any = {};
        
        const [res] = await conn.execute<Orders[]>(`
            SELECT 
                o.number as order_number, 
                o.id AS order_id,
                oi.quantity,
                o.total,
                o.status,
                o.status_text,

                p.product_name,
                p.thumbnail,
                
                pe.price,
                pe.name as variant,

                COUNT(oi.id) AS count
            FROM 
                orders AS o
            JOIN order_items AS oi ON oi.order_id = o.id
            JOIN products AS p ON oi.product_id = p.id
            JOIN product_entry AS pe ON pe.id = oi.product_entry_id
            WHERE o.customer_id = ? ${type != 0 ? "AND o.status = "+type : ""}
            GROUP BY o.number
            ORDER BY o.id DESC;
        `, [user?.id]);
            console.log(res)
        res.forEach((i) => {
            listObj[i.order_number] = i;
        });

        console.log(listObj)
        return Response.json(listObj);
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