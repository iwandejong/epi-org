WITH RECURSIVE EmployeeHierarchy AS (
    -- Base case: select top-level employees (those without a manager)
    SELECT
        id AS key,
        employeeId AS empId,
        manager,
        CONCAT(firstName, ' ', lastName) AS name,
        role AS title,
        gravatarURL AS image,
        1 AS level
    FROM employee
    WHERE manager IS NULL

    UNION ALL

    -- Recursive case: join employees with their managers
    SELECT
        e.id AS key,
        e.employeeId AS empId,
        e.manager,
        CONCAT(e.firstName, ' ', e.lastName) AS name,
        e.role AS title,
        e.gravatarURL AS image,
        eh.level + 1 AS level
    FROM employee e
    INNER JOIN EmployeeHierarchy eh ON e.manager = eh.key
)

-- Select all records from the hierarchy
SELECT * FROM EmployeeHierarchy;
