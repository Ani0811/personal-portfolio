require('dotenv').config();
const mysql = require('mysql2/promise');

function parseDatabaseUrl() {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) return null;
  try {
    const u = new URL(DATABASE_URL);
    const host = u.hostname;
    const port = u.port || '3306';
    const user = decodeURIComponent(u.username || '');
    const password = decodeURIComponent(u.password || '');
    const database = u.pathname ? u.pathname.replace(/^\//, '') : '';
    return { host, port: parseInt(port, 10), user, password, database };
  } catch (err) {
    console.error('Invalid DATABASE_URL:', err.message);
    return null;
  }
}

const urlConfig = parseDatabaseUrl();

const host = urlConfig?.host || process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const port = urlConfig?.port || parseInt(process.env.DB_PORT || process.env.MYSQLPORT || '3306', 10);
const user = urlConfig?.user || process.env.DB_USER || process.env.MYSQLUSER || 'root';
const password = urlConfig?.password || process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '';
const database = urlConfig?.database || process.env.DB_NAME || process.env.MYSQLDATABASE || 'portfolio';

const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection({ retries = 8, delayMs = 3000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await pool.getConnection();
      console.log('MySQL connected successfully');
      conn.release();
      return;
    } catch (err) {
      const last = attempt === retries;
      console.error(`MySQL connection attempt ${attempt}/${retries} failed:`, err.message);
      if (last) {
        console.error('All MySQL connection attempts failed. Exiting.');
        process.exit(1);
      }
      const wait = Math.min(delayMs * 2 ** (attempt - 1), 30000);
      console.log(`Retrying in ${wait}ms...`);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => setTimeout(res, wait));
    }
  }
}

module.exports = { pool, testConnection };
