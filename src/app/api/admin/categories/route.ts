import pool from "../../../../database/connection"
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search")?.trim() || "";
        const conn = await pool.getConnection();
        const [result] = await conn.execute<RowDataPacket[]>(`SELECT * FROM categories WHERE category like '%${search}%' ORDER BY id DESC LIMIT 1000;`);
        
        await conn.release();
        return Response.json(result);
    } catch(error) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
export async function POST(req: Request) {
    try {
        const { category, description } = await req.json();
        const conn = await pool.getConnection();

        await conn.execute("INSERT INTO categories VALUES (0, ?, ?);", [category, description]);

        await conn.release();
        return Response.json({message: "Success"});
    } catch(error) {
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
    try {
        const {id, many} = await req.json();
        const conn = await pool.getConnection();
        
        if (many) {
            await conn.execute(`DELETE FROM categories WHERE id IN (${Array(id).toString()});`);
        } else {
            await conn.execute(`DELETE FROM categories WHERE id = ?;`, [id]);
        }

        await conn.release();
        return Response.json({message: 'Success'});
    } catch (error: any) {
        if (error.code) {
            return new Response(JSON.stringify({message: "Category has data in other tables"}), {
                status: 400,
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

export async function PUT(req: Request) {
    try {
        const {id, category, description} = await req.json();
        const conn = await pool.getConnection();

        await conn.execute("UPDATE categories SET category = ?, description = ? WHERE id = ?;", [category, description, id]);

        await conn.release();
        return Response.json({message: 'Success'});
    } catch(error: any) {
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}