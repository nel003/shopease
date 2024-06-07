import pool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";


export async function POST(req: Request) {
    let conn;
    try {
        const {name, username, email, birthdate, gender} = await req.json();
        console.log(name, username, email, birthdate, gender)
        const user = await getUser(req);

        conn = await pool.getConnection();

        await conn.execute("UPDATE customers SET name = ?, username = ?, email = ?, birthdate = ?, gender = ? WHERE id = ?;", [name, username, email, birthdate, gender, user?.id]);

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
