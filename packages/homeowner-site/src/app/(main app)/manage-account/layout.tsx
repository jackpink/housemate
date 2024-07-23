import { ManageAccountPageWithSideMenu } from "~/app/_components/Layout";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
