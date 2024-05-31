import { RowDataPacket } from "mysql2";
import pool from "../../../../database/connection";

export async function GET(req: Request, {params} : {params: {id: number}}) {
    let conn;
    try{
        const id = params.id;
        
        conn = await pool.getConnection();
        const variants: any = {}; 

        const [res] = await conn.execute<RowDataPacket[]>(`SELECT p.product_name, p.id, p.description, p.thumbnail, MIN(pe.price) AS min_price, MAX(price) AS max_price FROM products AS p JOIN product_entry AS pe ON pe.product_id = p.id WHERE p.id = ?;`, [id]);
        const [resf] = await conn.execute<RowDataPacket[]>(`SELECT * FROM product_files WHERE product_id = ?;`, [id]);
        const [resv] = await conn.execute<RowDataPacket[]>(`SELECT vo.id AS option_id, vo.name AS variant_option, v.id, v.variant FROM variant_options AS vo JOIN variants AS v ON v.id = vo.variant_id WHERE v.product_id = ?;`, [id]);
        const [rese] = await conn.execute<RowDataPacket[]>(`SELECT * FROM product_entry WHERE product_id = ?;`, [id]);
        
        resv.forEach(e => {
            variants[e.variant] = [];
        });
        
        resv.forEach(e => {
            variants[e.variant].push(e);
        });
        
        return Response.json({...res[0], files: resf, variants, entries: rese});
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