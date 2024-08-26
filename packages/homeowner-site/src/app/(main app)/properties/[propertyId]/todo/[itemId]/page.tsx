import { Property } from "../../../../../../../../core/homeowner/property";
import { concatAddress, freeStorageLimit } from "~/utils/functions";
import { Item } from "../../../../../../../../core/homeowner/items/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import ToDos, { UpdateItemPriorityServerAction } from "~/app/_components/ToDos";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  DropDownIcon,
  GeneralHomeIcon,
  ToDoListIcon,
  UpArrowIcon,
} from "../../../../../../../../ui/Atoms/Icons";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";
import { Todos } from "../../../../../../../../core/homeowner/items/todos";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import { ItemNotFound } from "~/app/_components/NotFound";
import { User } from "../../../../../../../../core/homeowner/user";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string; itemId: string };
}) {
  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const user = await getVerifiedUserOrRedirect();

  if (user.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const item = await Item.get(params.itemId);

  if (!item)
    return <ItemNotFound propertyId={params.propertyId} currentPage="todo" />;

  const updateItemPriority: UpdateItemPriorityServerAction = async ({
    id,
    priority,
    status,
  }) => {
    "use server";
    console.log("updateItem priority", priority);
    console.log("updateItem status", status);
    await Item.update({
      id,
      priority,
      status,
    });
    revalidatePath(`/properties/${params.propertyId}/todo`);
  };

  const toDos = await Todos.getAll({ propertyId: params.propertyId });

  const completedToDos = await Todos.getAllCompleted({
    propertyId: params.propertyId,
    range: 7,
  });

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

  const fullUser = await User.getById(user.id);

  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";

  return (
    <div className="flex w-full">
      <SideMenu propertyId={params.propertyId} selected="todo" />
      <div className="flex-1">
        <div className="flex justify-center ">
          <div className="hidden max-w-[800px] grow lg:block">
            <ToDos
              toDos={toDos}
              completedToDos={completedToDos}
              updateItem={updateItemPriority}
            />
          </div>
          <div className="grow">
            <Link
              href={`/properties/${params.propertyId}/todo`}
              className="flex items-center p-2 text-xl lg:hidden"
            >
              <span className="-rotate-90">
                <DropDownIcon width={20} height={20} />
              </span>
              Back to To Dos
              <ToDoListIcon width={60} height={40} />
            </Link>
            <div className="flex flex-col items-center justify-center p-1 sm:p-2 md:p-16">
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
                    isUserStorageFull={
                      fullUser?.storageUsed >= freeStorageLimit
                    }
                  />
                }
                deviceType={deviceType}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
