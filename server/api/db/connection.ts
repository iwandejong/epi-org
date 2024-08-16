import sql from 'mssql';

// Configuration for your Azure SQL database connection
const cfg: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || '',
    database: process.env.DB_DATABASE,
    options: {
        enableArithAbort: true,
        encrypt: true
    }
};

// Create and connect the pool globally
export const pool = new sql.ConnectionPool(cfg);

// Connect the pool
export const poolPromise = pool.connect();