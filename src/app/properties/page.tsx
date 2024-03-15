import { auth, currentUser, useAuth } from "@clerk/nextjs";
import { PageWithSingleColumn } from "../_components/Atoms/PageLayout";
import { PageTitle } from "../_components/Atoms/Title";
import { Text } from "../_components/Atoms/Text";
import { PropertiesBreadcrumbs } from "../_components/Molecules/Breadcrumbs";
import { db } from "~/server/db";
import { homeowner, property } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { PgUUID } from "drizzle-orm/pg-core";
import { CTAButton } from "../_components/Atoms/Button";

const HomeownerPage = async () => {
  const { userId } = auth();

  console.log(userId);
  if (!userId) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return <HomeownerPageWithUser authId={userId} />;
};

type HomeownerPageWithUserProps = {
  authId: string;
};

async function getProperties(authUserId: string) {
  const properties = db
    .select()
    .from(property)
    .innerJoin(homeowner, eq(property.homeownerId, homeowner.id))
    .where(eq(homeowner.authId, authUserId));

  return properties;
}

const HomeownerPageWithUser: React.FC<HomeownerPageWithUserProps> = async ({
  authId,
}) => {
  const properties = await getProperties(authId);
  console.log(properties);
  return (
    <>
      <PageTitle>Properties</PageTitle>
      <PropertiesBreadcrumbs />
      <PageWithSingleColumn>
        <Text className="mb-6 border-b-2 border-black py-4 text-center font-sans text-xl font-extrabold text-slate-900">
          Welcome , this is your Dashboard. Create or Select a specific property
          or browse recent jobs here. stage
        </Text>
        <Properties properties={properties} />
        <Link href="/properties/create">
          <CTAButton>Add Property</CTAButton>
        </Link>
      </PageWithSingleColumn>
    </>
  );
};

export default HomeownerPage;

type Properties = Awaited<ReturnType<typeof getProperties>>;

const Properties = ({ properties }: { properties: Properties }) => {
  return (
    <div>
      <p>propeties</p>
    </div>
  );
};
