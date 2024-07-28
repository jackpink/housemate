import { PageWithSingleColumn } from "../../../../../../ui/Atoms/PageLayout";
import { PageTitle } from "../../../../../../ui/Atoms/Title";
import CreateProperty from "~/app/_components/CreateProperty";
import Nav from "~/app/_components/Nav";
import { Property } from "../../../../../../core/homeowner/property";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import Link from "next/link";
import { DropDownIcon } from "../../../../../../ui/Atoms/Icons";

async function getProperties({ userId }: { userId: string }) {
  console.log("Getting properties for user", userId);
  return Property.getByHomeownerId(userId);
}

export default async function CreatePropertyPage() {
  const user = await getVerifiedUserOrRedirect();
  const properties = await getProperties({ userId: user.id });
  return (
    <>
      <Nav properties={properties} currentPropertyId={""} />
      <Link
        href="/properties"
        className="flex w-max items-center justify-center p-4"
      >
        <div className="-rotate-90">
          <DropDownIcon />
        </div>
        <p className="pl-2 text-xl">Properties</p>
      </Link>
      <PageTitle>Create New Property</PageTitle>

      <PageWithSingleColumn>
        <div className="pt-20">
          <CreateProperty />
        </div>
      </PageWithSingleColumn>
    </>
  );
}
