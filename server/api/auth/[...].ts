import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pool } from '../db/connection';
import bcrypt from 'bcrypt';


export default NuxtAuthHandler ({
    secret: useRuntimeConfig().auth.secret,
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/login',
        verifyRequest: '/verify-email',
        newUser: '/register',
    },
    providers: [
        // @ts-expect-error
        CredentialsProvider.default({
            name: 'credentials',
            credentials: {},
            async authorize(credentials: { username: string, password: string }) {
                try {
                    const request = pool.request();
                    const result = await request
                        .input('username', credentials.username)
                        .query('SELECT * FROM users WHERE username = @username');

                    const user = result.recordset[0];

                    let password = credentials.password;
                    // hash the password
                    const hash = await bcrypt.hash(password, 10);
                    // compare the hashed password with the one in the database
                    const match = await bcrypt.compare(hash, user.password);

                    if (user && match) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error('Error during authorization:', error);
                    return null;
                }
            }
        })
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
        }
    }
})