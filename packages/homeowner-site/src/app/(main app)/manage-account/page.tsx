import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { redirect } from "next/navigation";
import { User } from "../../../../../core/homeowner/user";
import { CTAButton } from "../../../../../ui/Atoms/Button";
import { GeneralSettings } from "~/app/_components/ManageAccount";

export default async function ManageAccountPage() {
  const session = await auth();
  console.log("Session", session);

  if (!session || !session.user || !session.user.id) {
    // redirect to login
    redirect("/sign-in");
  }

  const user = await User.getById(session.user.id);

  if (!user) {
    return <div>Error locating User</div>;
  }

  return (
    <>
      <PageTitle>Manage Account</PageTitle>

      <PageWithSingleColumn>
        <h1 className="border-b-2 border-black font-semibold">General</h1>
        <div className="flex flex-col items-center justify-center">
          <GeneralSettings user={user} />
        </div>
        <h1 className="border-b-2 border-black font-semibold">Alerts</h1>
      </PageWithSingleColumn>
    </>
  );
}
