import { Property } from "../../../../../../../core/homeowner/property";
import React from "react";
import SideMenu from "~/app/_components/SideMenu";
import AddItem, { CommonTask } from "~/app/_components/AddItem";
import Link from "next/link";
import {
  DropDownIcon,
  LargeAddIcon,
  OptionsLargeIcon,
} from "../../../../../../../ui/Atoms/Icons";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import { RecurringSchedule, item } from "../../../../../../../core/db/schema";
import { Item } from "../../../../../../../core/homeowner/items/item";
import { Todos } from "../../../../../../../core/homeowner/items/todos";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const user = await getVerifiedUserOrRedirect();

  if (user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const items = await Todos.getAll({ propertyId: params.propertyId });
  const commonTasks: CommonTask[] = [
    {
      title: "Mow the lawn",
      recurring: true,
      schedule: RecurringSchedule.MONTHLY,
      exists: items.some((item) => item.commonTaskId === "mow-the-lawn"),
      id: "mow-the-lawn",
    },
    {
      title: "Clean the gutters",
      recurring: true,
      schedule: RecurringSchedule.QUARTERLY,
      exists: items.some((item) => item.commonTaskId === "clean-the-gutters"),
      id: "clean-the-gutters",
    },
    {
      title: "Change the air filters",
      recurring: true,
      schedule: RecurringSchedule.HALF_YEARLY,
      exists: items.some(
        (item) => item.commonTaskId === "change-the-air-filters",
      ),
      id: "change-the-air-filters",
    },
    {
      title: "Check the smoke alarms",
      recurring: true,
      schedule: RecurringSchedule.MONTHLY,
      exists: items.some(
        (item) => item.commonTaskId === "check-the-smoke-alarms",
      ),
      id: "check-the-smoke-alarms",
    },
  ];

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="add" />
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex items-center justify-center p-4 xs:hidden">
          <LargeAddIcon width={30} height={30} />
          <h1 className="pl-2 text-2xl font-bold">Add</h1>
        </div>
        <Link
          href={`/properties/${params.propertyId}`}
          className="flex w-full items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black xs:hidden"
        >
          <span className="-rotate-90">
            <DropDownIcon width={20} height={20} />
          </span>
          <span className="pl-2 pr-3">Back to Property Menu</span>
          <OptionsLargeIcon width={30} height={30} />
        </Link>
        <AddItem
          homeownerId={user.id}
          propertyId={params.propertyId}
          commonTasks={commonTasks}
        />
      </div>
    </div>
  );
}
