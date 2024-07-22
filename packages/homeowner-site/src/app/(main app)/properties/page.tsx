import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { Property } from "../../../../../core/homeowner/property";
import Properties from "~/app/_components/Properties";
import { redirect } from "next/navigation";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

async function getProperties({ userId }: { userId: string }) {
  console.log("Getting properties for user", userId);
  return Property.getByHomeownerId(userId);
}

export default async function PropertiesPage() {
  const user = await getVerifiedUserOrRedirect();

  const properties = await getProperties({ userId: user.id });
  return (
    <>
      <PageTitle>Properties</PageTitle>
      <h2 className="text-center text-lg font-semibold">
        Here are your properties that you are managing. Select a property to
        view.
      </h2>
      <PageWithSingleColumn>
        <Properties properties={properties} />
      </PageWithSingleColumn>
    </>
  );
}
