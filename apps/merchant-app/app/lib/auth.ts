import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""

        })
    ],
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub;

            return session;
        }
    }
}