import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "../../core/homeowner/user";
import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./server/db";
import { signInSchema } from "../../core/homeowner/forms";
import {
  homeownerAccounts,
  homeownerSessions,
  homeownerUsers,
  homeownerVerificationTokens,
} from "../../core/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        let user = null;
        const validatedFields = signInSchema.safeParse(credentials);
        console.log("Validated fields", validatedFields);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await User.getByEmail(email);
          if (!user || !user.password) return null;
          console.log("User", user);

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
          console.log("Passwords do not match");
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: DrizzleAdapter(db, {
    usersTable: homeownerUsers,
    sessionsTable: homeownerSessions,
    verificationTokensTable: homeownerVerificationTokens,
    accountsTable: homeownerAccounts,
  }),
  session: {
    strategy: "jwt",
  },
});
