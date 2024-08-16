import bcrypt from 'bcrypt';
import { createEmployee } from '../db/auth';
import { validate } from 'uuid';
import { poolPromise } from '../db/connection';

export default defineEventHandler(async (req) => {
    await poolPromise;

    const body = await readBody(req);

    const employee = body?.['<target>'] || body;

    if (!employee) {
        return new Response('Invalid request', { status: 400 });
    }

    if (typeof employee.firstName !== 'string' || /\d/.test(employee.firstName)) {
        return new Response('Invalid first name', { status: 400 });
    }

    if (typeof employee.lastName !== 'string' || /\d/.test(employee.lastName)) {
        return new Response('Invalid last name', { status: 400 });
    }

    if (isNaN(Date.parse(employee.birthDate))) {
        return new Response('Invalid birth date', { status: 400 });
    }

    if (typeof employee.linkedIn !== 'string') {
        return new Response('Invalid linkedIn', { status: 400 });
    }

    // check if linkedin is a valid URL
    try {
        new URL(employee.linkedIn);
    } catch (error) {
        return new Response('Invalid linkedIn', { status: 400 });
    }

    if (typeof employee.email !== 'string') {
        return new Response('Invalid email', { status: 400 });
    }

    // check if email is a valid email
    if (!/^.+@.+\..+$/.test(employee.email)) {
        return new Response('Invalid email', { status: 400 });
    }

    if (typeof employee.password !== 'string') {
        return new Response('Invalid password', { status: 400 });
    }

    // check if password is strong enough
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/.test(employee.password)) {
        return new Response('Password is not strong enough', { status: 400 });
    }

    if (typeof employee.orgId !== 'string') {
        return new Response('Invalid orgId', { status: 400 });
    }

    // check if orgId is a valid UUID
    if (!validate(employee.orgId)) {
        return new Response('Invalid orgId', { status: 400 });
    }


    if (typeof employee.employeeId !== 'string') {
        return new Response('Invalid employeeId', { status: 400 });
    }

    // check if employeeId is a valid UUID
    if (!validate(employee.employeeId)) {
        return new Response('Invalid employeeId', { status: 400 });
    }

    // create the employee
    const result = await createEmployee(employee);

    if (!result) {
        return new Response('Failed to create employee', { status: 500 });
    }

    return new Response('Employee created', { status: 201 });
});
