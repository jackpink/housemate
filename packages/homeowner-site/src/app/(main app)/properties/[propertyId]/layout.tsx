import { Property } from "../../../../../../core/homeowner/property";
import Nav from "~/app/_components/Nav";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";
import { Alert } from "../../../../../../core/homeowner/alert";

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

  const unviewedNotifications = await Alert.getNumberOfUnviewed(user.id);
  return (
    <>
      <Nav
        properties={properties}
        currentPropertyId={params.propertyId}
        unviewedNotifications={unviewedNotifications}
      />
      {children}
    </>
  );
}
