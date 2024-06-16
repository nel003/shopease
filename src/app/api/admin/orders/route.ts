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
    address: string
}

export async function GET(req: Request) {
    let conn;
    try {
        const params = new URL(req.url).searchParams;
        const search = params.get("s") || "";
        conn = await getPool.getConnection();
        const listObj: any = {};
        
        const [res] = await conn.execute<Orders[]>(`
            SELECT 
                oi.order_id,
                o.number as order_number, 
                p.product_name,
                o.quantity,
                o.total,
                o.status,
                o.status_text,
                p.thumbnail,
                pe.price,
                pe.name as variant,
                COUNT(o.id) as count
            FROM 
                order_items AS oi
            JOIN products AS p ON p.id = oi.product_id
            JOIN product_entry AS pe ON pe.product_id = p.id
            JOIN orders AS o ON o.id = oi.order_id
            WHERE o.number LIKE '%${search}%'
            GROUP BY o.number;
        `);
        console.log(res)
        return Response.json(res);
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

export async function DELETE(req: Request) {
    let conn;
    try {
        const { ids } = await req.json();
        conn = await getPool.getConnection();

        await conn.execute(`DELETE FROM order_items WHERE order_id IN (${ids.join(",")});`);
        await conn.execute(`DELETE FROM orders WHERE id IN (${ids.join(",")});`);

        return Response.json({message: "ok"});
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