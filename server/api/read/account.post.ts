import pool, { poolPromise } from '../db/connection';
// import sql from 'mssql';

export default defineEventHandler(async (event) => {
    if (event.req.method === 'POST') {
        const body = await readBody(event);

        console.log('body', body);

        if (!body || !body.empId) {
            return new Response('Invalid request', { status: 400 });
        }

        const employeeid = body.empId;

        // console.log('employeeid', employeeid);

        await poolPromise;
        try {
            const result = await pool.query(
                'SELECT * FROM employee WHERE employeeid = $1', [employeeid]
            );

            // console.log('Result', result.recordset[0]);

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
    }
});
