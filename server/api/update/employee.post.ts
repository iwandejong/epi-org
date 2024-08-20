import { poolPromise, pool } from '../db/connection';
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
            const result = await pool.request()
                .input('FirstName', sql.NVarChar, employee.firstName)
                .input('LastName', sql.NVarChar, employee.lastName)
                .input('BirthDate', sql.Date, employee.birthDate)
                .input('LinkedIn', sql.NVarChar, employee.linkedIn)
                .input('Email', sql.NVarChar, employee.email)
                .input('EmployeeId', sql.UniqueIdentifier, employee.employeeId)
                .input('Bio', sql.Text, employee.bio)
                .input('GravatarURL', sql.NVarChar, employee.gravatarURL)
                // .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
                .input('OrgId', sql.UniqueIdentifier, employee.orgId)
                .input('LeaveDays', sql.Int, employee.leaveDays)
                .input('Salary', sql.Float, employee.salary)
                .input('Role', sql.NVarChar, employee.role)
                .input('ManagerId', sql.UniqueIdentifier, employee.manager)
                .input('JoinDate', sql.Date, employee.joiningDate)
                .input('Password', sql.NVarChar, hashedPassword)
                .query(`
                    UPDATE employee
                    SET firstName = @FirstName,
                        lastName = @LastName,
                        birthDate = @BirthDate,
                        linkedIn = @LinkedIn,
                        email = @Email,
                        bio = @Bio,
                        gravatarURL = @GravatarURL,
                        orgId = @OrgId,
                        leaveDays = @LeaveDays,
                        salary = @Salary,
                        role = @Role,
                        manager = @ManagerId,
                        joiningDate = @JoinDate,
                        password = @Password
                    WHERE employeeId = @EmployeeId
                `);
                // hierarchyId = @HierarchyId,
    
            // console.log("Result", result);
            
            if (result.rowsAffected[0] === 0) {
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
            const result = await pool.request()
                .input('FirstName', sql.NVarChar, employee.firstName)
                .input('LastName', sql.NVarChar, employee.lastName)
                .input('BirthDate', sql.Date, employee.birthDate)
                .input('LinkedIn', sql.NVarChar, employee.linkedIn)
                .input('Email', sql.NVarChar, employee.email)
                .input('EmployeeId', sql.UniqueIdentifier, employee.employeeId)
                .input('Bio', sql.Text, employee.bio)
                .input('GravatarURL', sql.NVarChar, employee.gravatarURL)
                // .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
                .input('OrgId', sql.UniqueIdentifier, employee.orgId)
                .input('LeaveDays', sql.Int, employee.leaveDays)
                .input('Salary', sql.Float, employee.salary)
                .input('Role', sql.NVarChar, employee.role)
                .input('ManagerId', sql.UniqueIdentifier, employee.manager)
                .input('JoinDate', sql.Date, employee.joiningDate)
                // .input('Password', sql.NVarChar, null)
                .query(`
                    UPDATE employee
                    SET firstName = @FirstName,
                        lastName = @LastName,
                        birthDate = @BirthDate,
                        linkedIn = @LinkedIn,
                        email = @Email,
                        bio = @Bio,
                        gravatarURL = @GravatarURL,
                        orgId = @OrgId,
                        leaveDays = @LeaveDays,
                        salary = @Salary,
                        role = @Role,
                        manager = @ManagerId,
                        joiningDate = @JoinDate
                    WHERE employeeId = @EmployeeId
                `);
                // hierarchyId = @HierarchyId,
                
            if (result.rowsAffected[0] === 0) {
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
