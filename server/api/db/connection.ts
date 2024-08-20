import { createPool } from "@vercel/postgres";

const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
});

export const poolPromise = pool.connect();

export default pool;
