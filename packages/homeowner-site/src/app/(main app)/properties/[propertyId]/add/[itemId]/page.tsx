import { Property } from "../../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../../core/homeowner/items/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import SideMenu from "~/app/_components/SideMenu";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import { revalidatePath } from "next/cache";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";
import Link from "next/link";
import { DropDownIcon } from "../../../../../../../../ui/Atoms/Icons";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string; itemId: string };
}) {
  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const item = await Item.get(params.itemId);

  if (!item) return <div>Item not found</div>;
  const user = await getVerifiedUserOrRedirect();

  if (user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }
  const updateItem: UpdateItemServerAction = async ({
    title,
    description,
    status,
    recurring,
    recurringSchedule,
    date,
    warrantyEndDate,
  }) => {
    "use server";
    console.log("updateItem", title, description, recurring);
    await Item.update({
      id: params.itemId,
      title,
      description,
      status,
      recurring,
      recurringSchedule,
      date,
      warrantyEndDate,
    });
    revalidatePath(`/properties/${params.propertyId}/add/${params.itemId}`);
  };

  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="add" />
      <div className="flex w-full flex-col items-center justify-center">
        <Link
          href={`/properties/${params.propertyId}`}
          className="flex items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black xs:hidden"
        >
          <span className="-rotate-90">
            <DropDownIcon width={20} height={20} />
          </span>
          Back to Property Menu
        </Link>
        <EditItem
          item={item}
          updateItem={updateItem}
          propertyId={params.propertyId}
          bucketName={bucketName}
          Files={
            <Files
              rootFolder={item.filesRootFolder}
              deviceType={deviceType}
              propertyId={params.propertyId}
            />
          }
          deviceType={deviceType}
        />
      </div>
    </div>
  );
}
