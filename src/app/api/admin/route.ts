import connection from "../../../../database/connection"
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET() {
    const conn: mysql.Connection = await connection();

    const [result] = await conn.query<RowDataPacket[]>("SELECT * FROM customers LIMIT 1000;");

    return Response.json(result);
}