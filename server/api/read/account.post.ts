import { poolPromise, pool } from '../db/connection';
import sql from 'mssql';

export default defineEventHandler(async (event) => {
    if (event.req.method === 'POST') {
        const body = await readBody(event);

        if (!body || !body.empId) {
            return new Response('Invalid request', { status: 400 });
        }

        const employeeId = body.empId;

        console.log('employeeId', employeeId);

        await poolPromise;
        try {
            const result = await pool.request()
                .input('EmployeeID', sql.UniqueIdentifier, employeeId)
                .query('SELECT * FROM employee WHERE employeeId = @EmployeeID');

            console.log('Result', result.recordset[0]);

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
    }
});
