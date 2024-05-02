import pool from "@/database/connection"
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET(req: Request, {params} : {params: {id: number}}) {
    const id = params.id;
    let conn;
    try {
        conn = await pool.getConnection();
        const [variants] = await conn.execute<RowDataPacket[]>(`SELECT 
            pe.id,
            pe.preview,
            pe.name,
            pe.price,
            pe.ids,
            pe.stock,
            pe.on_sale_price,
            pe.is_on_sale
            FROM product_entry AS pe
            WHERE pe.product_id = ?;
        `, [id]); 
        console.log(variants)
        conn.release();
        return Response.json(variants)
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}