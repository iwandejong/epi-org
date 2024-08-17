import type { Organisation } from "~/interfaces/Organisation";
import type { ServerResponse } from "~/interfaces/ServerResponse";

async function fetchOrganisation(orgID: string): Promise<Organisation> {
    try {
        const {statusCode, body} : ServerResponse = await $fetch('/api/read/org', {
            method: 'POST',
            body: JSON.stringify({ orgId: orgID }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (statusCode !== 200) {
            throw new Error('Failed to fetch organisation');
        }
        let organisation: Organisation = body;
        return organisation;
    } catch (error) {
        throw new Error('Failed to fetch organisation');
    }
}

export { fetchOrganisation };