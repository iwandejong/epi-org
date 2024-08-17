import { pool, poolPromise } from './connection';  // Assuming `sql` is exported from your connection module
import sql from 'mssql';
import bcrypt from 'bcrypt';

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
            console.log("Password mismatch");
        } else {
            console.log("Password match");
        }
        return passwordMatch ? employee : false;
    } catch (error) {
        console.error("Error during password comparison:", error);
        return false;
    }
}

export const createEmployee = async (employee: {
    firstName: string,
    lastName: string,
    birthDate: Date,
    linkedIn: string,
    email: string,
    password: string
    orgId: string,
    employeeId: string,
    hierarchyId: string,
    gravatarURL: string,
    bio: string,
}) => {
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

// CREATE TABLE [dbo].[employee] (
//     [id]          INT                 IDENTITY (1, 1) NOT NULL,
//     [firstName]   NVARCHAR (50)       NULL,
//     [lastName]    NVARCHAR (50)       NULL,
//     [birthDate]   DATE                NULL,
//     [employeeId]  UNIQUEIDENTIFIER    NULL,
//     [salary]      FLOAT (53)          NULL,
//     [role]        NVARCHAR (50)       NULL,
//     [manager]     UNIQUEIDENTIFIER    NULL,
//     [joiningDate] DATE                NULL,
//     [leaveDays]   INT                 NULL,
//     [linkedIn]    VARCHAR (MAX)       NULL,
//     [orgId]       UNIQUEIDENTIFIER    NULL,
//     [email]       VARCHAR (MAX)       NULL,
//     [password]    VARCHAR (MAX)       NULL,
//     [hierarchyId] [sys].[hierarchyid] NULL,
//     [bio]         TEXT                NULL,
//     [gravatarURL] NVARCHAR (MAX)      NULL,
//     CONSTRAINT [PK_emp] PRIMARY KEY CLUSTERED ([id] ASC),
//     CONSTRAINT [FK_org] FOREIGN KEY ([orgId]) REFERENCES [dbo].[organisation] ([id]) ON DELETE CASCADE ON UPDATE CASCADE,
//     INDEX [GRAPH_UNIQUE_INDEX_60C23A527BEC49ABB7E8AFC627A748CB] UNIQUE NONCLUSTERED ($node_id)
// ) AS NODE;



export const updateEmployee = async (employee: {
    firstName: string,
    lastName: string,
    birthDate: Date,
    linkedIn: string,
    email: string,
    password: string | null,
    employeeId: string,
    bio: string,
    gravatarURL: string,
    hierarchyId: string,
}) => {
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
            .input('Password', sql.NVarChar, hashedPassword)
            .input('EmployeeId', sql.UniqueIdentifier, employee.employeeId)
            .input('Bio', sql.Text, employee.bio)
            .input('GravatarURL', sql.NVarChar, employee.gravatarURL)
            .input('HierarchyId', sql.NVarChar, employee.hierarchyId)
            .query(`
                UPDATE employee
                SET firstName = @FirstName,
                    lastName = @LastName,
                    birthDate = @BirthDate,
                    linkedIn = @LinkedIn,
                    email = @Email,
                    password = @Password,
                    bio = @Bio,
                    gravatarURL = @GravatarURL,
                    hierarchyId = @HierarchyId
                WHERE employeeId = @EmployeeId
            `);

            console.log("Result", result);
            
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
            .query(`
                UPDATE employee
                SET firstName = @FirstName,
                    lastName = @LastName,
                    birthDate = @BirthDate,
                    linkedIn = @LinkedIn,
                    email = @Email,
                    bio = @Bio,
                    gravatarURL = @GravatarURL,
                    hierarchyId = @HierarchyId
                WHERE employeeId = @EmployeeId
            `);
            console.log("Result", result);
            
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

export const createOrg = async (org: {
    id: string,
    name: string,
}) => {
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
