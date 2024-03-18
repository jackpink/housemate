import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { homeowner, property } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { PageTitle } from "~/app/_components/Atoms/Title";
import { concatAddress } from "~/utils/functions";
import { PropertiesBreadcrumbs } from "~/app/_components/Molecules/Breadcrumbs";
import { PageWithSingleColumn } from "~/app/_components/Atoms/PageLayout";

async function getProperty({ propertyId }: { propertyId: string }) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("No UserId");
  }

  const [propertyObj] = await db
    .select()
    .from(property)
    .innerJoin(homeowner, eq(property.homeownerId, homeowner.id))
    .where(eq(property.id, propertyId));

  if (propertyObj?.homeowner.authId !== userId) {
    throw new Error("Unauthorized");
  }

  return propertyObj;
}
export default async function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const property = (await getProperty({ propertyId: params.propertyId }))
    .property;

  const address = concatAddress(property);
  return (
    <>
      <PageTitle>{address}</PageTitle>
      <PropertiesBreadcrumbs propertyId={params.propertyId} address={address} />
      <PageWithSingleColumn>
        {/*Cover Image */}
        {/*Property Details */}
        {/* Links to main pages */}
      </PageWithSingleColumn>
    </>
  );
}
