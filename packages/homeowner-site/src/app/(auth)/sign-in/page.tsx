import { redirect } from "next/navigation";
import { SignInForm } from "~/app/_components/SignInForm";
import { DropDownIcon } from "../../../../../ui/Atoms/Icons";
import Link from "next/link";
import Logo from "../../../../../ui/Atoms/Logo";
import { getSession } from "~/auth";

export default async function SignInPage() {
  // if there is a user session, redirect to properties
  const { user } = await getSession();

  if (!!user && !!user.id) {
    // redirect to login
    redirect("/properties");
  }
  return (
    <div>
      <div>
        <Link href="/" className="flex w-max items-center justify-center p-4">
          <div className="-rotate-90">
            <DropDownIcon />
          </div>
          <p className="pl-2 text-xl">Home</p>
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
        <h1 className="text-xl">Sign in to Housemate.</h1>
        <h2>
          Don't Have an account?{" "}
          <span>
            <Link href="/sign-up" className="font-bold text-brandSecondary">
              Sign Up.
            </Link>
          </span>
        </h2>
        <div className="flex w-full justify-center">
          <SignInForm />
        </div>
        <Link
          href="/password-reset"
          className="mt-2 block text-center font-bold text-brandSecondary"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
