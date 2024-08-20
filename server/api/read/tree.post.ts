// build a tree using https://learn.microsoft.com/en-us/sql/relational-databases/hierarchical-data-sql-server?view=sql-server-ver16 as resource

import pool, { poolPromise } from '../db/connection';
import sql from 'mssql';
import type { Tree } from '~/interfaces/Tree';
import type { ServerResponse } from '~/interfaces/ServerResponse';

function buildTree(employees: Tree[], managerId: string | null = null): Tree[] {
    return employees
        .filter(employee => employee.manager === managerId)
        .map(employee => ({
            ...employee,
            children: buildTree(employees, employee.employeeid) // Recursively find and assign subordinates
        }));
}

async function fetchGravatarURL(url: string) {
    try {
        const response = await fetch(`${url}.json`);
        const data = await response.json();
        return data.entry[0]?.thumbnailUrl || '';
    } catch (err) {
        console.error("Failed to fetch Gravatar profile. Please update your Gravatar URL.");
        return '';
    }
}

export default defineEventHandler(async (event): Promise<ServerResponse> => {
    const body = await readBody(event);

    if (!body || !body.orgid) {
        return {
            statusCode: 400,
            body: 'Bad Request'
        }
    }

    const orgid = body.orgid;
    console.log("orgid", orgid);

    try {
        await poolPromise;
        const result = await pool.query(
            'SELECT * FROM employee WHERE orgid = $1', [orgid]
        );

        console.log("RESULT", result);

            // read into an array of Tree objects
        const tree: Tree[] = [];
        for (const employee of result.rows) {
            const gravURL = await fetchGravatarURL(employee.gravatarURL);
            tree.push({
                id: employee.id,
                firstname: employee.firstname,
                lastname: employee.lastname,
                employeeid: employee.employeeid,
                role: employee.role,
                manager: employee.manager,
                gravatarURL: gravURL
            });
        };

        // // fetch Gravatar URLs
        // for (let i = 0; i < tree.length; i++) {
        //     tree[i].gravatarURL = ;
        // }

        console.log("TREE", tree);

        // build the tree back up
        // managerId is null for the root node
        const hierarchyTree: Tree[] = buildTree(tree);

        console.log("TREE", hierarchyTree);

        return {
            statusCode: 200,
            body: hierarchyTree
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Tree query error'
        }
    }
});
