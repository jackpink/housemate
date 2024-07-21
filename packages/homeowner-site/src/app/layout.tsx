import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { SessionProvider } from "./_components/ContextProviders";
import { getSession } from "~/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Housemate",
  description: "A property management app for homeowners",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <SessionProvider user={user}>{children}</SessionProvider>
      </body>
    </html>
  );
}
