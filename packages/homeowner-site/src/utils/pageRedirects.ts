import { redirect } from "next/navigation";
import { validateRequest } from "~/auth";

export async function getUserOrRedirect() {
  // if there is no user session, redirect to sign i
  const { user } = await validateRequest();

  if (!user || !user.id) {
    // redirect to login
    redirect("/sign-in");
  }
  return user;
}

export async function getVerifiedUserOrRedirect() {
  // if there is no user session, redirect to sign i
  const { user } = await validateRequest();

  if (!user || !user.id) {
    // redirect to login
    redirect("/sign-in");
  }

  if (!user.emailVerified) {
    // redirect to verify email
    redirect("/sign-up/verify");
  }
  return user;
}
