import Link from "next/link";
import SignUpForm from "~/app/_components/SignUpForm";
import { DropDownIcon } from "../../../../../ui/Atoms/Icons";
import Logo from "../../../../../ui/Atoms/Logo";
import { getSession } from "~/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
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
      <div className="flex w-full flex-col items-center justify-center">
        <Logo
          width="200"
          height="200"
          outlineColour="black"
          textColour="black"
          fillColour="#7df2cd"
          fillOpacity="1"
        />
        <h1 className="text-xl">Sign up to Housemate.</h1>
        <h2>
          Already have an account?{" "}
          <span>
            <Link href="/sign-in" className="font-bold text-brandSecondary">
              Sign In.
            </Link>
          </span>
        </h2>
        <div className="flex w-full justify-center">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
