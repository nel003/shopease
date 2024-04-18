import mysql from 'mysql2/promise';

async function connection(): Promise<any> {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '12345678',
            database: 'shopease',
          });
        console.log("Connected to database");
        return conn;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default connection;