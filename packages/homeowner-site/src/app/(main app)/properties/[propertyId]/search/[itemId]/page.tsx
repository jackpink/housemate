import { Property } from "../../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../../core/homeowner/items/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import PastItems from "~/app/_components/PastItems";
import SideMenu from "~/app/_components/SideMenu";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import { revalidatePath } from "next/cache";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";
import { PastIcon } from "../../../../../../../../ui/Atoms/Icons";
import Link from "next/link";
import { Todos } from "../../../../../../../../core/homeowner/items/todos";
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
    revalidatePath(`/properties/${params.propertyId}/past/${params.itemId}`);
  };

  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";

  const completedItems = await Todos.getAllCompleted({
    propertyId: user.id,
  });

  return (
    <div className="flex w-full">
      <SideMenu propertyId={params.propertyId} selected="past" />
      <div className="flex-1">
        <div className="flex justify-center ">
          <div className="hidden max-w-[800px] grow lg:block">
            <PastItems completedItems={completedItems} />
          </div>
          <div className="grow">
            <Link
              href={`/properties/${params.propertyId}/past`}
              className="flex items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black lg:hidden"
            >
              Back to Past Items
              <PastIcon width={60} height={40} />
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
      </div>
    </div>
  );
}
