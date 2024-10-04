import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db";
import jwt from "jsonwebtoken";
import { JWT, JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";

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
      const encode = jwt.sign(token, secret as jwt.Secret, {
        algorithm: "HS384",
      });
      return encode;
    },
    decode: async ({ token, secret }: JWTDecodeParams): Promise<JWT | null> => {
      if (!secret || !token) throw new Error("Secret or token is undefined");
      try {
        const decode = jwt.verify(token, secret as jwt.Secret, {
          algorithms: ["HS384"],
        }) as JWT;
        return decode;
      } catch (error) {
        return null;
      }
    },
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
  events: {
    async createUser({ user }) {
      const db = (await clientPromise).db();
      const creditExist = await db
        .collection("users")
        .findOne({ email: user.email, credit: { $exists: true } });
      if (!creditExist) {
        await db
          .collection("users")
          .updateOne(
            { email: user.email },
            { $set: { credit: 100, active: true } }
          );
      }
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
});
