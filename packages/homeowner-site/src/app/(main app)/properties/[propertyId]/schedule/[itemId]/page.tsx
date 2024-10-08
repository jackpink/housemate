import { Property } from "../../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../../core/homeowner/items/item";
import { Schedule as ScheduleClass } from "../../../../../../../../core/homeowner/items/schedule";
import React from "react";
import { getDeviceType, getValidAddress } from "~/app/actions";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import {
  DropDownIcon,
  GeneralHomeIcon,
  ScheduleIcon,
  ToDoListIcon,
} from "../../../../../../../../ui/Atoms/Icons";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";
import Schedule from "~/app/_components/Schedule";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import { ItemNotFound, PropertyNotFound } from "~/app/_components/NotFound";
import { User } from "../../../../../../../../core/homeowner/user";
import { freeStorageLimit } from "~/utils/functions";

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
  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <PropertyNotFound />;

  const user = await getVerifiedUserOrRedirect();

  if (user.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const item = await Item.get(params.itemId);

  if (!item)
    return (
      <ItemNotFound propertyId={params.propertyId} currentPage="schedule" />
    );

  const pastMonths = searchParams.pastMonths || 3;

  const futureMonths = searchParams.futureMonths || 9;

  const scheduledItems = await ScheduleClass.get({
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
  const fullUser = await User.getById(user.id);
  if (!fullUser) {
    return <div>Can't fnuid user</div>;
  }

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
              className="flex items-center p-2 text-xl lg:hidden"
            >
              <span className="-rotate-90">
                <DropDownIcon width={20} height={20} />
              </span>
              Back to Schedule
              <ScheduleIcon width={60} height={40} />
            </Link>
            <div className="p-2">
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
