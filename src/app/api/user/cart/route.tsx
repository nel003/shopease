import pool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";
import { RowDataPacket } from "mysql2";

interface Item extends RowDataPacket {
    id: number
    quantity: number
    product_name: string
    thumbnail: string
    variant_name: string
    price: number
}

export async function GET(req: Request) {
    let conn;
    try {
        const user = await getUser(req);
        conn = await pool.getConnection();

        const [res] = await conn.execute<Item[]>("SELECT c.id, c.product_entry_id, SUM(c.quantity) as quantity, p.product_name, p.thumbnail, pe.price, pe.name as variant_name FROM cart AS c JOIN product_entry AS pe ON pe.id = c.product_entry_id JOIN products AS p ON p.id = pe.product_id WHERE customer_id = ? GROUP BY c.product_entry_id ORDER BY c.product_entry_id;", [user?.id]);

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

export async function DELETE(req: Request) {
    let conn;
    try {
        const {id} = await req.json();
        const user = await getUser(req);
        conn = await pool.getConnection();

        await conn.execute("DELETE FROM cart WHERE customer_id = ? AND id = ?;", [user?.id, id]);

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

export async function POST(req: Request) {
    let conn;
    try {
        const {product_entry_id, quantity, product_id} = await req.json();
        const user = await getUser(req);
        conn = await pool.getConnection();

        await conn.execute("INSERT INTO cart(customer_id, product_entry_id, quantity, product_id) VALUES(?, ?, ?, ?);", [user?.id, product_entry_id, quantity, product_id]);

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
        const {id, type} = await req.json();
        const user = await getUser(req);
        conn = await pool.getConnection();

        if (type === "increment") {
            await conn.execute("UPDATE cart SET quantity = quantity + 1 WHERE customer_id = ? AND id = ?;", [user?.id, id]);
        } else {
            await conn.execute("UPDATE cart SET quantity = quantity - 1 WHERE customer_id = ? AND id = ? AND quantity > 1;", [user?.id, id]);
        }

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