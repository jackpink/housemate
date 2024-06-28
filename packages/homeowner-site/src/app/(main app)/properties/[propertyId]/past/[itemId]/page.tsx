import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PageWithSingleColumn } from "../../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { Item } from "../../../../../../../../core/homeowner/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import PastItems from "~/app/_components/PastItems";
import SideMenu from "~/app/_components/SideMenu";
import EditItem, { UpdateItemServerAction } from "~/app/_components/EditItem";
import { revalidatePath } from "next/cache";
import Files from "~/app/_components/Files";
import { Bucket } from "sst/node/bucket";
import { PastIcon } from "../../../../../../../../ui/Atoms/Icons";
import Link from "next/link";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string; itemId: string };
}) {
  const session = await auth();

  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const item = await Item.get(params.itemId);

  if (!item) return <div>Item not found</div>;

  const address = concatAddress(property);

  console.log("session", session);

  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  if (session?.user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }
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
    revalidatePath(`/properties/${params.propertyId}/items/${params.itemId}`);
  };

  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";

  const completedItems = await Item.getCompleted(session.user.id);

  return (
    <div className="flex justify-center">
      <SideMenu propertyId={params.propertyId} selected="past" />
      <div className="hidden lg:block">
        <PastItems completedItems={completedItems} deviceType={deviceType} />
      </div>
      <div>
        <Link
          href={`/properties/${params.propertyId}/past`}
          className="flex items-center rounded-md bg-altSecondary p-2 text-xl lg:hidden"
        >
          Back to Past Items
          <PastIcon width={60} height={40} />
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
  );
}
