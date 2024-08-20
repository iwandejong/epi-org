import { createClient } from '@vercel/postgres';

const client = createClient({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export const poolPromise = client.connect();

export default client;
