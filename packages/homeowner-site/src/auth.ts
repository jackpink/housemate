import {
  Lucia,
  Session,
  User as LuciaUser,
  generateIdFromEntropySize,
} from "lucia";
import { adapter } from "../../core/db/authAdapter";
import { User } from "../../core/homeowner/user";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { cache } from "react";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { hash } from "@node-rs/argon2";
import { sendPasswordResetEmail, sendVerificationEmail } from "~/utils/emails";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: true,
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      emailVerified: attributes.emailVerified,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
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
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
}

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const existingUser = await User.getByEmail(email);
  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    throw new Error("Incorrect username or password");
  }

  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!validPassword) {
    throw new Error("Incorrect username or password");
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
}

export async function generateEmailVerificationCode({
  userId,
}: {
  userId: string;
}): Promise<string> {
  let code = generateRandomString(6, alphabet("0-9"));
  console.log("Generated code", code);
  code = await User.createEmailVerificationCode({
    userId,
    code,
    expirationDate: createDate(new TimeSpan(15, "m")),
  });
  return code;
}

export async function verifyEmailVerificationCode({
  userId,
  code,
}: {
  userId: string;
  code: string;
}): Promise<boolean> {
  const result = await User.verifyEmailVerificationCode({
    userId,
    code,
  });
  if (!result) return false;
  // create new session
  await lucia.invalidateSession(userId);

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return result;
}

export const getSession = cache(
  async (): Promise<
    { user: LuciaUser; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export async function signOut() {
  const { session } = await getSession();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return true;
}

export async function signUp({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  // Check if user exists
  const existingUser = await User.getByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash the password
  const hashedPassword = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  let userId: string;
  try {
    userId = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  const session = await lucia.createSession(userId, {
    email: email,
    emailVerified: false,
    firstName: firstName,
    lastName: lastName,
  });
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  //generate verification token
  const verificationCode = await generateEmailVerificationCode({ userId });

  //send email
  await sendVerificationEmail({ email, code: verificationCode });

  // TODO: Send verification token email
  return {
    success: "User created",
  };
}

export async function updatePasswordWithCurrentPassword({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const user = await User.getById(userId);
  if (!user) throw new Error("User not found");

  const passwordMatch = await verify(user.password, currentPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  if (!passwordMatch) throw new Error("Current password is incorrect");
  return await updatePassword({ userId, newPassword });
}

export async function updatePassword({
  userId,
  newPassword,
}: {
  userId: string;
  newPassword: string;
}) {
  const hashedPassword = await hash(newPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  try {
    await User.update({ id: userId, password: hashedPassword });
  } catch (e) {
    console.log(e);
    throw e;
  }
  return true;
}

export async function resetPassword({ userId }: { userId: string }) {
  const user = await User.getById(userId);
  if (!user) throw new Error("User not found");

  //generate password reset token
  const tokenId = generateIdFromEntropySize(25);
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  await User.createPasswordResetToken({
    userId,
    tokenHash,
    expirationDate: createDate(new TimeSpan(1, "h")),
  });

  //send email
  await sendPasswordResetEmail({ email: user.email, code: tokenId });

  return true;
}

export async function verifyPasswordResetToken({
  token,
}: {
  token: string;
}): Promise<string | null> {
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));

  return await User.verifyPasswordResetToken({ tokenHash });
}
