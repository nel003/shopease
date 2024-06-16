import { RowDataPacket } from "mysql2";
import pool from "../../../database/connection";

export async function GET(req: Request) {
    let conn;
    try{
        const params = new URL(req.url).searchParams;
        const page = parseInt((params.get("page")) || "0");
        const cat = params.get("cat") || "";
        const search = params.get("search") || "";
        console.log(cat)
        conn = await pool.getConnection();
        
        const [res] = await conn.execute<RowDataPacket[]>(`
            SELECT 
                p.product_name, 
                p.id, p.description, 
                p.thumbnail, 
                MIN(pe.price) AS min_price, 
                MAX(price) AS max_price FROM products AS p 
            JOIN product_entry AS pe ON pe.product_id = p.id 
            JOIN categories AS c ON c.id = p.category_id
            WHERE 
                c.category LIKE '%${cat}%' AND
                p.product_name LIKE '%${search}%'
            GROUP BY p.id ORDER BY id ASC LIMIT ${page ? page * 10 +","+page * 10 + 10:"0, 10"};`);
        
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