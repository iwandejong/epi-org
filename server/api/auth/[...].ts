import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
    getEmployee,
    authenticateEmployee,
} from '../db/auth';

export default NuxtAuthHandler ({
    secret: useRuntimeConfig().authSecret,
    pages: {
        signIn: '/login'
    },
    providers: [
        // @ts-expect-error
        CredentialsProvider.default({
            name: 'credentials',
            credentials: {},
            async authorize(credentials: { email: string, password: string }) {
                const { email, password } = credentials;
                try {
                    const user = await getEmployee(email);
                    if (!user) {
                        throw new Error('User not found');
                    }

                    const authUser = await authenticateEmployee(email, password);

                    if (!authUser) {
                        throw new Error('Invalid password');
                    }

                    console.log('User authenticated:', user);

                    // combine first and last name
                    user.name = `${user.firstName} ${user.lastName}`;

                    // remove password from user object
                    delete user.password;

                    return {
                        ...user
                    }
                }
                catch (error) {
                    console.error('Error during authorization:', error);
                    return null;
                }
            }
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({token, user, account}) {
            if (user) {
                token = { ...token, ...user };
            }
            return token;
        },
        async session({session, token}) {
            session.user = {
                ...token,
                ...session.user
            };
            console.log('Session:', session);
            return session;
        },
        async redirect({url, baseUrl}) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    }
})