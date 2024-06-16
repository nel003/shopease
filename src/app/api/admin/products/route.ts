import pool from "../../../../database/connection"
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter")?.trim() || "";
        const conn = await pool.getConnection();

        const [result] = await conn.execute<RowDataPacket[]>(`
        SELECT p.id, p.product_name, p.category_id, p.status, p.description, c.category, p.thumbnail FROM products AS p
        JOIN categories AS c ON c.id = p.category_id
        WHERE product_name like '%${filter}%' ORDER BY id DESC LIMIT 1000;
        `);
 
        await conn.release();

        return Response.json(result);
    } catch (error: any) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    
}

export async function DELETE(req: Request) {
    let conn;
    try {
        conn = await pool.getConnection();
        const { many, id } = await req.json();
        console.log(many)
        if (many) {
            await conn.execute(`DELETE FROM cart WHERE product_id IN (${id.join(",")});`, [id]); 
            await conn.execute(`DELETE FROM variant_options WHERE product_id IN (${id.join(",")});`, [id]); 
            await conn.execute(`DELETE FROM variants WHERE product_id IN (${id.join(",")});`, [id]); 
            await conn.execute(`DELETE FROM product_entry WHERE product_id IN (${id.join(",")});`, [id]); 
            await conn.execute(`DELETE FROM product_files WHERE product_id IN (${id.join(",")});`, [id]); 
            await conn.execute(`DELETE FROM products WHERE id IN (${id.join(",")});`, [id]); 
        } else {
            await conn.execute(`DELETE FROM cart WHERE product_id = ?;`, [id]); 
            await conn.execute(`DELETE FROM variant_options WHERE product_id = ?;`, [id]); 
            await conn.execute(`DELETE FROM variants WHERE product_id = ?;`, [id]); 
            await conn.execute(`DELETE FROM product_entry WHERE product_id = ?;`, [id]); 
            await conn.execute(`DELETE FROM product_files WHERE product_id = ?;`, [id]); 
            await conn.execute(`DELETE FROM products WHERE id = ?;`, [id]); 
        }

        await conn.release();

        return Response.json({messagae: "ok"});
    } catch (error: any) {
        console.log(error)
        if (error.code == 'ER_ROW_IS_REFERENCED_2') {
            return new Response(JSON.stringify({message: "You cant delete a product with order."}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}