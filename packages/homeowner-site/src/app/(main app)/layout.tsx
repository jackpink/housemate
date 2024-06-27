import Nav from "~/app/_components/Nav";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/auth";
import { Property } from "../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // get properties for user

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
