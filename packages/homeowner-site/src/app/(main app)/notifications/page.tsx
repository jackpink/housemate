import { PageTitle } from "../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../ui/Atoms/PageLayout";
import { redirect } from "next/navigation";
import { Alert } from "../../../../../core/homeowner/alert";
import { Alerts } from "~/app/_components/Alerts";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import Nav from "~/app/_components/Nav";
import { Property } from "../../../../../core/homeowner/property";
import {
  AlertsIcon,
  DropDownIcon,
  GeneralHomeIcon,
} from "../../../../../ui/Atoms/Icons";
import Link from "next/link";

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

  const unViewedAlerts = alerts.filter((alert) => !alert.viewed).length;

  return (
    <>
      <Nav properties={properties} currentPropertyId={""} />
      <Link
        href={`/properties/`}
        className="flex w-max items-center justify-center p-4"
      >
        <div className="-rotate-90 pb-6">
          <DropDownIcon />
        </div>
        <GeneralHomeIcon width={30} height={30} />
        <p className="pl-2 text-xl">Properties</p>
      </Link>
      <PageTitle className="flex items-center justify-center gap-4">
        <AlertsIcon height={40} selected={false} colour="black" /> Notifications
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brandSecondary text-lg text-white">
          {unViewedAlerts}
        </span>
      </PageTitle>

      <div className="mx-auto w-full md:w-112 ">
        <h1 className="border-b-2 border-black font-semibold">General</h1>
        <div className="flex flex-col items-center justify-center">
          <Alerts alerts={alerts} />
        </div>
      </div>
    </>
  );
}
