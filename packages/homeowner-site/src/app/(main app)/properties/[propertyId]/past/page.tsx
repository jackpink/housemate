import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../../ui/Atoms/Title";
import { CapitaliseText } from "../../../../../../../ui/Molecules/InPlaceEditableComponent";
import { PageWithSingleColumn } from "../../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../../core/homeowner/property";
import { concatAddress } from "~/utils/functions";
import { Item } from "../../../../../../../core/homeowner/item";
import React from "react";
import { getDeviceType } from "~/app/actions";
import { redirect } from "next/navigation";
import PastItems from "~/app/_components/PastItems";
import SideMenu from "~/app/_components/SideMenu";
import Link from "next/link";
import { DropDownIcon } from "../../../../../../../ui/Atoms/Icons";

export default async function ToDoPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await auth();

  const deviceType = await getDeviceType();

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  console.log("session", session);

  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  if (session?.user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  const completedItems = await Item.getCompleted(session.user.id);

  return (
    <div className="flex">
      <SideMenu propertyId={params.propertyId} selected="past" />
      <PageWithSingleColumn>
        <Link
          href={`/properties/${params.propertyId}`}
          className="flex items-center rounded-md bg-altSecondary p-2 text-xl shadow-sm shadow-black xs:hidden"
        >
          <span className="-rotate-90">
            <DropDownIcon width={20} height={20} />
          </span>
          Back to Property Menu
        </Link>
        <PastItems completedItems={completedItems} deviceType={deviceType} />
      </PageWithSingleColumn>
    </div>
  );
}
