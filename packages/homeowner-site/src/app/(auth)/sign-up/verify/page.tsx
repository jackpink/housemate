import {
  EmailCodeVerificationComponent,
  ResendVerificationEmailButton,
} from "~/app/_components/SignUpForm";
import { getUserOrRedirect } from "~/utils/pageRedirects";
import Logo from "../../../../../../ui/Atoms/Logo";
import Nav from "~/app/_components/Nav";
import Link from "next/link";
import { DropDownIcon } from "../../../../../../ui/Atoms/Icons";
import { User } from "../../../../../../core/homeowner/user";
import { createAndSendVerificationEmailCode } from "~/app/actions";
import { redirect } from "next/navigation";
import { verify } from "crypto";
import { verifyEmailVerificationCode } from "~/auth";

export default async function VerifyEmailPage() {
  // if there is no user session, redirect to sign in
  const user = await getUserOrRedirect();

  // does the user have an active code available?
  const hasActiveCode = await User.hasActiveVerificationCode({
    userId: user.id,
  });

  const verifyCode = async (code: string) => {
    "use server";
    const result = await verifyEmailVerificationCode({
      userId: user.id,
      code,
    });
    if (result) {
      redirect("/properties");
    }
  };

  if (!hasActiveCode) {
    return (
      <div>
        <Nav properties={[]} currentPropertyId="" unviewedNotifications={0} />
        <div>
          <Link href="/" className="flex w-max items-center justify-center p-4">
            <div className="-rotate-90">
              <DropDownIcon />
            </div>
            <p className="pl-2 text-xl">Home</p>
          </Link>
        </div>
        <div className="flex w-full flex-col items-center justify-center p-4">
          <Logo
            width="200"
            height="200"
            outlineColour="black"
            textColour="black"
            fillColour="#7df2cd"
            fillOpacity="1"
          />
          <h1 className="pb-2 text-xl">Verify Email Address.</h1>

          <p className="text-center">
            Your email address has not been verified. Please resend a
            verification code. Check your email for a verification code.
          </p>
          <ResendVerificationEmailButton userId={user.id} email={user.email}>
            Resend verification email.
          </ResendVerificationEmailButton>

          <div className=" w-full "></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav properties={[]} currentPropertyId="" unviewedNotifications={0} />
      <div>
        <Link href="/" className="flex w-max items-center justify-center p-4">
          <div className="-rotate-90">
            <DropDownIcon />
          </div>
          <p className="pl-2 text-xl">Home</p>
        </Link>
      </div>
      <div className="flex w-full flex-col items-center justify-center p-4">
        <Logo
          width="200"
          height="200"
          outlineColour="black"
          textColour="black"
          fillColour="#7df2cd"
          fillOpacity="1"
        />
        <h1 className="text-xl">Verify Email Address.</h1>

        <p className="text-center">
          Your email address has not been verified. Please check your email for
          a verification link.
        </p>
        <ResendVerificationEmailButton userId={user.id} email={user.email}>
          Resend verification email.
        </ResendVerificationEmailButton>

        <div className=" w-full ">
          <EmailCodeVerificationComponent userId={user.id} />
        </div>
      </div>
    </div>
  );
}
