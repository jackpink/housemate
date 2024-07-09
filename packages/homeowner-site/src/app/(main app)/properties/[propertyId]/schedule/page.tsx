import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../core/homeowner/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import Schedule from "~/app/_components/Schedule";
import {
  DropDownIcon,
  OptionsLargeIcon,
  ScheduleIcon,
} from "../../../../../../../ui/Atoms/Icons";
import Link from "next/link";

export default async function ToDoPage({
  params,
  searchParams,
}: {
  params: { propertyId: string };
  searchParams: {
    pastMonths?: number;
    futureMonths?: number;
  };
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

  const pastMonths = searchParams.pastMonths || 3;

  const futureMonths = searchParams.futureMonths || 9;

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
        <div className="flex items-center justify-center p-4 xs:hidden">
          <ScheduleIcon width={30} height={30} />
          <h1 className="pl-2 text-2xl font-bold">Schedule</h1>
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
        <Schedule
          scheduledItems={scheduledItems}
          deviceType={deviceType}
          pastMonths={pastMonths}
          futureMonths={futureMonths}
        />
      </PageWithSingleColumn>
    </div>
  );
}
