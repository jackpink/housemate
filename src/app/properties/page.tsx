import { auth, currentUser } from "@clerk/nextjs";
import { PageWithSingleColumn } from "../_components/Atoms/PageLayout";
import { PageTitle } from "../_components/Atoms/Title";
import { Text } from "../_components/Atoms/Text";
import { PropertiesBreadcrumbs } from "../_components/Molecules/Breadcrumbs";
import { db } from "~/server/db";

const HomeownerPage = async () => {
  const { userId } = auth();
  const user = await currentUser();
  console.log(userId);
  if (!userId || !user) {
    return <>Loading</>;
  }
  //const propertiesWithJobs = api.property.getPropertiesForTradeUser.useQuery({ user: userId});

  return <HomeownerPageWithUser userId={userId} name={user.firstName} />;
};

type HomeownerPageWithUserProps = {
  userId: string;
  name: string | null;
};

const HomeownerPageWithUser: React.FC<HomeownerPageWithUserProps> = async ({
  userId,
  name,
}) => {
  return (
    <>
      <PageTitle>Properties</PageTitle>
      <PropertiesBreadcrumbs />
      <PageWithSingleColumn>
        <Text className="mb-6 border-b-2 border-black py-4 text-center font-sans text-xl font-extrabold text-slate-900">
          Welcome {name}, this is your Dashboard. Create or Select a specific
          property or browse recent jobs here. stage
        </Text>
      </PageWithSingleColumn>
    </>
  );
};

export default HomeownerPage;
