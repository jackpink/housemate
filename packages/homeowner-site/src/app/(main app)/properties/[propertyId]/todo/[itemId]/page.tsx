import { auth } from "~/auth";
import { Property } from "../../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
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
  ToDoListIcon,
  UpArrowIcon,
} from "../../../../../../../../ui/Atoms/Icons";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";
import { Todos } from "../../../../../../../../core/homeowner/items/todos";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string; itemId: string };
}) {
  const session = await auth();

  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  console.log("session", session);

  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  if (session?.user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const item = await Item.get(params.itemId);

  if (!item) return <div>Item not found</div>;

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

  const toDos = await Todos.getAll(params.propertyId);

  const completedToDos = await Todos.getAllCompleted(params.propertyId, 7);

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
              deviceType={"mobile"}
            />
          </div>
          <div className="grow">
            <Link
              href={`/properties/${params.propertyId}/todo`}
              className="flex items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black lg:hidden"
            >
              <span className="-rotate-90">
                <DropDownIcon width={20} height={20} />
              </span>
              Back to To Dos
              <ToDoListIcon width={60} height={40} />
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
