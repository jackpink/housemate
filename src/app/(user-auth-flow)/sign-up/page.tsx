import { SignUp } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex h-dvh w-full items-center">
      <div className="flex w-full justify-center">
        <SignUp signInUrl="/sign-in" />
      </div>
    </div>
  );
}
