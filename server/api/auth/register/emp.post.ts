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
    
        if (typeof employee.firstName !== 'string' || /\d/.test(employee.firstName)) {
            throw new Error('Invalid first name');
        }
    
        if (typeof employee.lastName !== 'string' || /\d/.test(employee.lastName)) {
            throw new Error('Invalid last name');
        }
    
        if (isNaN(Date.parse(employee.birthDate))) {
            throw new Error('Invalid birth date');
        }
    
        if (typeof employee.linkedIn !== 'string') {
            throw new Error('Invalid LinkedIn URL');
        }
    
        // check if LinkedIn is a valid URL
        try {
            new URL(employee.linkedIn);
        } catch (error) {
            throw new Error('Invalid LinkedIn URL');
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
    
        if (typeof employee.orgId !== 'string') {
            throw new Error('Invalid orgId');
        }
    
        // check if orgId is a valid UUID
        if (!validate(employee.orgId)) {
            throw new Error('Invalid orgId');
        }
    
        if (typeof employee.employeeId !== 'string') {
            throw new Error('Invalid employeeId');
        }
    
        // check if employeeId is a valid UUID
        if (!validate(employee.employeeId)) {
            throw new Error('Invalid employeeId');
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
