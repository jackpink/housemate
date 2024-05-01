import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../core/homeowner/property";
import Properties from "~/app/_components/Properties";

async function getProperties({ userId }: { userId: string }) {
  return Property.getByHomeownerId(userId);
}

export default async function PropertiesPage() {
  const session = await auth();
  console.log("Session", session);

  if (!session || !session.user) {
    return <div>Not Authenticated</div>;
  }

  const properties = await getProperties({ userId: session.user.id! });
  return (
    <>
      <PageTitle>Properties</PageTitle>
      <PropertiesBreadcrumbs />
      <PageWithSingleColumn>
        <Properties properties={properties} />
      </PageWithSingleColumn>
    </>
  );
}
