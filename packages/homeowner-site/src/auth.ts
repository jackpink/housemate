import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "../../core/homeowner/user";
import { Lucia } from "lucia";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./server/db";
import { signInSchema } from "../../core/homeowner/forms";
import { adapter } from "../../core/db/authAdapter";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: true,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
}
