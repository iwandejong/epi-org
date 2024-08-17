import bcrypt from 'bcrypt';
import {
    createEmployee,
    createOrg,
    getEmployee
} from '../../db/auth';
import { validate } from 'uuid';
import { poolPromise } from '../../db/connection';
import { v4 as uuidv4 } from 'uuid';

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

        // console.log('Creating employee');

        // check if password is strong enough
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(employee.password)) {
            throw new Error('Password is not strong enough');
        }

        if (typeof employee.orgName !== 'string') {
            throw new Error('Invalid organisation name');
        }

        // generate orgId
        const orgId = uuidv4();
        employee.orgId = orgId;

        // create org
        const org = await createOrg({ id: orgId, name: employee.orgName });
        // console.log(org);

        if (!org) {
            // console.log('Failed to create organisation');
            throw new Error('Failed to create organisation');
        }

        // generate employeeId
        const employeeId = uuidv4();
        employee.employeeId = employeeId;

        employee.hierarchyId = '/1/';

        // console.log(employee);

        // create the employee
        const emp = await createEmployee(employee);
        // console.log(emp);

        if (!emp) {
            // console.log('Failed to create employee');
            throw new Error('Failed to create employee');
        }

        return {
            statusCode: 200,
            body: {
                message: 'Employee and organisation created successfully'
            }
        }
    } catch (error : any) {
        return {
            statusCode: error.response ? error.response.status : 500,
            body: {
                message: error.message
            }
        }
    }
});
