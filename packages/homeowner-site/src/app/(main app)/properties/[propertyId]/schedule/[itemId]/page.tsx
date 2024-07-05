import { auth } from "~/auth";
import { Property } from "../../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../../core/homeowner/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  DropDownIcon,
  ScheduleIcon,
  ToDoListIcon,
} from "../../../../../../../../ui/Atoms/Icons";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";
import Schedule from "~/app/_components/Schedule";

export default async function ToDoPage({
  params,
  searchParams,
}: {
  params: { propertyId: string; itemId: string };
  searchParams: {
    pastMonths?: number;
    futureMonths?: number;
  };
}) {
  const session = await auth();

  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  if (session?.user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const item = await Item.get(params.itemId);

  if (!item) return <div>Item not found</div>;

  const pastMonths = searchParams.pastMonths || 3;

  const futureMonths = searchParams.futureMonths || 9;

  const scheduledItems = await Item.getSchedule({
    propertyId: params.propertyId,
    currentDate: new Date(),
    pastMonths: pastMonths,
    futureMonths: futureMonths,
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

  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";

  return (
    <div className="flex w-full">
      <SideMenu propertyId={params.propertyId} selected="schedule" />
      <div className="flex-1">
        <div className="flex justify-center ">
          <div className="hidden max-w-[800px] grow lg:block">
            <Schedule
              scheduledItems={scheduledItems}
              deviceType={deviceType}
              pastMonths={pastMonths}
              futureMonths={futureMonths}
            />
          </div>
          <div className="grow">
            <Link
              href={`/properties/${params.propertyId}/schedule`}
              className="flex items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black lg:hidden"
            >
              <span className="-rotate-90">
                <DropDownIcon width={20} height={20} />
              </span>
              Back to Schedule
              <ScheduleIcon width={60} height={40} />
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
