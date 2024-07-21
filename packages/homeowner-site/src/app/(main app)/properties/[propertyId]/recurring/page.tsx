import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { Property } from "../../../../../../../core/homeowner/property";
import { Recurring as RecurringObj } from "../../../../../../../core/homeowner/items/recurring";
import React from "react";
import SideMenu from "~/app/_components/SideMenu";
import {
  DropDownIcon,
  GeneralHomeIcon,
  OptionsIcon,
  OptionsLargeIcon,
  RecurringIcon,
} from "../../../../../../../ui/Atoms/Icons";
import Link from "next/link";
import Recurring from "~/app/_components/Recurring";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

export default async function RecurringPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const user = await getVerifiedUserOrRedirect();

  if (user.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  // get all recurring tasks
  const recurringItems = await RecurringObj.getAll({
    propertyId: params.propertyId,
  });

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="recurring" />
      <PageWithSingleColumn>
        <div className="flex items-center justify-center p-4 xs:hidden">
          <RecurringIcon width={30} height={30} />
          <h1 className="pl-2 text-2xl font-bold">Recurring</h1>
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
        <Recurring
          recurringTasks={recurringItems}
          propertyId={params.propertyId}
        />
      </PageWithSingleColumn>
    </div>
  );
}
