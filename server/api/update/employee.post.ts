import pool, { poolPromise } from '../db/connection';
import sql from 'mssql';
import type { ServerResponse } from '~/interfaces/ServerResponse';
import type { Employee } from '~/interfaces/Employee';
// import bcrypt from 'bcrypt';
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
            console.log("Updating password");
            // const hashedPassword = await bcrypt.hash(employee.password.trim(), 10);
            const hashedPassword = crypto.createHash('sha256').
                update(employee.password.trim()).
                digest('hex');
    
            await poolPromise;
            // const result = await pool.request()
            //     .input('firstname', sql.NVarChar, employee.firstname)
            //     .input('lastname', sql.NVarChar, employee.lastname)
            //     .input('birthdate', sql.Date, employee.birthdate)
            //     .input('linkedin', sql.NVarChar, employee.linkedin)
            //     .input('Email', sql.NVarChar, employee.email)
            //     .input('employeeid', sql.UniqueIdentifier, employee.employeeid)
            //     .input('Bio', sql.Text, employee.bio)
            //     .input('GravatarURL', sql.NVarChar, employee.gravatarurl)
            //     // .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
            //     .input('orgid', sql.UniqueIdentifier, employee.orgid)
            //     .input('leavedays', sql.Int, employee.leavedays)
            //     .input('Salary', sql.Float, employee.salary)
            //     .input('Role', sql.NVarChar, employee.role)
            //     .input('ManagerId', sql.UniqueIdentifier, employee.manager)
            //     .input('JoinDate', sql.Date, employee.joiningdate)
            //     .input('Password', sql.NVarChar, hashedPassword)
            //     .query(`
            //         UPDATE employee
            //         SET firstname = @firstname,
            //             lastname = @lastname,
            //             birthdate = @birthdate,
            //             linkedin = @linkedin,
            //             email = @Email,
            //             bio = @Bio,
            //             gravatarurl = @GravatarURL,
            //             orgid = @orgid,
            //             leavedays = @leavedays,
            //             salary = @Salary,
            //             role = @Role,
            //             manager = @ManagerId,
            //             joiningdate = @JoinDate,
            //             password = @Password
            //         WHERE employeeid = @employeeid
            //     `);
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
            // const result = await pool.request()
            //     .input('firstname', sql.NVarChar, employee.firstname)
            //     .input('lastname', sql.NVarChar, employee.lastname)
            //     .input('birthdate', sql.Date, employee.birthdate)
            //     .input('linkedin', sql.NVarChar, employee.linkedin)
            //     .input('Email', sql.NVarChar, employee.email)
            //     .input('employeeid', sql.UniqueIdentifier, employee.employeeid)
            //     .input('Bio', sql.Text, employee.bio)
            //     .input('GravatarURL', sql.NVarChar, employee.gravatarurl)
            //     // .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
            //     .input('orgid', sql.UniqueIdentifier, employee.orgid)
            //     .input('leavedays', sql.Int, employee.leavedays)
            //     .input('Salary', sql.Float, employee.salary)
            //     .input('Role', sql.NVarChar, employee.role)
            //     .input('ManagerId', sql.UniqueIdentifier, employee.manager)
            //     .input('JoinDate', sql.Date, employee.joiningdate)
            //     // .input('Password', sql.NVarChar, null)
            //     .query(`
            //         UPDATE employee
            //         SET firstname = @firstname,
            //             lastname = @lastname,
            //             birthdate = @birthdate,
            //             linkedin = @linkedin,
            //             email = @Email,
            //             bio = @Bio,
            //             gravatarurl = @GravatarURL,
            //             orgid = @orgid,
            //             leavedays = @leavedays,
            //             salary = @Salary,
            //             role = @Role,
            //             manager = @ManagerId,
            //             joiningdate = @JoinDate
            //         WHERE employeeid = @employeeid
            //     `);
            //     // hierarchyId = @HierarchyId,

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
