import { PropertiesPageWithSideMenu } from "~/app/_components/Layout";
import {
  Property,
  concatAddress,
} from "../../../../../core/homeowner/property";
import { auth } from "~/auth";
import { redirect } from "next/navigation";
import Nav from "~/app/_components/Nav";

async function getAddresses({ userId }: { userId: string }) {
  console.log("Getting properties for user", userId);
  return await Property.getByHomeownerId(userId);
}
export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  const properties = await getAddresses({ userId: session.user.id! });
  return (
    <>
      <Nav properties={properties} />
      {children}
    </>
  );
}
