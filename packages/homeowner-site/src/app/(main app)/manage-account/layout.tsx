import { ManageAccountPageWithSideMenu } from "~/app/_components/Layout";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ManageAccountPageWithSideMenu>{children}</ManageAccountPageWithSideMenu>
      <div className="h-48"></div>
    </>
  );
}
