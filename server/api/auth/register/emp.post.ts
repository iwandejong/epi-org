import {
    updateEmployee,
    getEmployee
} from '../../db/auth';
import { validate } from 'uuid';
import { poolPromise } from '../../db/connection';

export default defineEventHandler(async (req) => {
    await poolPromise;

    const body = await readBody(req);
    const employee = body?.['<target>'] || body;

    try {
        if (!employee) {
            throw new Error('Invalid request');
        }
    
        if (typeof employee.firstname !== 'string' || /\d/.test(employee.firstname)) {
            throw new Error('Invalid first name');
        }
    
        if (typeof employee.lastname !== 'string' || /\d/.test(employee.lastname)) {
            throw new Error('Invalid last name');
        }
    
        if (isNaN(Date.parse(employee.birthdate))) {
            throw new Error('Invalid birth date');
        }
    
        if (typeof employee.linkedin !== 'string') {
            throw new Error('Invalid linkedin URL');
        }
    
        // check if linkedin is a valid URL
        try {
            new URL(employee.linkedin);
        } catch (error) {
            throw new Error('Invalid linkedin URL');
        }
    
        if (typeof employee.email !== 'string') {
            throw new Error('Invalid email');
        }
    
        // check if email is a valid email
        if (!/^.+@.+\..+$/.test(employee.email)) {
            throw new Error('Invalid email format');
        }
    
        if (typeof employee.password !== 'string') {
            throw new Error('Invalid password');
        }
    
        // check if email exists
        const existingEmployee = await getEmployee(employee.email);
    
        if (existingEmployee) {
            throw new Error('Email already exists');
        }
    
        // check if password is strong enough
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(employee.password)) {
            throw new Error('Password is not strong enough');
        }
    
        if (typeof employee.orgid !== 'string') {
            throw new Error('Invalid orgid');
        }
    
        // check if orgid is a valid UUID
        if (!validate(employee.orgid)) {
            throw new Error('Invalid orgid');
        }
    
        if (typeof employee.employeeid !== 'string') {
            throw new Error('Invalid employeeid');
        }
    
        // check if employeeid is a valid UUID
        if (!validate(employee.employeeid)) {
            throw new Error('Invalid employeeid');
        }
    
        // create the employee
        const result = await updateEmployee(employee);
    
        if (!result) {
            throw new Error('Failed to join organisation');
        }

        return {
            status: 201,
            body: {
                message: 'Employee created successfully and added to the organisation'
            }
        };
    } catch (error : any) {
        return {
            statusCode: error.response ? error.response.status : 500,
            body: {
                message: error.message
            }
        }
    }
});
