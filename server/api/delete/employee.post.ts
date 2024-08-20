import pool, { poolPromise } from '../db/connection';  // Ensure this points to your updated connection module
import type { ServerResponse } from '~/interfaces/ServerResponse';

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);

        if (!body || !body.employeeid) {
            return {
                statusCode: 400,
                body: 'Bad Request'
            };
        }

        const employeeid = body.employeeid;

        await poolPromise;
        try {
            const result = await pool.query(
                'DELETE FROM employee WHERE employeeid = $1',
                [employeeid]
            );

            return {
                statusCode: 200,
                body: { affectedRows: result.rowCount } // PostgreSQL uses rowCount to determine the number of affected rows
            };
        } catch (error) {
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
