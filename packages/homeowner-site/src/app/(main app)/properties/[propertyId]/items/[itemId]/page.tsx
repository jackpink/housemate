import { auth } from "~/auth";
import { Item } from "../../../../../../../../../core/homeowner/item";
import { concatAddress } from "~/utils/functions";
import { Property } from "../../../../../../../../../core/homeowner/property";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import { PageTitle } from "../../../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageWithSingleColumn } from "../../../../../../../../../ui/Atoms/PageLayout";
import { revalidatePath } from "next/cache";

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

  const updateItem: UpdateItemServerAction = async ({ title, description }) => {
    "use server";
    await Item.update({ id: params.itemId, title, description });
    revalidatePath(
      `/properties/${params.propertyId}/items/todo/${params.itemId}`,
    );
  };

  return (
    <div>
      <PageTitle>
        <CapitaliseText value={item.category} />
      </PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <div className="p-10">
          <EditItem item={item} updateItem={updateItem} />
          <p>{item.status}</p>
        </div>
      </PageWithSingleColumn>
    </div>
  );
}
