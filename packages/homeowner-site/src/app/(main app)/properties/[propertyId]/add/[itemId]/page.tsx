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
import {
  DropDownIcon,
  GeneralHomeIcon,
} from "../../../../../../../../ui/Atoms/Icons";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import { ItemNotFound } from "~/app/_components/NotFound";
import { User } from "../../../../../../../../core/homeowner/user";
import { freeStorageLimit } from "~/utils/functions";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string; itemId: string };
}) {
  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const item = await Item.get(params.itemId);

  if (!item)
    return <ItemNotFound propertyId={params.propertyId} currentPage="add" />;

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

  const fullUser = await User.getById(user.id);

  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="add" />

      <div className="flex w-full flex-col items-center justify-center">
        <div className="w-full">
          <Link
            href={`/properties/${params.propertyId}/add`}
            className="flex w-max items-center justify-center p-4"
          >
            <div className="-rotate-90">
              <DropDownIcon />
            </div>
            <p className="pl-2 text-xl">Back To Add</p>
          </Link>
        </div>
        <div className="p-2">
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
                isUserStorageFull={fullUser?.storageUsed >= freeStorageLimit}
              />
            }
            deviceType={deviceType}
          />
        </div>
      </div>
    </div>
  );
}
