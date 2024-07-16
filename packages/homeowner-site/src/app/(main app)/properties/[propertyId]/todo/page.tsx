import { validateRequest } from "~/auth";
import { Property } from "../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../core/homeowner/items/item";
import { Todos } from "../../../../../../../core/homeowner/items/todos";
import React from "react";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import ToDos, { UpdateItemPriorityServerAction } from "~/app/_components/ToDos";
import { revalidatePath } from "next/cache";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const { user } = await validateRequest();

  if (!user || !user.id) {
    // redirect to login
    redirect("/sign-in");
  }

  if (user?.id !== property.homeownerId) {
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
