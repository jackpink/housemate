import { auth } from "~/auth";
import NavWrapper from "../../../../ui/Molecules/Nav";
import { signOutAction } from "../actions";
import { CTAButton } from "../../../../ui/Atoms/Button";
import Link from "next/link";
import { type User } from "next-auth";

export default async function Nav() {
  const session = await auth();
  if (session?.user) {
    return (
      <NavWrapper>
        <UserButton user={session.user} />
      </NavWrapper>
    );
  }
  return (
    <NavWrapper>
      <Link href="/sign-in">
        <CTAButton rounded>Sign In</CTAButton>
      </Link>
    </NavWrapper>
  );
}

function UserButton({ user }: { user: User }) {
  const initials = user.name;
  return <button>{initials} g</button>;
}

function SignOutButton() {
  return (
    <form action={signOutAction}>
      <CTAButton rounded>Sign Out</CTAButton>
    </form>
  );
}
