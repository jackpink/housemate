import { redirect } from "next/navigation";
import {
  SendPasswordResetEmail,
  SignInForm,
} from "~/app/_components/SignInForm";
import { DropDownIcon, EmailSentIcon } from "../../../../../ui/Atoms/Icons";
import Link from "next/link";
import Logo from "../../../../../ui/Atoms/Logo";
import { getSession } from "~/auth";
import { CTAButton } from "../../../../../ui/Atoms/Button";

export default async function PasswordResetPage() {
  // if there is a user session, redirect to properties

  return (
    <div>
      <div>
        <Link
          href="/sign-in"
          className="flex w-max items-center justify-center p-4"
        >
          <div className="-rotate-90">
            <DropDownIcon />
          </div>
          <p className="pl-2 text-xl">Sign In</p>
        </Link>
      </div>
      <div className="flex h-dvh w-full flex-col items-center justify-center">
        <Logo
          width="200"
          height="200"
          outlineColour="black"
          textColour="black"
          fillColour="#7df2cd"
          fillOpacity="1"
        />
        <h1 className="text-xl">Password Reset.</h1>
        <h2>Enter Your email to reset your password </h2>
        <div className="flex w-full justify-center pt-10">
          <SendPasswordResetEmail />
        </div>
      </div>
    </div>
  );
}
