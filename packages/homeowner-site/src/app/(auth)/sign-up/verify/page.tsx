import { EmailCodeVerificationComponent } from "~/app/_components/SignUpForm";
import { getUserOrRedirect } from "~/utils/pageRedirects";
import Logo from "../../../../../../ui/Atoms/Logo";
import Nav from "~/app/_components/Nav";

export default async function VerifyEmailPage() {
  // if there is no user session, redirect to sign in
  const user = await getUserOrRedirect();

  return (
    <div>
      <Nav properties={[]} currentPropertyId={""} />
      <Logo
        width="400"
        height="400"
        outlineColour="black"
        textColour="black"
        fillColour="#7df2cd"
        fillOpacity="1"
      />
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
