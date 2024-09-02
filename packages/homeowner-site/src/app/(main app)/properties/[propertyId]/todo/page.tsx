import { Property } from "../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../core/homeowner/items/item";
import { Todos } from "../../../../../../../core/homeowner/items/todos";
import React from "react";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import ToDos, { UpdateItemPriorityServerAction } from "~/app/_components/ToDos";
import { revalidatePath } from "next/cache";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import Link from "next/link";
import {
  DropDownIcon,
  GeneralHomeIcon,
  ToDoIcon,
} from "../../../../../../../ui/Atoms/Icons";
import { PageTitle } from "../../../../../../../ui/Atoms/Title";
import { PropertyNotFound } from "~/app/_components/NotFound";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const property = await Property.get(params.propertyId);

  if (!property) return <PropertyNotFound />;

  const user = await getVerifiedUserOrRedirect();

  if (user.id !== property.homeownerId) {
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

  const completedToDos = await Todos.getAllCompleted({
    propertyId: params.propertyId,
    range: 7,
  });

  return (
    <div className="flex w-full">
      <SideMenu propertyId={params.propertyId} selected="todo" />
      <div className="flex-1">
        <div className="flex justify-center ">
          <div className="max-w-[800px] grow">
            <Link
              href={`/properties/${params.propertyId}`}
              className="flex w-max items-center justify-center p-4 xs:hidden"
            >
              <div className="-rotate-90 pb-6">
                <DropDownIcon />
              </div>
              <GeneralHomeIcon width={30} height={30} />
              <p className="pl-2 text-xl">Property Menu</p>
            </Link>
            <PageTitle className="flex items-center justify-center">
              <ToDoIcon width={40} height={40} /> To Dos
            </PageTitle>
            <ToDos
              toDos={toDos}
              completedToDos={completedToDos}
              updateItem={updateItemPriority}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
