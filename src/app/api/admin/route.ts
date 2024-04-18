import mysqlConfig from "../../../database/connection"
import mysql, { RowDataPacket } from 'mysql2/promise';

export async function GET() {
    const pool = await mysql.createPool(mysqlConfig);
    const conn = await pool.getConnection();

    const [result] = await conn.query<RowDataPacket[]>("SELECT * FROM customers LIMIT 1000;");

    await conn.release();
    await pool.end();
    return Response.json(result);
}