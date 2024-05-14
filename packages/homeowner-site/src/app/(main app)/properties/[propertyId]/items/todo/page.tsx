import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PageWithSingleColumn } from "../../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { Item } from "../../../../../../../../core/homeowner/item";
import ToDos, { UpdateItemPriorityServerAction } from "~/app/_components/ToDos";
import { revalidatePath } from "next/cache";
import clsx from "clsx";
import React from "react";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await auth();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  if (
    !session ||
    !session.user ||
    !session.user.id ||
    session.user.id !== property.homeownerId
  ) {
    return <div>Not Authenticated</div>;
  }

  const updateItem: UpdateItemPriorityServerAction = async ({
    id,
    priority,
  }) => {
    "use server";
    console.log("updateItem priority", priority);
    await Item.update({
      id,
      priority,
    });
    revalidatePath(`/properties/${params.propertyId}/items/todo`);
  };

  const toDos = await Item.getToDos(session.user.id);

  console.log(toDos);
  return (
    <div>
      <PageTitle>
        <CapitaliseText value={"To Do Items"} />
      </PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <ToDos toDos={toDos} updateItem={updateItem} />
      </PageWithSingleColumn>
    </div>
  );
}
