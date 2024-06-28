import { SessionProvider } from "next-auth/react";
import { auth } from "~/auth";
import React from "react";
import { ViewportProvider } from "../_components/ContextProviders";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // get properties for user

  return (
    <SessionProvider session={session}>
      <ViewportProvider>{children}</ViewportProvider>
    </SessionProvider>
  );
}
