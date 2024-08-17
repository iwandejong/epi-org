// build a tree using https://learn.microsoft.com/en-us/sql/relational-databases/hierarchical-data-sql-server?view=sql-server-ver16 as resource

import { poolPromise, pool } from '../db/connection';
import sql from 'mssql';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body || !body.orgId) {
        return new Response('Invalid request', { status: 400 });
    }

    const orgId = body.orgId;


    try {
        await poolPromise;
        const result = await pool.request()
            .input('OrgID', sql.UniqueIdentifier, orgId)
            .query(`
                WITH cte AS (
                    SELECT
                        *,
                        ROW_NUMBER() OVER (ORDER BY Level) AS RowNumber
                    FROM
                        dbo.employee
                )
                SELECT
                    *,
                    CONCAT('/', RowNumber, '/') AS Path
                FROM
                    cte
                WHERE
                    orgId = @OrgID
            `);

        const locations = result.recordset;
        const tree : any = [];
        const map = new Map();

        locations.forEach(location => {
            map.set(location.Location, { ...location, children: [] });
        });

        locations.forEach(location => {
            const parent = map.get(location.LocationType);
            if (parent) {
                parent.children.push(map.get(location.Location));
            } else {
                tree.push(map.get(location.Location));
            }
        });

        return {
            statusCode: 200,
            body: tree
        };
    } catch (error) {
        return new Response('Database query error', { status: 500 });
    }
});
