import { poolPromise, pool } from '../db/connection';
import sql from 'mssql';
import { updateEmployee } from '../db/auth';

export default defineEventHandler(async (event) => {
    if (event.req.method === 'POST') {
        const body = await readBody(event);

        if (!body) {
            return new Response('Invalid request', { status: 400 });
        }

        const employee = body;

        // console.log('employee', employee);

        // let payload = {
        //     firstName: employee.firstName,
        //     lastName: employee.lastName,
        //     birthDate: employee.birthDate,
        //     linkedIn: employee.linkedIn,
        //     email: employee.email,
        //     password: employee.password || null,
        //     employeeId: employee.employeeId,
        //     orgId: employee.orgId,
        //     bio: employee.bio,
        //     gravatarURL: employee.gravatarURL,
        //     hierarchyId: employee.hierarchyId
        // };

        // // console.log('payload', payload);


        await poolPromise;
        try {
            const result = await updateEmployee(employee);

            return {
                statusCode: 200,
                body: result
            };
        } catch (error) {
            return new Response('Database query error', { status: 500 });
        }
    }
});
