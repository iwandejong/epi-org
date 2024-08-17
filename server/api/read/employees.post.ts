import { poolPromise, pool } from '../db/connection';
import sql from 'mssql';
import type { ServerResponse } from '~/interfaces/ServerResponse';

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);

        if (!body || !body.orgId) {
            return {
                statusCode: 400,
                body: 'Bad Request'
            }
        }

        const orgId = body.orgId;

        console.log('orgId', orgId);

        await poolPromise;
        try {
            const result = await pool.request()
                .input('OrgID', sql.UniqueIdentifier, orgId)
                .query('SELECT * FROM employee WHERE orgId = @OrgID');

            // console.log('result', result.recordset);

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
