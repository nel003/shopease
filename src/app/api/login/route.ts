import pool from "../../../database/connection"
import mysql, { QueryResult, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

interface TokenRowType extends RowDataPacket {
    id: number,
    username: string,
    email: string,
    password: string
}

export async function POST(req: Request) {
    try{
        const {username, password} = await req.json();
        const conn = await pool.getConnection();

        const [results] = await conn.execute<TokenRowType[]>("SELECT id, username, email, password FROM customers WHERE username=?;", [username]);
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

        const token = await jwt.sign({
            username,
            email: results[0].email
        }, "secrettsd", { expiresIn: 60*60*24*7 });

        await conn.execute('INSERT INTO tokens VALUES(0, ?, ?)', [results[0].id, token]);

        await conn.release();
        return Response.json({message: "OK", token, username, email: results[0].email});

    } catch(err) {
        console.log(err)
        return new Response(JSON.stringify({message: "Server error."}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}