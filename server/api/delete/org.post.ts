import pool, { poolPromise } from '../db/connection';  // Ensure this points to your updated connection module
import type { ServerResponse } from '~/interfaces/ServerResponse';

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);

        if (!body || !body.orgid) {
            return {
                statusCode: 400,
                body: 'Bad Request'
            };
        }

        const orgid = body.orgid;

        await poolPromise;
        try {
            // Use a transaction for atomicity
            await pool.query('BEGIN');
            
            const result1 = await pool.query(
                'DELETE FROM employee WHERE orgid = $1',
                [orgid]
            );
            
            const result2 = await pool.query(
                'DELETE FROM organisation WHERE id = $1',
                [orgid]
            );

            await pool.query('COMMIT');

            return {
                statusCode: 200,
                body: 'Organisation Deleted'
            };
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error("Error executing query:", error);
            return {
                statusCode: 500,
                body: 'Internal Server Error'
            };
        }
    }
    return {
        statusCode: 405,
        body: 'Method Not Allowed'
    };
});
