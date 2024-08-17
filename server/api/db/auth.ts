import { pool, poolPromise } from './connection';  // Assuming `sql` is exported from your connection module
import sql from 'mssql';
import bcrypt from 'bcrypt';
import type { Employee } from '~/interfaces/Employee';
import { Organisation } from '~/interfaces/Organisation';

export const getEmployee = async (email: string) => {
    await poolPromise;
    const result = await pool.request()
        .input('Email', sql.NVarChar, email)
        .query('SELECT * FROM employee WHERE email = @Email');
    if (result.recordset.length === 0) {
        return false;
    }
    return result.recordset[0];
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
        const passwordMatch = await bcrypt.compare(password, pw);
        if (!passwordMatch) {
            // console.log("Password mismatch");
        } else {
            // console.log("Password match");
        }
        return passwordMatch ? employee : false;
    } catch (error) {
        console.error("Error during password comparison:", error);
        return false;
    }
}

export const createEmployee = async (employee : Employee) => {
    if (!employee.password) {
        return false;
    }
    const hashedPassword = await bcrypt.hash(employee.password.trim(), 10);

    await poolPromise;
    const result = await pool.request()
        .input('FirstName', sql.NVarChar, employee.firstName)
        .input('LastName', sql.NVarChar, employee.lastName)
        .input('BirthDate', sql.Date, employee.birthDate)
        .input('EmployeeId', sql.UniqueIdentifier, employee.employeeId)
        .input('Salary', sql.Float, 0)
        .input('Role', sql.NVarChar, 'Admin')
        .input('ManagerId', sql.UniqueIdentifier, null)
        .input('JoinDate', sql.Date, new Date())
        .input('LeaveDays', sql.Int, 0)
        .input('LinkedIn', sql.NVarChar, employee.linkedIn)
        .input('OrgId', sql.UniqueIdentifier, employee.orgId)
        .input('Email', sql.NVarChar, employee.email)
        .input('Password', sql.NVarChar, hashedPassword)
        .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
        .input('Bio', sql.Text, employee.bio)
        .input('GravatarURL', sql.NVarChar, employee.gravatarURL)

        .query(`
            INSERT INTO employee (firstName, lastName, birthDate, employeeId, salary, role, manager, joiningDate, leaveDays, linkedIn, orgId, email, password, hierarchyId, bio, gravatarURL)
            VALUES (@FirstName, @LastName, @BirthDate, @EmployeeId, @Salary, @Role, @ManagerId, @JoinDate, @LeaveDays, @LinkedIn, @OrgId, @Email, @Password, @HierarchyId, @Bio, @GravatarURL)
        `);

    if (result.rowsAffected[0] === 0) {
        return false;
    }

    return true;
};

export const updateEmployee = async (employee: Employee) => {
    if (employee.password) {
        console.log("Updating password");
        const hashedPassword = await bcrypt.hash(employee.password.trim(), 10);

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
            .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
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
                    hierarchyId = @HierarchyId,
                    orgId = @OrgId,
                    leaveDays = @LeaveDays,
                    salary = @Salary,
                    role = @Role,
                    manager = @ManagerId,
                    joiningDate = @JoinDate,
                    password = @Password
                WHERE employeeId = @EmployeeId
            `);

            // console.log("Result", result);
            
            if (result.rowsAffected[0] === 0) {
                return false;
            }
        
            return true;
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
            .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
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
                    hierarchyId = @HierarchyId,
                    orgId = @OrgId,
                    leaveDays = @LeaveDays,
                    salary = @Salary,
                    role = @Role,
                    manager = @ManagerId,
                    joiningDate = @JoinDate
                WHERE employeeId = @EmployeeId
            `);
            
            if (result.rowsAffected[0] === 0) {
                return false;
            }
        
            return true;
    }
}

export const getOrg = async (orgId: string) => {
    await poolPromise;
    const result = await pool.request()
        .input('OrgId', sql.UniqueIdentifier, orgId)
        .query('SELECT * FROM organisation WHERE orgId = @OrgId');
    return result.recordset[0];
};

export const createOrg = async (org: Organisation) => {
    await poolPromise;
    const result = await pool.request()
        .input('ID', sql.UniqueIdentifier, org.id)
        .input('Name', sql.NVarChar, org.name)
        .query(`
            INSERT INTO organisation (id, name)
            VALUES (@ID, @Name)
        `);

    if (result.rowsAffected[0] === 0) {
        return false;
    }

    return true;
}
