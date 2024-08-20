import type { Employee } from "~/interfaces/Employee";
import type { ServerResponse } from "~/interfaces/ServerResponse";

async function fetchEmployees(orgid: string): Promise<any> {
    try {
        const {statusCode, body} : ServerResponse = await $fetch('/api/read/employees', {
            method: 'POST',
            body: JSON.stringify({ orgid: orgid }),
            headers: { 'Content-Type': 'application/json' }
        });

        console.log('statusCode', statusCode);
        console.log('body', body);

        if (statusCode > 200) {
            throw new Error('Failed to fetch employees');
        }

        return body;
    } catch (error) {
        throw new Error('Failed to fetch employees');
    }
}

export { fetchEmployees };