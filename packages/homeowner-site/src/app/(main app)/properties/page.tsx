import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { validateRequest } from "~/auth";
import { Property } from "../../../../../core/homeowner/property";
import Properties from "~/app/_components/Properties";
import { redirect } from "next/navigation";

async function getProperties({ userId }: { userId: string }) {
  console.log("Getting properties for user", userId);
  return Property.getByHomeownerId(userId);
}

export default async function PropertiesPage() {
  const { user } = await validateRequest();

  if (!user || !user.id) {
    // redirect to login
    redirect("/sign-in");
  }

  const properties = await getProperties({ userId: user.id });
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
