import { PropertiesPageWithSideMenu } from "~/app/_components/Layout";
import {
  Property,
  concatAddress,
} from "../../../../../../core/homeowner/property";
import { redirect } from "next/navigation";
import Nav from "~/app/_components/Nav";
import { validateRequest } from "~/auth";

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
  const { user } = await validateRequest();

  if (!user || !user.id) {
    // redirect to login
    redirect("/sign-in");
  }
  console.log("params", params);

  const properties = await getAddresses({ userId: user.id });
  return (
    <>
      <Nav properties={properties} currentPropertyId={params.propertyId} />
      {children}
    </>
  );
}
