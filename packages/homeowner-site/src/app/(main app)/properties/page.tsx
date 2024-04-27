import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";

export default async function PropertiesPage() {
  return (
    <>
      <PageTitle>Properties</PageTitle>
      <PropertiesBreadcrumbs />
      <PageWithSingleColumn>Properties</PageWithSingleColumn>
    </>
  );
}
