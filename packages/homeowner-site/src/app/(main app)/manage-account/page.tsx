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

export default async function ManageAccountPage() {
  const user = await getUserOrRedirect();

  const deviceType = await getDeviceType();

  const userObj = await User.getById(user.id);

  if (!user) {
    return <div>Error locating User</div>;
  }

  return (
    <>
      <PageTitle>Manage Account</PageTitle>

      <PageWithSingleColumn>
        <h1 className="border-b-2 border-black font-semibold">General</h1>
        <div className="flex flex-col items-center justify-center">
          <GeneralSettings user={userObj} deviceType={deviceType} />
        </div>
        <h1 className="border-b-2 border-black font-semibold">Alerts</h1>
        <div>
          <AlertSettings user={userObj} deviceType={deviceType} />
        </div>
      </PageWithSingleColumn>
    </>
  );
}
