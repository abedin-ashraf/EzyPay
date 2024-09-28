import db from "@repo/db/client"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "youremail@gmail.com" },
                // phone: { label: "Phone number", type: "text", placeholder: "1211231231" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                //Implement: zod validation, OTP validation
                const hashedPassword = await bcrypt.hash(credentials.password, 10)
                const existingUser = await db.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                });
                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    }
                    return null;
                }
                try {
                    const user = await db.user.create({
                        data: {
                            email: credentials.email,
                            // number: credentials.phone,
                            password: hashedPassword
                        }
                    });
                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email
                    }
                }
                catch (e) {
                    console.log(e)
                }
                return null;
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callback: {
        async session({ token, session }: any) {
            session.user.i = token.sub
            return session
        },
        async signIn({ user, account }: {
            user: {
                email: string;
                name: string
            },
            account: {
                provider: "google" | "github"
            }
        }) {
            console.log("hi signin")
            if (!user || !user.email) {
                return false;
            }

            await db.user.upsert({
                select: {
                    id: true
                },
                where: {
                    email: user.email
                },
                create: {
                    email: user.email,
                    name: user.name,
                    auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
                },
                update: {
                    name: user.name,
                    auth_type: account.provider === "google" ? "Google" : "Github" // Use a prisma type here
                }
            });

            return true;
        }
    }

}