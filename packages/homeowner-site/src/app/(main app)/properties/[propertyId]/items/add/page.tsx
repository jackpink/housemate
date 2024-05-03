import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import AddItem from "~/app/_components/AddItem";

export default async function AddItemPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await auth();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.id !== property.homeownerId
  ) {
    return <div>Not Authenticated</div>;
  }

  return (
    <>
      <PageTitle>Add Item</PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <div className="p-10">
          <AddItem
            homeownerId={session.user.id}
            propertyId={params.propertyId}
          />
        </div>
      </PageWithSingleColumn>
    </>
  );
}
