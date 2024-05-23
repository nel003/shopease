import pool from "@/database/connection";
import { RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';

interface UserType extends RowDataPacket {
    id: number,
    username: string,
    email: string,
    name: string,
    token: string
}

export async function GET(req: Request) {
    let conn;
    try{
        const token = req.headers.get("Refresh-Token");
        if (!token) {
            return new Response(JSON.stringify({redirect: true, url: "/account/admin"}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        conn = await pool.getConnection();

        const [res] = await conn.execute<UserType[]>("SELECT a.id, t.token, a.username, a.name, a.email FROM admin_tokens AS t JOIN admins AS a ON a.id = t.admin_id WHERE token = ?;", [token]);
        const jwtToken = await jwt.sign({
            ...res[0],
            role: 'admin'
        }, "secrettsd", { expiresIn: 60*60*24*7 });
        return Response.json({message: "OK", user: {...res[0], token: jwtToken}});

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