import Nav from "~/app/_components/Nav";
import { PropertiesPageWithSideMenu } from "~/app/_components/Layout";
export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <PropertiesPageWithSideMenu>{children}</PropertiesPageWithSideMenu>
    </>
  );
}
