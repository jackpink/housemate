import { auth } from "@clerk/nextjs";
import { PageWithSingleColumn } from "../_components/Atoms/PageLayout";
import { PageTitle } from "../_components/Atoms/Title";
import { Text } from "../_components/Atoms/Text";
import { PropertiesBreadcrumbs } from "../_components/Molecules/Breadcrumbs";
import { db } from "~/server/db";
import { homeowner, property } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CTAButton } from "../_components/Atoms/Button";
import { concatAddress } from "~/utils/functions";
import { InferSelectModel } from "drizzle-orm";
import { PlusIcon } from "../_components/Atoms/Icons";

async function getProperties() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("No UserId");
  }

  const properties = await db
    .select()
    .from(property)
    .innerJoin(homeowner, eq(property.homeownerId, homeowner.id))
    .where(eq(homeowner.authId, userId));

  return properties;
}

const HomeownerPage = async () => {
  const properties = await getProperties();
  return (
    <>
      <PageTitle>Properties</PageTitle>
      <PropertiesBreadcrumbs />
      <PageWithSingleColumn>
        <Properties properties={properties} />
      </PageWithSingleColumn>
    </>
  );
};

export default HomeownerPage;

type Properties = Awaited<ReturnType<typeof getProperties>>;
//type Property = Properties[0]["property"];

type Property = InferSelectModel<typeof property>;

const Properties = ({ properties }: { properties: Properties }) => {
  return (
    <div className="p-10">
      {properties.map((property) => (
        <div className="my-5" key={property.property.id}>
          <Property {...property.property} />
        </div>
      ))}

      <Link href="/properties/create" className="block">
        <CTAButton rounded className="w-full">
          <div className="flex w-full items-center justify-center">
            <PlusIcon width={28} />{" "}
            <Text className="ml-10 text-xl">Add Property</Text>
          </div>
        </CTAButton>
      </Link>
    </div>
  );
};

const Property = (property: Property) => {
  const address = concatAddress(property);

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="rounded-full bg-altSecondary p-7 hover:bg-altSecondary/80">
        <Text className="text-xl font-bold">{address}</Text>
      </div>
    </Link>
  );
};
