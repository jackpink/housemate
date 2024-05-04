import { auth } from "~/auth";
import { Item } from "../../../../../../../../../core/homeowner/item";
import { concatAddress } from "~/utils/functions";
import { Property } from "../../../../../../../../../core/homeowner/property";
import EditItem from "~/app/_components/EditItem";
import { PageTitle } from "../../../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageWithSingleColumn } from "../../../../../../../../../ui/Atoms/PageLayout";

export default async function TodoItemPage({
  params,
}: {
  params: { propertyId: string; itemId: string };
}) {
  const session = await auth();

  const item = await Item.get(params.itemId);

  const property = await Property.get(params.propertyId);

  if (!item) return <div>Item not found</div>;

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  console.log("item", item);

  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.id !== property.homeownerId
  ) {
    return <div>Not Authenticated</div>;
  }
  return (
    <div>
      <PageTitle>
        <CapitaliseText value={item.category} />
      </PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <div className="p-10">
          <EditItem title={item.title} />
          <p>{item.status}</p>
        </div>
      </PageWithSingleColumn>
    </div>
  );
}
