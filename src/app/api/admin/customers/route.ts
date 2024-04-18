import mysqlConfig from "../../../../database/connection"
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter")?.trim() || "";
        const pool = await mysql.createPool(mysqlConfig);
        const conn = await pool.getConnection();

        const [result] = await conn.execute<RowDataPacket[]>(`SELECT * FROM customers WHERE username like '%${filter}%' OR email like '%${filter}%' OR name like '%${filter}%' ORDER BY id DESC LIMIT 1000;`);

        await conn.release();
        await pool.end();

        const newRes = result.map(i => ({...i, password: null}));
        return Response.json(newRes);
    } catch (error: any) {
        console.log(error)
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
    
}

export async function DELETE(req: Request) {
    try {
        const {id, many} = await req.json();
        const pool = await mysql.createPool(mysqlConfig);
        const conn = await pool.getConnection();
        
        if (many) {
            await conn.execute(`DELETE FROM tokens WHERE customer_id IN (${Array(id).toString()});`);
            await conn.execute(`DELETE FROM customers WHERE id IN (${Array(id).toString()});`);
        } else {
            await conn.execute(`DELETE FROM tokens WHERE customer_id = ?;`, [id]);
            await conn.execute(`DELETE FROM customers WHERE id = ?;`, [id]);
        }

        await conn.release();
        await pool.end();
        return Response.json({message: 'Success'});
    } catch (error: any) {
        if (error.code) {
            return new Response(JSON.stringify({message: "User has data in other tables"}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

export async function PUT(req: Request) {
    try {
        const {id, name, username, email, gender, status} = await req.json();
        const pool = await mysql.createPool(mysqlConfig);
        const conn = await pool.getConnection();

        await conn.execute("UPDATE customers SET name = ?, username = ?, email = ?, gender = ?, status = ? WHERE id = ?;", [name, username, email, gender, status, id]);

        await conn.release();
        await pool.end();
        return Response.json({message: 'Success'});
    } catch(error: any) {
        if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("customers.username")) {
            return new Response(JSON.stringify({message: "Username is already in use"}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        if (error.code === "ER_DUP_ENTRY" && error.sqlMessage.includes("customers.email")) {
            return new Response(JSON.stringify({message: "Email address is already in use"}), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        return new Response(JSON.stringify({message: "Server error"}), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}