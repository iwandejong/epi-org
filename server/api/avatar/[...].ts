import axios from 'axios';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    const { identifier } = event.context.params as { identifier: string };

    try {
        const hash = crypto.createHash('sha256').update(identifier.trim().toLowerCase()).digest('hex');

        const response = await axios.get(`https://api.gravatar.com/v3/profiles/${hash}`, {
            headers: {
                Authorization: `Bearer ${process.env.GRAVATAR_API_KEY}`,
            },
        });

        return {
            statusCode: 200,
            body: response.data
        };
    } catch (error : any) {
        return {
            statusCode: error.response ? error.response.status : 500,
            body: {
                error: error.message
            }
        };
    }
});
