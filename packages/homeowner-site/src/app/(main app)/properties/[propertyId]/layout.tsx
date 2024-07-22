import { PropertiesPageWithSideMenu } from "~/app/_components/Layout";
import { Property } from "../../../../../../core/homeowner/property";
import { redirect } from "next/navigation";
import Nav from "~/app/_components/Nav";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

async function getAddresses({ userId }: { userId: string }) {
  console.log("Getting properties for user", userId);
  return await Property.getByHomeownerId(userId);
}
export default async function MainAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { propertyId: string };
}) {
  const user = await getVerifiedUserOrRedirect();

  console.log("params", params);

  const properties = await getAddresses({ userId: user.id });
  return (
    <>
      <Nav properties={properties} currentPropertyId={params.propertyId} />
      {children}
    </>
  );
}
