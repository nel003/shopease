import getPool from "@/database/connection";
import getUser from "@/utils/api/JWTuser";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import crypto from "crypto";
interface Item extends RowDataPacket {
    id: number
    quantity: number
    product_name: string
    thumbnail: string
    variant_name: string
    price: number
    product_id: number
    product_entry_id: number
}

interface Stock extends RowDataPacket {
    id: number
    stock: number
}

function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(4);
    const randomNumber = parseInt(randomBytes.toString('hex'), 16).toString(); 
    return timestamp + randomNumber;
}

export async function POST(req: Request) {
    let conn;
    try {
        const { address, payment, shipping } = await req.json();
        conn = await getPool.getConnection();
        conn.beginTransaction();
        const user = await getUser(req);
        let total = 0;
        let quantity = 0;
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const [resc] = await conn.execute<Item[]>("SELECT c.id, c.product_entry_id, SUM(c.quantity) as quantity, p.id AS product_id, p.product_name, p.thumbnail, pe.price, pe.name as variant_name FROM cart AS c JOIN product_entry AS pe ON pe.id = c.product_entry_id JOIN products AS p ON p.id = pe.product_id WHERE customer_id = ? GROUP BY c.product_entry_id ORDER BY c.product_entry_id;", [user?.id]);
        if (resc.length < 1) {
            return new Response(JSON.stringify({message: "Cart is empty!"}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const [resp] = await conn.execute<Stock[]>(`SELECT * FROM product_entry WHERE id IN (${resc.map(i => (i.product_entry_id)).join(',')});`);
        
        for(let i of resc) {
            total += i.quantity * i.price;
            quantity += +i.quantity;

            const left = resp.find(j => (j.id === i.product_entry_id))?.stock;
            console.log(+i.quantity > ( left || 0) )
            if (+i.quantity > ( left || 0) ) {
                return new Response(JSON.stringify({message: "Not enough stock for `"+i.product_name+":"+i.variant_name+"` only "+left+" left."}), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }
        };
        if (shipping === 2) {
            total += 120;
        }   

        const [reso] = await conn.execute<ResultSetHeader>("INSERT INTO orders VALUES(0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [generateOrderNumber(), user?.id, address, payment, 1, 'Your order is being processed.', '', quantity, total, now]);
        for(let i of resc) {
            await conn.execute("INSERT INTO order_items VALUES(0, ?, ?, ?, ?, ?);", [user?.id, reso.insertId, i.product_id, i.product_entry_id, i.quantity]);
            await conn.execute("UPDATE product_entry SET stock = stock - ? WHERE id = ?;", [i.quantity, i.product_entry_id]);
        }

        await conn.execute("DELETE FROM cart WHERE customer_id = ?;", [user?.id]);

        await conn.commit();
        return Response.json({message: "Success"});
    } catch(error) {
        await conn?.rollback();
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } finally {
        conn?.release();
    }
}