import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
            async authorize(credentials: {
                username: string,
                password: string
            }) {
                // TODO: Implement login logic by fetching user data from the server
                return {};
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