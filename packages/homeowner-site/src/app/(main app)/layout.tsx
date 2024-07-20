import React from "react";
import { ViewportProvider } from "../_components/ContextProviders";
import { validateRequest } from "~/auth";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // get properties for user

  return <ViewportProvider>{children}</ViewportProvider>;
}
