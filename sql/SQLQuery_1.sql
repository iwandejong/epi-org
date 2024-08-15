CREATE TABLE employee (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL, 
    joining_date DATE NOT NULL,
    email NVARCHAR(255) UNIQUE NOT NULL,
    salary FLOAT NOT NULL,
    job_title NVARCHAR(100) NOT NULL,
    leave_days INT NOT NULL,
    linkedin NVARCHAR(100) NOT NULL,
    reporting_line_manager INT NOT NULL,
);
