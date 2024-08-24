import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { Property } from "../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../core/homeowner/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import SideMenu from "~/app/_components/SideMenu";
import Schedule from "~/app/_components/Schedule";
import {
  DropDownIcon,
  GeneralHomeIcon,
  OptionsLargeIcon,
  ScheduleIcon,
} from "../../../../../../../ui/Atoms/Icons";
import Link from "next/link";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

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
  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const user = await getVerifiedUserOrRedirect();

  if (user.id !== property.homeownerId) {
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
        <div className="flex items-center justify-center p-4 xs:hidden">
          <ScheduleIcon width={30} height={30} />
          <h1 className="pl-2 text-2xl font-bold">Schedule</h1>
        </div>

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
