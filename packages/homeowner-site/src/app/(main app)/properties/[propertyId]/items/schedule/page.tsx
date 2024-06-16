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

  const scheduledItems = await Item.getSchedule({
    propertyId: params.propertyId,
    currentDate: new Date(),
    pastMonths: 1,
    futureMonths: 12,
  });

  return (
    <div>
      <PageTitle>
        <CapitaliseText value={"Schedule"} />
      </PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        <Schedule scheduledItems={scheduledItems} deviceType={deviceType} />
      </PageWithSingleColumn>
    </div>
  );
}
