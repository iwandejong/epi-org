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
            const client = await pool.connect();
            // get current employee's manager id
            const managerid = await client.query(
                'SELECT manager FROM employee WHERE employeeid = $1',
                [employeeid]
            );

            const result = await client.query(
                'DELETE FROM employee WHERE employeeid = $1',
                [employeeid]
            );

            // also delete any references to this employee in the manager column
            const result2 = await client.query(
                'UPDATE employee SET manager = $1 WHERE manager = $2',
                [managerid.rows[0].manager, employeeid]
            );
            client.release();

            return {
                statusCode: 200,
                body: {
                    deleted: result.rowCount,
                    updated: result2.rowCount
                } // PostgreSQL uses rowCount to determine the number of affected rows
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
