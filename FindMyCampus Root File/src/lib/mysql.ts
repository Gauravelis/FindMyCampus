import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root', // Default XAMPP MySQL user
  password: '', // Default XAMPP MySQL password is a blank string
  database: 'findmycampus_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function isDatabaseConnected(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('MySQL connection check failed:', error);
    return false;
  }
}

export default pool;