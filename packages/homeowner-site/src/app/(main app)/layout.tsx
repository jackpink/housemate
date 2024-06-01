import Nav from "~/app/_components/Nav";
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
      {children}
      <div className="h-48"></div>
    </SessionProvider>
  );
}
