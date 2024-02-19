import { PropertiesPageWithMainMenu } from "../_components/Atoms/PageLayout";

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PropertiesPageWithMainMenu>{children}</PropertiesPageWithMainMenu>;
}
