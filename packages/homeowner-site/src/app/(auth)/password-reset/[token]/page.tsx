import { redirect } from "next/navigation";
import { SignInForm, UpdatePassword } from "~/app/_components/SignInForm";
import { DropDownIcon } from "../../../../../../ui/Atoms/Icons";
import Link from "next/link";
import Logo from "../../../../../../ui/Atoms/Logo";
import { getSession, verifyPasswordResetToken } from "~/auth";
import { User } from "../../../../../../core/homeowner/user";

export default async function PasswordResetPage({
  params,
}: {
  params: { token: string };
}) {
  // check the validity of the token
  const userId = await verifyPasswordResetToken({ token: params.token });

  if (!userId) {
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
        <div className="flex w-full flex-col items-center justify-center p-4">
          <Logo
            width="200"
            height="200"
            outlineColour="black"
            textColour="black"
            fillColour="#7df2cd"
            fillOpacity="1"
          />
          <h1 className="pb-2 text-xl">Reset Password.</h1>

          <p className="text-center">
            Your password reset token is invalid. Please request a new one.
          </p>
          <Link
            href={"/password-reset"}
            className="mt-2 block text-center font-bold text-brandSecondary"
          >
            Request a new password reset token
          </Link>
        </div>
      </div>
    );
  }

  const user = await User.getById(userId);

  if (!user) {
    return <div>Can't fnuid user</div>;
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
        <h1 className="text-xl">Reset Password.</h1>
        <h2>{`Email: ${user.email}`}</h2>
        <div className="flex w-full justify-center">
          <UpdatePassword userId={userId} />
        </div>
      </div>
    </div>
  );
}
