import pool, { poolPromise } from '../db/connection';
import type { ServerResponse } from '~/interfaces/ServerResponse';
import type { Employee } from '~/interfaces/Employee';
import crypto from 'crypto';

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    if (event.req.method === 'POST') {
        const body = await readBody(event);

        if (!body) {
            return {
                statusCode: 400,
                body: 'Bad Request'
            }
        }

        const employee = body as Employee;

        // user has already been invited, must fill in missing details
        if (employee.password) {
            console.log("Updating password");
            const hashedPassword = crypto.createHash('sha256').
                update(employee.password.trim()).
                digest('hex');
    
            await poolPromise;
    
            const client = await pool.connect();
            const result = await client.query(
                `
                UPDATE employee
                SET firstname = $1,
                    lastname = $2,
                    birthdate = $3,
                    linkedin = $4,
                    bio = $5,
                    gravatarurl = $6,
                    joiningdate = $7,
                    password = $8
                WHERE employeeid = $9
                `,
                [
                    employee.firstname,
                    employee.lastname,
                    employee.birthdate,
                    employee.linkedin,
                    employee.bio,
                    employee.gravatarurl,
                    employee.joiningdate,
                    hashedPassword,
                    employee.employeeid
                ]
            );

            client.release();

            // console.log("Result", result);
            
            if (result.rowCount === 0) {
                return {
                    statusCode: 400,
                    body: 'Bad Request'
                }
            }
        
            return {
                statusCode: 200,
                body: 'OK'
            }
        } else {
            await poolPromise;

            const client = await pool.connect();
            const result = await client.query(
                `
                INSERT INTO employee (email, orgid, leavedays, salary, role, manager, employeeid)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                `,
                [
                    employee.email,
                    employee.orgid,
                    employee.leavedays,
                    employee.salary,
                    employee.role,
                    employee.manager,
                    employee.employeeid
                ]
            );
            client.release();
                
            if (result.rowCount === 0) {
                return {
                    statusCode: 400,
                    body: 'Bad Request'
                }
            }
            
            return {
                statusCode: 200,
                body: 'OK'
            }
        }
    } else {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        }
    }
});
