import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { Property } from "../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../core/homeowner/item";
import React from "react";
import PastItems from "~/app/_components/PastItems";
import SideMenu from "~/app/_components/SideMenu";
import Link from "next/link";
import {
  DropDownIcon,
  OptionsLargeIcon,
  PastIcon,
} from "../../../../../../../ui/Atoms/Icons";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

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

  const completedItems = await Item.getCompleted(user.id);

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="past" />
      <PageWithSingleColumn>
        <div className="flex items-center justify-center p-4 xs:hidden">
          <PastIcon width={30} height={30} />
          <h1 className="pl-2 text-2xl font-bold">Past</h1>
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
        <PastItems completedItems={completedItems} />
      </PageWithSingleColumn>
    </div>
  );
}
