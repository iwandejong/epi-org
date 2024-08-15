import * as sql from 'mssql';

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

// Create a connection pool using the configuration object
export const pool = new sql.ConnectionPool(cfg);

// Connect to the database
pool.connect()
    .then(() => {
        console.log("Connected to the Azure SQL database successfully.");
    })
    .catch(err => {
        console.error("Error connecting to the Azure SQL database:", err);
    });
