import { PageWithSingleColumn } from "~/app/_components/Atoms/PageLayout";
import { PageTitle } from "~/app/_components/Atoms/Title";
import { CreatePropertyBreadcrumbs } from "~/app/_components/Molecules/Breadcrumbs";
import CreateProperty from "~/app/_components/Organisms/CreateProperty";

export default async function CreatePropertyPage() {
  return (
    <>
      <PageTitle>Create New Property</PageTitle>
      <CreatePropertyBreadcrumbs />
      <PageWithSingleColumn>
        <div className="pt-20">
          <CreateProperty />
        </div>
      </PageWithSingleColumn>
    </>
  );
}
