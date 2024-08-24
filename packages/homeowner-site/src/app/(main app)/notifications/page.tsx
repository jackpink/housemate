import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { validateRequest } from "~/auth";
import { redirect } from "next/navigation";
import { Alert } from "../../../../../core/homeowner/alert";
import { Alerts } from "~/app/_components/Alerts";

export default async function AlertsPage() {
  const { user } = await validateRequest();

  if (!user || !user.id) {
    // redirect to login
    redirect("/sign-in");
  }

  const alerts = await Alert.getForHomeowner(user.id);

  return (
    <>
      <PageTitle>Alerts</PageTitle>

      <PageWithSingleColumn>
        <Alerts alerts={alerts} />
      </PageWithSingleColumn>
    </>
  );
}
