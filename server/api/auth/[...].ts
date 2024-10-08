import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
    getEmployee,
    authenticateEmployee,
} from '../db/auth';

export default NuxtAuthHandler ({
    secret: process.env.AUTH_SECRET,
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
                        throw new Error('User not found. Please register.');
                    }

                    const authUser = await authenticateEmployee(email, password);

                    if (!authUser) {
                        // 
                        throw new Error('Invalid password');
                    }

                    

                    // combine first and last name
                    user.name = `${user.firstname} ${user.lastname}`;

                    // remove password from user object
                    delete user.password;

                    return {
                        ...user
                    }
                }
                catch (error : any) {
                    return {
                        statusCode: 401,
                        body : {
                            error: error.message
                        }
                    }
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
            // @ts-expect-error
            session.user = {
                ...token,
                ...session.user
            };
            
            return session;
        },
        async redirect({url, baseUrl}) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    }
})