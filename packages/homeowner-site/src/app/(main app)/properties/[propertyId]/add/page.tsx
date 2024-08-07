import { Property } from "../../../../../../../core/homeowner/property";
import React from "react";
import SideMenu from "~/app/_components/SideMenu";
import AddItem from "~/app/_components/AddItem";
import Link from "next/link";
import {
  DropDownIcon,
  LargeAddIcon,
  OptionsLargeIcon,
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
        <AddItem homeownerId={user.id} propertyId={params.propertyId} />
      </div>
    </div>
  );
}
