import { PageWithSingleColumn } from "~/app/_components/Atoms/PageLayout";
import { PageTitle } from "~/app/_components/Atoms/Title";
import { CreatePropertyBreadcrumbs } from "~/app/_components/Molecules/Breadcrumbs";
import CreateProperty from "~/app/_components/Organisms/CreateProperty";

export default function CreatePropertyPage() {
  return (
    <>
      <PageTitle>Create New Property</PageTitle>
      <CreatePropertyBreadcrumbs />
      <PageWithSingleColumn>
        <CreateProperty />
      </PageWithSingleColumn>
    </>
  );
}
