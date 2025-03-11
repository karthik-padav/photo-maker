import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JWT, JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  session: { strategy: "jwt" },
  jwt: {
    encode: async ({ token, secret }: JWTEncodeParams<JWT>) => {
      if (!secret || !token) throw new Error("Secret or token is undefined");
      return jwt.sign(token, secret as jwt.Secret, { algorithm: "HS384" });
    },
    decode: async ({ token, secret }: JWTDecodeParams): Promise<JWT | null> => {
      if (!secret || !token) throw new Error("Secret or token is undefined");
      try {
        return jwt.verify(token, secret as jwt.Secret, {
          algorithms: ["HS384"],
        }) as JWT;
      } catch (error) {
        return null;
      }
    },
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ account, profile, user }) {
      if (!user.email) return false; // Prevent accounts without emails

      // Check if a user with the same email exists
      const existingUser = await prisma.user.findFirst({
        where: { email: user.email },
        include: { accounts: true },
      });

      if (existingUser && account) {
        // Check if this provider is already linked
        const providerExists = existingUser.accounts.some(
          (acc) => acc.provider === account.provider
        );

        if (!providerExists) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
            },
          });
        }

        return true;
      } else {
        // Create a new user if no existing user is found
        return true;
      }

      return true;
    },
    async session({ session }) {
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXT_AUTH_SECRET,
});
