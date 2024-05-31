import Nav from "~/app/_components/Nav";
import { AlertsPageWithSideMenu } from "~/app/_components/Layout";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/auth";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <Nav />
      <AlertsPageWithSideMenu>{children}</AlertsPageWithSideMenu>
      <div className="h-48"></div>
    </SessionProvider>
  );
}
