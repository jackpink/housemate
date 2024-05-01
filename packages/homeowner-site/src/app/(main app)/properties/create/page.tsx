import { CreatePropertyBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageWithSingleColumn } from "../../../../../../ui/Atoms/PageLayout";
import { PageTitle } from "../../../../../../ui/Atoms/Title";
import CreateProperty from "~/app/_components/CreateProperty";

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
