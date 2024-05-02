import pool from "../../../database/connection"
import mysql, { ResultSetHeader } from 'mysql2/promise';
import { usernameIsValid, passwordIsValid, emailIsValid } from '@/utils/validate'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try{
        const {username, email, password} = await req.json();
        const isUsernameValid =  usernameIsValid(username); 
        const isEmailValid = emailIsValid(email);
        const isPasswordValid = passwordIsValid(password);

        if(!isUsernameValid[0]) {
            return new Response(JSON.stringify({field: "username", message: isUsernameValid[1]}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        if(!isEmailValid[0]) {
            return new Response(JSON.stringify({field: "email", message: isEmailValid[1]}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        if(!isPasswordValid[0]) {
            return new Response(JSON.stringify({field: "password", message: isPasswordValid[1]}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const conn = await pool.getConnection();
        const [results] = await conn.execute<ResultSetHeader>('INSERT INTO customers(username, email, password) VALUES(?, ?, ?);', [username, email, hashedPassword]);

        const token = await jwt.sign({
            username,
            email
        }, "secrettsd", { expiresIn: 60*60*24*7 });

        await conn.execute('INSERT INTO tokens VALUES(0, ?, ?)', [results.insertId, token]);

        await conn.release();
        return Response.json({message: "Success", token, username, email})
    } catch(err: any) {
        const msg: string = err?.sqlMessage;

        if (msg.includes("Duplicate entry") && msg.includes("customers.username")) {
            return new Response(JSON.stringify({field: "username", message: "Username is already in used!"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        if (msg.includes("Duplicate entry") && msg.includes("customers.email")) {
            return new Response(JSON.stringify({field: "email", message: "Email is already registered!"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response(JSON.stringify({field: "toast", message: msg}), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
  }