import pool, { poolPromise } from '../db/connection';
import sql from 'mssql';
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


        if (employee.password) {
            
            const hashedPassword = crypto.createHash('sha256').
                update(employee.password.trim()).
                digest('hex');
    
            await poolPromise;
            const result = await pool.query(
                `
                UPDATE employee
                SET firstname = $1,
                    lastname = $2,
                    birthdate = $3,
                    linkedin = $4,
                    email = $5,
                    bio = $6,
                    gravatarurl = $7,
                    orgid = $8,
                    leavedays = $9,
                    salary = $10,
                    role = $11,
                    manager = $12,
                    joiningdate = $13,
                    password = $14
                WHERE employeeid = $15
                `,
                [
                    employee.firstname,
                    employee.lastname,
                    employee.birthdate,
                    employee.linkedin,
                    employee.email,
                    employee.bio,
                    employee.gravatarurl,
                    employee.orgid,
                    employee.leavedays,
                    employee.salary,
                    employee.role,
                    employee.manager,
                    employee.joiningdate,
                    hashedPassword,
                    employee.employeeid
                ]
            );
    
            // 
            
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
            const result = await pool.query(
                `
                UPDATE employee
                SET firstname = $1,
                    lastname = $2,
                    birthdate = $3,
                    linkedin = $4,
                    email = $5,
                    bio = $6,
                    gravatarurl = $7,
                    orgid = $8,
                    leavedays = $9,
                    salary = $10,
                    role = $11,
                    manager = $12,
                    joiningdate = $13
                WHERE employeeid = $14
                `,
                [
                    employee.firstname,
                    employee.lastname,
                    employee.birthdate,
                    employee.linkedin,
                    employee.email,
                    employee.bio,
                    employee.gravatarurl,
                    employee.orgid,
                    employee.leavedays,
                    employee.salary,
                    employee.role,
                    employee.manager,
                    employee.joiningdate,
                    employee.employeeid
                ]
            );
                
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
