import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

import connectDB from "@/lib/dbConnect";
import UserModle from "@/models/userModle";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
 
  providers: [
  CredentialsProvider({
    id: "credentials",    
    name: "Credentials",
    credentials: {
      email: {label: "Email", type: "email"},
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any, req): Promise<any> {
      await connectDB()
        try {
            const user = await UserModle.findOne({
                $or: [
                    { email: credentials.identifier },
                    { username: credentials.identifier }
                ]
            })

            if (!user) {
                throw new Error('User not found');
            }

            if (!user.isVerified) {
                throw new Error('User not verified');
            }

            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (isPasswordValid) {
                return user
            }else{
                throw new Error('Invalid password');
            }

        } catch (error: any) {
            throw new Error(error.message);
        }

    }
  })
],

callbacks: {
    async jwt({ token, user,  }) {
        if (user) {
          token._id = user._id?.toString()
          token.isVerified = user.isVerified;
          token.isAcceptingMessage = user.isAcceptingMessage;
          token.username = user.username;
        }
        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user._id = token._id;
          session.user.username = token.username;
          session.user.isVerified = token.isVerified;
          session.user.isAcceptingMessage = token.isAcceptingMessage;
        }
        return session;
      }
},

pages: {
    signIn: "/sign-in",
    
},
session: {
    strategy: "jwt"
},

secret: process.env.NEXTAUTH_SECRET


}

export default NextAuth(authOptions)