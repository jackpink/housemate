import Nav from "~/app/_components/Nav";
import { PropertiesPageWithSideMenu } from "~/app/_components/Layout";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

export default function MainAppLayout({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Nav />
      <PropertiesPageWithSideMenu>
        <Component {...pageProps} />
      </PropertiesPageWithSideMenu>
    </SessionProvider>
  );
}
