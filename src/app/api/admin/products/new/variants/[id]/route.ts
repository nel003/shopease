import pool from "@/database/connection"
import mysql, { RowDataPacket } from 'mysql2/promise';

type Variant = {
    hasChanges: boolean
    id: number
    preview: null,
    name: string
    price: number
    ids: string
    stock: number
    on_sale_price: number
    is_on_sale: number
}

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
        return Response.json(variants)
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } finally {
        conn?.release();
    }
}
export async function PUT(req: Request, {params} : {params: {id: number}}) {
    const id = params.id;
    let conn;
    try {
        conn = await pool.getConnection();
        conn.beginTransaction();
        const {variants}: {variants: Variant[]} = await req.json();

        for(const variant of variants){
            if(variant.hasChanges) {
                console.log(variant)
                await conn.execute("UPDATE product_entry SET price = ?, on_sale_price = ?, stock = ?, is_on_sale = ? WHERE id = ?;", [variant.price, variant.on_sale_price, variant.stock, variant.is_on_sale, variant.id]);
            }
        }
        await conn.execute("UPDATE products SET status = 1 WHERE id = ?;", [id]);

        conn.commit();
        return Response.json({message: "success"})
    } catch (error) {
        console.log(error)
        conn?.rollback();
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } finally {
        conn?.release();
    }
}