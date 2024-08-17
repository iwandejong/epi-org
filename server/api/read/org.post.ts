// export const getOrg = async (orgId: string) => {
//     await poolPromise;
//     const result = await pool.request()
//         .input('OrgId', sql.UniqueIdentifier, orgId)
//         .query('SELECT * FROM organisation WHERE orgId = @OrgId');
//     return result.recordset[0];
// };

import { poolPromise, pool } from '../db/connection';
import sql from 'mssql';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body || !body.orgId) {
        return new Response('Invalid request', { status: 400 });
    }

    const orgId = body.orgId;

    await poolPromise;
    try {
        const result = await pool.request()
            .input('OrgID', sql.UniqueIdentifier, orgId)
            .query(`SELECT * FROM organisation WHERE id = @OrgID`);
        
        return {
            statusCode: 200,
            body: result.recordset[0]
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Database query error'
        }
    }
});