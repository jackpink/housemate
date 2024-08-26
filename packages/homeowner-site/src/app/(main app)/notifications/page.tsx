import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { redirect } from "next/navigation";
import { Alert } from "../../../../../core/homeowner/alert";
import { Alerts } from "~/app/_components/Alerts";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import Nav from "~/app/_components/Nav";
import { Property } from "../../../../../core/homeowner/property";

async function getProperties({ userId }: { userId: string }) {
  console.log("Getting properties for user", userId);
  return Property.getByHomeownerId(userId);
}

export default async function AlertsPage() {
  const user = await getVerifiedUserOrRedirect();

  if (!user || !user.id) {
    // redirect to login
    redirect("/sign-in");
  }
  const properties = await getProperties({ userId: user.id });
  const alerts = await Alert.getForHomeowner(user.id);

  return (
    <>
      <Nav properties={properties} currentPropertyId={""} />
      <PageTitle>Alerts</PageTitle>

      <div className="mx-auto w-full md:w-112 ">
        <h1 className="border-b-2 border-black font-semibold">General</h1>
        <div className="flex flex-col items-center justify-center">
          <Alerts alerts={alerts} />
        </div>
      </div>
    </>
  );
}
