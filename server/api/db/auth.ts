import pool,  { poolPromise } from './connection';  // Ensure this points to your updated connection module
import crypto from 'crypto';
import type { Employee } from '~/interfaces/Employee';
import { Organisation } from '~/interfaces/Organisation';

export const getEmployee = async (email: string) => {
    await poolPromise;
    const result = await pool.query(
        'SELECT * FROM employee WHERE email = $1',
        [email]
    );
    if (result.rows.length === 0) {
        return false;
    }
    return result.rows[0];
};

export const authenticateEmployee = async (email: string, password: string) => {
    await poolPromise;
    const employee = await getEmployee(email);
    if (!employee) {
        return false;
    }

    password = password.trim();
    const pw = employee.password.trim();

    try {
        const passwordMatch = crypto.createHash('sha256')
            .update(password)
            .digest('hex') === pw;
        return passwordMatch ? employee : false;
    } catch (error) {
        console.error("Error during password comparison:", error);
        return false;
    }
};

export const createEmployee = async (employee: Employee) => {
    if (!employee.password) {
        return false;
    }
    const hashedPassword = crypto.createHash('sha256')
        .update(employee.password.trim())
        .digest('hex');

    await poolPromise;
    const result = await pool.query(
        `
        INSERT INTO employee (firstname, lastname, birthdate, employeeid, salary, role, manager, joiningdate, leavedays, linkedin, orgid, email, password, bio, gravatarurl)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `,
        [
            employee.firstname,
            employee.lastname,
            employee.birthdate,
            employee.employeeid,
            0,
            'Admin',
            null,
            new Date(),
            0,
            employee.linkedin,
            employee.orgid,
            employee.email,
            hashedPassword,
            employee.bio,
            employee.gravatarurl
        ]
    );
    if (result === null || result.rowCount === null) {
        return false;
    }
    return result.rowCount > 0;
};

export const updateEmployee = async (employee: Employee) => {
    if (employee.password) {
        console.log("Updating password");
        const hashedPassword = crypto.createHash('sha256')
            .update(employee.password.trim())
            .digest('hex');

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
        if (result === null || result.rowCount === null) {
            return false;
        }
        return result.rowCount > 0;
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
        if (result === null || result.rowCount === null) {
            return false;
        }
        return result.rowCount > 0;
    }
};

export const getOrg = async (orgid: string) => {
    await poolPromise;
    const result = await pool.query(
        'SELECT * FROM organisation WHERE id = $1',
        [orgid]
    );
    return result.rows[0];
};

export const createOrg = async (org: Organisation) => {
    await poolPromise;
    const result = await pool.query(
        `
        INSERT INTO organisation (id, name)
        VALUES ($1, $2)
        `,
        [org.id, org.name]
    );
    if (result === null || result.rowCount === null) {
        return false;
    }
    return result.rowCount > 0;
};
