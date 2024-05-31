import { RowDataPacket } from "mysql2";
import pool from "@/database/connection";
export async function GET(req: Request) {
    let conn;
    try{
        const page = parseInt((new URL(req.url).searchParams.get("page")) || "0");
        conn = await pool.getConnection();

        const [res] = await conn.execute<RowDataPacket[]>(`SELECT p.product_name, p.id, p.description, p.thumbnail, MIN(pe.price) AS min_price, MAX(price) AS max_price FROM products AS p JOIN product_entry AS pe ON pe.product_id = p.id GROUP BY p.id ORDER BY id DESC LIMIT ${page ? (page * 5) +","+ (page * 5 + 5):"0, 5"};`);
        console.log(res)
        return Response.json(res);
    } catch(err) {
        console.log(err)
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