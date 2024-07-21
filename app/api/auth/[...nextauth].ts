import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.NEXT_PUBLIC_AUTH_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
});
