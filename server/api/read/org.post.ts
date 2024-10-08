import pool, { poolPromise } from '../db/connection';
import sql from 'mssql';
import type { ServerResponse } from '~/interfaces/ServerResponse';

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    const body = await readBody(event);

    if (!body || !body.orgid) {
        return {
            statusCode: 400,
            body: 'Bad Request'
        }
    }

    const orgid = body.orgid;

    await poolPromise;
    try {
        const result = await pool.query(
            'SELECT * FROM organisation WHERE id = $1', [orgid]
        );
        
        return {
            statusCode: 200,
            body: result.rows[0]
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Database query error'
        }
    }
});