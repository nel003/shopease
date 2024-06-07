import getPool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

interface Password extends RowDataPacket {
    password: string 
}

export async function POST(req: Request) {
    let conn;
    try {
        const {password, newpassword, renewpassword} = await req.json();
        if(newpassword.trim().length < 8) {
            return new Response(JSON.stringify({message: "Password must be atleast 8 characters!"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        if(newpassword  !== renewpassword) {
            return new Response(JSON.stringify({message: "Invalid password confirmation!"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const user = await getUser(req);

        conn = await getPool.getConnection();

        const [res] = await conn.execute<Password[]>("SELECT password FROM customers WHERE id = ?", [user?.id]);
        if(!bcrypt.compareSync(password, res[0].password)) {
            return new Response(JSON.stringify({message: "Invalid old password!"}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const newHashedPassword = bcrypt.hashSync(newpassword, 10);
        await conn.execute("UPDATE customers SET password = ? WHERE id = ?;", [newHashedPassword, user?.id]);

        return Response.json({message: "ok"});
    } catch (error) {
        console.log(error)
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
