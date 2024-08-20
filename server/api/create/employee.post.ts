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

        // user has already been invited, must fill in missing details
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
            //     .input('employeeid', sql.UniqueIdentifier, employee.employeeid)
            //     .input('Bio', sql.Text, employee.bio)
            //     .input('GravatarURL', sql.NVarChar, employee.gravatarurl)
            //     .input('JoinDate', sql.Date, employee.joiningdate)
            //     .input('Password', sql.NVarChar, hashedPassword)
            //     .query(`
            //         UPDATE employee
            //         SET firstname = @firstname,
            //             lastname = @lastname,
            //             birthdate = @birthdate,
            //             linkedin = @linkedin,
            //             bio = @Bio,
            //             gravatarurl = @GravatarURL,
            //             joiningdate = @JoinDate,
            //             password = @Password
            //         WHERE employeeid = @employeeid
            //     `);
                // hierarchyId = @HierarchyId,
    
            const result = await pool.query(
                `
                UPDATE employee
                SET email = $1,
                    orgid = $2,
                    leavedays = $3,
                    salary = $4,
                    role = $5,
                    manager = $6
                WHERE employeeid = $7
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
            //     .input('Email', sql.NVarChar, employee.email)
            //     .input('employeeid', sql.UniqueIdentifier, employee.employeeid)
            //     // .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
            //     .input('orgid', sql.UniqueIdentifier, employee.orgid)
            //     .input('leavedays', sql.Int, employee.leavedays)
            //     .input('Salary', sql.Float, employee.salary)
            //     .input('Role', sql.NVarChar, employee.role)
            //     .input('ManagerId', sql.UniqueIdentifier, employee.manager)
            //     .query(`
            //         INSERT INTO employee (email, employeeid, orgid, leavedays, salary, role, manager)
            //         VALUES (@Email, @employeeid, @orgid, @leavedays, @Salary, @Role, @ManagerId)
            //     `);
                // hierarchyId = @HierarchyId,

            const result = await pool.query(
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
