import { AlertsPageWithSideMenu } from "~/app/_components/Layout";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AlertsPageWithSideMenu>{children}</AlertsPageWithSideMenu>
      <div className="h-48"></div>
    </>
  );
}
