import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { redirect } from "next/navigation";
import { User } from "../../../../../core/homeowner/user";
import {
  AlertSettings,
  GeneralSettings,
} from "~/app/_components/ManageAccount";
import { getDeviceType } from "~/app/actions";
import { getUserOrRedirect } from "~/utils/pageRedirects";
import { Property } from "../../../../../core/homeowner/property";
import Nav from "~/app/_components/Nav";
import { Alert } from "../../../../../core/homeowner/alert";

async function getProperties({ userId }: { userId: string }) {
  console.log("Getting properties for user", userId);
  return Property.getByHomeownerId(userId);
}

export default async function ManageAccountPage() {
  const user = await getUserOrRedirect();

  const deviceType = await getDeviceType();

  const userObj = await User.getById(user.id);

  if (!userObj) {
    return <div>Error locating User</div>;
  }
  const properties = await getProperties({ userId: user.id });

  const unviewedNotifications = await Alert.getNumberOfUnviewed(user.id);

  return (
    <>
      <Nav
        properties={properties}
        currentPropertyId={""}
        unviewedNotifications={unviewedNotifications}
      />
      <PageTitle>Manage Account</PageTitle>

      <div className="mx-auto w-full md:w-112 ">
        <h1 className="border-b-2 border-black font-semibold">General</h1>
        <div className="flex flex-col items-center justify-center">
          <GeneralSettings user={userObj} deviceType={deviceType} />
        </div>
        <h1 className="border-b-2 border-black font-semibold">Alerts</h1>
        <div>
          <AlertSettings user={userObj} deviceType={deviceType} />
        </div>
      </div>
    </>
  );
}
