import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
    getEmployee,
    createEmployee
} from '../db/auth';

export default NuxtAuthHandler ({
    secret: useRuntimeConfig().auth.secret,
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/login',
        newUser: '/register',
    },
    providers: [
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
                    if (user.password !== password) {
                        throw new Error('Password does not match');
                    }
                    return user;
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
            return session;
        },
    }
})