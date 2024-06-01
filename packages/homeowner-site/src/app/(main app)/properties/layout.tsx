import { PropertiesPageWithSideMenu } from "~/app/_components/Layout";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PropertiesPageWithSideMenu>{children}</PropertiesPageWithSideMenu>
      <div className="h-48"></div>
    </>
  );
}
