import pool from "@/database/connection"
import { RowDataPacket } from "mysql2";

export async function GET(req: Request, {params} : {params: {id: number}}) {
    const id = params.id;
    let conn;
    try {
        conn = await pool.getConnection();

        const [resp] = await conn.execute<RowDataPacket[]>("SELECT * FROM products WHERE id = ?", [id])
        const [resf] = await conn.execute<RowDataPacket[]>("SELECT * FROM product_files WHERE product_id = ?", [id])

        return Response.json({product: resp[0], previews: resf});
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } finally {
        await conn?.release();
    }
}
export async function PUT(req: Request, {params} : {params: {id: number}}) {
    const id = params.id;
    let conn;
    try {
        conn = await pool.getConnection();
        const {productName, category, description} = await req.json();

        await conn.execute("UPDATE products SET product_name = ?, category_id = ?, description = ?, status = 0 WHERE id = ?", [productName, category, description, id]);

        return Response.json([]);
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } finally {
        await conn?.release();
    }
}