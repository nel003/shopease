import getPool from "@/database/connection";


export async function GET(req: Request) {
    let conn;
    try {
        conn = await getPool.getConnection();

        const [resS]: any = await conn.execute(`
            SELECT 
                SUM(oi.quantity * pe.price) AS sum,
                (SELECT SUM(total) FROM orders WHERE status = 3) AS sales,
                (SELECT COUNT(id) FROM customers) AS customers_count,
                (SELECT COUNT(id) FROM products) AS products_count,
                (SELECT COUNT(id) FROM orders) AS orders_count
            FROM order_items AS oi 
            JOIN product_entry AS pe ON pe.id = oi.product_entry_id
            `);
        
        const [resO] = await conn.execute("SELECT number, quantity, total FROM orders LIMIT 9;");

        const [resD] = await conn.execute("SELECT order_on, SUM(total) AS total FROM orders WHERE order_on >= CURDATE() - INTERVAL 7 DAY ORDER BY order_on;");
        console.log(resD)

        return Response.json({stats: resS[0], orders: resO, chart: resD});
    } catch (error) {
        console.log(error);
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