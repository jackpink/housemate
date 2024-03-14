import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-dvh w-full items-center">
      <div className="flex w-full justify-center">
        <SignIn redirectUrl="/properties" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
