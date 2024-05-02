import mysql from 'mysql2/promise';

const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'shopease',
  }

const getPool = mysql.createPool(mysqlConfig);

export default getPool;