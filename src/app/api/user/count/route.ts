import getPool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";



export async function GET(req: Request) {
    let conn;
    try {
        const user = await getUser(req);
        conn = await getPool.getConnection();
        
        const [res] = await conn.execute("SELECT SUM(quantity) as quantity FROM cart WHERE customer_id = ?;", [user?.id]);
        
        return Response.json(res);
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