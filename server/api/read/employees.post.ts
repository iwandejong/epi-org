import pool, { poolPromise } from '../db/connection';
import type { ServerResponse } from '~/interfaces/ServerResponse';

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);

        console.log('body', body);
        if (!body || !body.orgid) {
            return {
                statusCode: 400,
                body: 'Bad Request'
            }
        }

        const orgid = body.orgid;

        console.log('orgid', orgid);

        await poolPromise;
        try {
            const result = await pool.query(
                'SELECT * FROM employee WHERE orgid = $1 AND joiningdate IS NOT NULL', [orgid]
            );

            return {
                statusCode: 200,
                body: result.rows
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: error
            };
        }
    }
    return {
        statusCode: 405,
        body: 'Method Not Allowed'
    }
});
