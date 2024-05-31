import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { redirect } from "next/navigation";
import { Alert } from "../../../../../core/homeowner/alert";
import { Alerts } from "~/app/_components/Alerts";

export default async function AlertsPage() {
  const session = await auth();
  console.log("Session", session);

  if (!session || !session.user || !session.user.id) {
    // redirect to login
    redirect("/sign-in");
  }

  const alerts = await Alert.getForHomeowner(session.user.id);

  return (
    <>
      <PageTitle>Alerts</PageTitle>

      <PageWithSingleColumn>
        <Alerts alerts={alerts} />
      </PageWithSingleColumn>
    </>
  );
}
