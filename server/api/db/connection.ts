import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    ssl: process.env.POSTGRES_URL?.includes('sslmode=require') || process.env.POSTGRES_URL_NO_SSL?.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false
});

export const poolPromise = pool.connect();
export default pool;    