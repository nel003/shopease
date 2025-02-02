import pool from "@/database/connection";
import { RowDataPacket } from "mysql2";
import jwt from 'jsonwebtoken';

interface UserType extends RowDataPacket {
    id: number,
    username: string,
    email: string,
    name: string,
    token: string
    birthdate: string,
    gender: string
}

export async function GET(req: Request) {
    let conn;
    try{
        const token = req.headers.get("Refresh-Token");
        console.log(token)
        if (!token) {
            return new Response(JSON.stringify({redirect: true, url: "/account"}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        conn = await pool.getConnection();

        const [res] = await conn.execute<UserType[]>("SELECT a.id, t.token, a.username, a.name, a.email, a.birthdate, a.gender FROM tokens AS t JOIN customers AS a ON a.id = t.customer_id WHERE token = ?;", [token]);
        if (res.length < 1) {
            return new Response(JSON.stringify({redirect: true, url: "/account"}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const jwtToken = await jwt.sign({
            ...res[0],
            role: 'admin'
        }, "secrettsd", { expiresIn: '7d' });
        console.log(res)
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