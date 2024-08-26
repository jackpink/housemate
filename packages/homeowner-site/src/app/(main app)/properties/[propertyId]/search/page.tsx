import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { Property } from "../../../../../../../core/homeowner/property";
import { Item } from "../../../../../../../core/homeowner/items/item";
import React from "react";
import PastItems from "~/app/_components/PastItems";
import SideMenu from "~/app/_components/SideMenu";
import Link from "next/link";
import {
  DropDownIcon,
  GeneralHomeIcon,
  LargeSearchIcon,
} from "../../../../../../../ui/Atoms/Icons";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

export default async function ToDoPage({
  params,
  searchParams,
}: {
  params: { propertyId: string };
  searchParams: {
    limit?: number;
  };
}) {
  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const user = await getVerifiedUserOrRedirect();

  if (user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const completedItems = await Item.getAll({ propertyId: params.propertyId });

  console.log("searchParams Limit", searchParams.limit);
  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="search" />
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
          <LargeSearchIcon height={30} width={30} />
          <h1 className="pl-2 text-2xl font-bold">Search</h1>
        </div>

        <PastItems
          completedItems={completedItems}
          itemsToShow={searchParams.limit || 10}
        />
      </PageWithSingleColumn>
    </div>
  );
}
