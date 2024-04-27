import Nav from "../../../../../ui/Molecules/Nav";
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
