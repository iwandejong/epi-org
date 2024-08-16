import { pool } from './connection';  // Assuming `sql` is exported from your connection module
import sql from 'mssql';
import bcrypt from 'bcrypt';

export const getEmployee = async (email: string) => {
    const result = await pool.request()
        .input('Email', sql.NVarChar, email)
        .query('SELECT * FROM Employees WHERE Email = @Email');
    return result.recordset[0];
};

export const createEmployee = async (employee: {
    firstName: string,
    lastName: string,
    birthdate: Date,
    salary: number,
    role: string,
    managerId: string | null,
    joinDate: Date,
    linkedIn: string,
    orgId: string,
    email: string,
    password: string
}) => {
    const hashedPassword = await bcrypt.hash(employee.password, 10);

    await pool.request()
        .input('FirstName', sql.NVarChar, employee.firstName)
        .input('LastName', sql.NVarChar, employee.lastName)
        .input('Birthdate', sql.Date, employee.birthdate)
        .input('Salary', sql.Decimal(18, 2), employee.salary)
        .input('Role', sql.NVarChar, employee.role)
        .input('ManagerId', sql.UniqueIdentifier, employee.managerId)
        .input('JoinDate', sql.Date, employee.joinDate)
        .input('LinkedIn', sql.NVarChar, employee.linkedIn)
        .input('OrgId', sql.UniqueIdentifier, employee.orgId)
        .input('Email', sql.NVarChar, employee.email)
        .input('Password', sql.NVarChar, hashedPassword)
        .query(`
            INSERT INTO Employees (FirstName, LastName, Birthdate, Salary, Role, ManagerId, JoinDate, LinkedIn, OrgId, Email, Password)
            VALUES (@FirstName, @LastName, @Birthdate, @Salary, @Role, @ManagerId, @JoinDate, @LinkedIn, @OrgId, @Email, @Password)
        `);
};
