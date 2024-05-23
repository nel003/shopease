import pool from '@/database/connection';
import { RowDataPacket } from 'mysql2/promise';
import bcrypt from "bcryptjs";
import {v4 as uuid} from 'uuid'

interface TokenRowType extends RowDataPacket {
    id: number,
    username: string,
    email: string,
    password: string
}

export async function POST(req: Request) {
    let conn;
    try{
        const {username, password} = await req.json();
        conn = await pool.getConnection();

        const [results] = await conn.execute<TokenRowType[]>("SELECT id, username, email, password FROM admins WHERE username=?;", [username]);
        if(results.length < 1) {
            return new Response(JSON.stringify({message: "Invalid username or password!"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        if(!bcrypt.compareSync(password, results[0].password)) {
            return new Response(JSON.stringify({message: "Invalid username or password!"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const token = uuid();

        await conn.execute('INSERT INTO admin_tokens VALUES(0, ?, ?)', [results[0].id, token]);
        return Response.json({message: "OK", token});

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

// export async function GET(req: Request) {
//     console.log(bcrypt.hashSync("admin123", 10))
// }