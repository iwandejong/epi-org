import { poolPromise, pool } from '../db/connection';
import sql from 'mssql';

export default defineEventHandler(async (event) => {
    if (event.req.method === 'POST') {
        const body = await readBody(event);

        if (!body || !body.orgId) {
            return new Response('Invalid request', { status: 400 });
        }

        const orgId = body.orgId;

        // console.log('orgId', orgId);

        await poolPromise;
        try {
            const result = await pool.request()
                .input('OrgID', sql.UniqueIdentifier, orgId)
                .query('SELECT * FROM employee WHERE orgId = @OrgID');

            return {
                statusCode: 200,
                body: result.recordset
            };
        } catch (error) {
            return new Response('Database query error', { status: 500 });
        }
    }
    return new Response('Invalid request method', { status: 405 });
});
