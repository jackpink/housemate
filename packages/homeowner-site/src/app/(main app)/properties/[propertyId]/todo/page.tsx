import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { Item } from "../../../../../../../core/homeowner/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import PastItems from "~/app/_components/PastItems";
import SideMenu from "~/app/_components/SideMenu";
import ToDos, { UpdateItemPriorityServerAction } from "~/app/_components/ToDos";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  DropDownIcon,
  OptionsLargeIcon,
  ToDoIcon,
} from "../../../../../../../ui/Atoms/Icons";
import { ToDosLoading } from "~/app/_components/Loading";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
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

  const updateItem: UpdateItemPriorityServerAction = async ({
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

  const toDos = await Item.getToDos(session.user.id);

  const completedToDos = await Item.getToDosCompletedThisWeek(
    params.propertyId,
  );

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="todo" />
      <PageWithSingleColumn>
        <div className="flex items-center justify-center p-4 xs:hidden">
          <ToDoIcon width={30} height={30} />
          <h1 className="pl-2 text-2xl font-bold">To Do List</h1>
        </div>
        <Link
          href={`/properties/${params.propertyId}`}
          className="flex items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black xs:hidden"
        >
          <span className="-rotate-90">
            <DropDownIcon width={20} height={20} />
          </span>
          <span className="pl-2 pr-3">Back to Property Menu</span>
          <OptionsLargeIcon width={30} height={30} />
        </Link>
        <ToDos
          toDos={toDos}
          completedToDos={completedToDos}
          updateItem={updateItem}
          deviceType={"mobile"}
        />
      </PageWithSingleColumn>
    </div>
  );
}
