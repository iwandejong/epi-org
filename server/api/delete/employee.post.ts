import { poolPromise, pool } from '../db/connection';
import sql from 'mssql';
import type { ServerResponse } from '~/interfaces/ServerResponse';

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);

        if (!body || !body.employeeId) {
            return {
                statusCode: 400,
                body: 'Bad Request'
            }
        }

        const employeeId = body.employeeId;

        await poolPromise;
        try {
            const result = await pool.request()
                .input('EmployeeID', sql.UniqueIdentifier, employeeId)
                .query('DELETE FROM employee WHERE employeeId = @EmployeeID');

            return {
                statusCode: 200,
                body: result.recordset
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
