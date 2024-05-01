import { auth } from "~/auth";
import NavWrapper from "../../../../ui/Molecules/Nav";
import { signOutAction } from "../actions";
import { CTAButton } from "../../../../ui/Atoms/Button";
import Link from "next/link";

export default async function Nav() {
  const session = await auth();
  if (session?.user) {
    return (
      <NavWrapper>
        <form action={signOutAction}>
          <CTAButton rounded>Sign Out</CTAButton>
        </form>
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
