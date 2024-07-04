import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../core/homeowner/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import Schedule from "~/app/_components/Schedule";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await auth();

  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  console.log("session", session);

  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  if (session?.user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const pastMonths = 3;

  const futureMonths = 9;

  const scheduledItems = await Item.getSchedule({
    propertyId: params.propertyId,
    currentDate: new Date(),
    pastMonths: pastMonths,
    futureMonths: futureMonths,
  });

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="schedule" />
      <PageWithSingleColumn>
        <Schedule scheduledItems={scheduledItems} deviceType={deviceType} />
      </PageWithSingleColumn>
    </div>
  );
}
