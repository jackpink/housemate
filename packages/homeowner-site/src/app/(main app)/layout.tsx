import React from "react";
import {
  SessionProvider,
  ViewportProvider,
} from "../_components/ContextProviders";
import { validateRequest } from "~/auth";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // get properties for user
  const session = await validateRequest();

  return (
    <ViewportProvider>
      <SessionProvider session={session}>{children}</SessionProvider>
    </ViewportProvider>
  );
}
