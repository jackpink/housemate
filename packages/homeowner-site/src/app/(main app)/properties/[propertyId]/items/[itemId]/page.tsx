import { auth } from "~/auth";
import { Item } from "../../../../../../../../core/homeowner/item";
import { concatAddress } from "~/utils/functions";
import { Property } from "../../../../../../../../core/homeowner/property";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import { PageTitle } from "../../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageWithSingleColumn } from "../../../../../../../../ui/Atoms/PageLayout";
import { revalidatePath } from "next/cache";
import { Bucket } from "sst/node/bucket";
import Files from "~/app/_components/Files";
import { redirect } from "next/navigation";
import { getDeviceType } from "~/app/actions";

export default async function TodoItemPage({
  params,
}: {
  params: { propertyId: string; itemId: string };
}) {
  const session = await auth();

  const deviceType = await getDeviceType();

  const item = await Item.get(params.itemId);

  const property = await Property.get(params.propertyId);

  if (!item) return <div>Item not found</div>;

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  console.log("item", item);

  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  if (session?.user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const updateItem: UpdateItemServerAction = async ({
    title,
    description,
    recurring,
    date,
    warrantyEndDate,
  }) => {
    "use server";
    console.log("updateItem", title, description, recurring);
    await Item.update({
      id: params.itemId,
      title,
      description,
      recurring,
      date,
      warrantyEndDate,
    });
    revalidatePath(`/properties/${params.propertyId}/items/${params.itemId}`);
  };

  console.log("BucketResources", Bucket);

  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";

  return (
    <div>
      <PageTitle>
        <CapitaliseText value={item.category} />
      </PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <div className="p-10">
          <EditItem
            item={item}
            updateItem={updateItem}
            propertyId={params.propertyId}
            bucketName={bucketName}
            Files={
              <Files
                rootFolder={item.filesRootFolder}
                deviceType={deviceType}
              />
            }
          />
          <p>{item.status}</p>
        </div>
      </PageWithSingleColumn>
    </div>
  );
}
