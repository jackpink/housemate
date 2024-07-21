import { EmailCodeVerificationComponent } from "~/app/_components/SignUpForm";
import { getUserOrRedirect } from "~/utils/pageRedirects";
import Logo from "../../../../../../ui/Atoms/Logo";
import Nav from "~/app/_components/Nav";
import Link from "next/link";
import { DropDownIcon } from "../../../../../../ui/Atoms/Icons";

export default async function VerifyEmailPage() {
  // if there is no user session, redirect to sign in
  const user = await getUserOrRedirect();

  return (
    <div>
      <Nav properties={[]} currentPropertyId="" />
      <div>
        <Link href="/" className="flex w-max items-center justify-center p-4">
          <div className="-rotate-90">
            <DropDownIcon />
          </div>
          <p className="pl-2 text-xl">Home</p>
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <Logo
          width="200"
          height="200"
          outlineColour="black"
          textColour="black"
          fillColour="#7df2cd"
          fillOpacity="1"
        />
        <h1 className="text-xl">Verify Email Address.</h1>
        <h2>
          <p>
            Your email address has not been verified. Please check your email
            for a verification link.
          </p>
          <span>
            <button className="font-bold text-brandSecondary">
              Resend verification email.
            </button>
          </span>
        </h2>
        <div className=" w-full ">
          <EmailCodeVerificationComponent />
        </div>
      </div>
    </div>
  );
}
