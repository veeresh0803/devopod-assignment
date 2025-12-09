const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();

    if (typeof conn.ping === 'function') {
      await conn.ping();
    } else {
      await conn.query('SELECT 1');
    }
    conn.release();
    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = pool;
module.exports.testConnection = testConnection;
