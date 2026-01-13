import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth - makkelijkste voor gebruikers
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Demo/Test credentials - voor development
    Credentials({
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@pandblink.nl" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Zoek of maak demo user
        const email = credentials.email as string;
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: email.split("@")[0],
              credits: 3, // Gratis credits
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Haal actuele credits op
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true, credits: true },
        });

        if (user) {
          session.user.id = user.id;
          session.user.credits = user.credits;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});
