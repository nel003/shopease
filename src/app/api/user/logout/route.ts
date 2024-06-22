import getPool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";

export async function POST(req: Request) {
    let conn;
    try {
        const user = await getUser(req);
        conn = await getPool.getConnection();

        await conn.execute("DELETE FROM tokens WHERE customer_id = ?;", [user?.id]);
        
        return Response.json({message: "ok"});
    } catch(error) {
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