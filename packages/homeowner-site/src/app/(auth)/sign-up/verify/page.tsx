import { EmailCodeVerificationComponent } from "~/app/_components/SignUpForm";
import { getUserOrRedirect } from "~/utils/pageRedirects";

export default async function VerifyEmailPage() {
  // if there is no user session, redirect to sign in
  const user = await getUserOrRedirect();

  return (
    <div>
      <h1>Verify Email Address</h1>
      {user.emailVerified ? (
        <p>Your email address has been verified.</p>
      ) : (
        <p>
          Your email address has not been verified. Please check your email for
          a verification link.
        </p>
      )}
      {user.email && <p>Email: {user.email}</p>}
      <EmailCodeVerificationComponent />
    </div>
  );
}
