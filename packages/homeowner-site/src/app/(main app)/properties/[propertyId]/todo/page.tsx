import { auth } from "~/auth";
import { Property } from "../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { Item } from "../../../../../../../core/homeowner/items/item";
import { Todos } from "../../../../../../../core/homeowner/items/todos";
import React, { useCallback, useMemo } from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import ToDos, { UpdateItemPriorityServerAction } from "~/app/_components/ToDos";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  DropDownIcon,
  OptionsLargeIcon,
  ToDoIcon,
  ToDoListIcon,
} from "../../../../../../../ui/Atoms/Icons";
import { ToDosLoading } from "~/app/_components/Loading";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";

export default async function ToDoPage({
  params,
  searchParams,
}: {
  params: { propertyId: string };
  searchParams: {
    filter?: string;
    itemId?: string;
  };
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

  const completedToDos = await Todos.getAllCompleted(params.propertyId, 7);

  let EditItemComponent = () => <></>;

  console.log("EditItemComponent", EditItemComponent);

  if (!!searchParams.itemId) {
    const item = await Item.get(searchParams.itemId);

    if (!item) {
      EditItemComponent = () => (
        <div className="flex h-svh flex-col items-center justify-center">
          Item not found
        </div>
      );
    } else {
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
          id: searchParams.itemId!,
          title,
          description,
          status,
          recurring,
          recurringSchedule,
          date,
          warrantyEndDate,
        });
        revalidatePath(
          `/properties/${params.propertyId}/past/${searchParams.itemId}`,
        );
      };

      const bucketName =
        // @ts-ignore
        (Bucket.ItemUploads.bucketName as string) || "not found";

      EditItemComponent = () => (
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
      );
    }
  }

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
        </div>
      </div>
    </div>
  );
}
