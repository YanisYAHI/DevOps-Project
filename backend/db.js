import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,   // ← "db" en Docker
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
}