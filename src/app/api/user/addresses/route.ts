import getPool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";


export async function POST(req: Request) {
    let conn;
    try {
        const {fullname, number, house, province, city, barangay} = await req.json();
        const user = await getUser(req);
        conn = await getPool.getConnection();

        await conn.execute("INSERT INTO addresses VALUES(0, ?, ?, ?, ?, ?, ?, ?)", [user?.id, fullname, number, house, province, city, barangay]);

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

export async function PUT(req: Request) {
    let conn;
    try {
        const {fullname, number, house, province, city, barangay, targetID} = await req.json();
        
        const user = await getUser(req);
        conn = await getPool.getConnection();
        
        await conn.execute("UPDATE addresses SET fullname = ?, number = ?, house = ?, province = ?, city = ?, barangay = ? WHERE id = ? AND customer_id = ?;", [fullname, number, house, province, city, barangay, targetID, user?.id]);

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

export async function DELETE(req: Request) {
    let conn;
    try {
        const {id} = await req.json();
        
        const user = await getUser(req);
        conn = await getPool.getConnection();
        
        await conn.execute("DELETE FROM addresses WHERE id = ? AND customer_id = ?;", [id, user?.id]);

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

export async function GET(req: Request) {
    let conn;
    try {
        const user = await getUser(req);
        conn = await getPool.getConnection();

        const [res] = await conn.execute("SELECT * FROM addresses WHERE customer_id = ?;", [user?.id]);

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