import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../../ui/Atoms/PageLayout";
import { auth } from "~/auth";
import { Property } from "../../../../../../core/homeowner/property";
import { Text } from "../../../../../../ui/Atoms/Text";
import Link from "next/link";
import { CTAButton } from "../../../../../../ui/Atoms/Button";
import {
  LargeAddIcon,
  PastIcon,
  PlusIcon,
  RecurringIcon,
  ScheduleIcon,
  ToDoListIcon,
  TradeRequestIcon,
} from "../../../../../../ui/Atoms/Icons";
import { concatAddress } from "~/utils/functions";
import { redirect } from "next/navigation";

export default async function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await auth();
  console.log("PropertyId", params.propertyId);

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  if (!session || !session.user) {
    // redirect to login
    redirect("/sign-in");
  }

  if (session?.user?.id !== property.homeownerId) {
    return <div>Not Authenticated</div>;
  }

  return (
    <>
      <PageTitle>{address}</PageTitle>
      <PageWithSingleColumn>
        <div className="grid grid-cols-2 gap-2  p-10">
          <Link
            href={`/properties/${params.propertyId}/todo`}
            className="block"
          >
            <div className="h-full w-full  p-7">
              <div className="flex w-full flex-col items-center justify-center">
                <ToDoListIcon width={45} height={45} />
                <Text className="text-xl font-bold">To Do List</Text>
              </div>
            </div>
          </Link>
          <Link
            href={`/properties/${params.propertyId}/schedule`}
            className="block"
          >
            <div className="h-full w-full p-7">
              <div className="flex w-full flex-col items-center justify-center">
                <ScheduleIcon width={45} height={45} />
                <Text className="text-xl font-bold">Schedule</Text>
              </div>
            </div>
          </Link>

          <Link
            href={`/properties/${params.propertyId}/recurring`}
            className="block"
          >
            <div className="h-full w-full p-7">
              <div className="flex w-full flex-col items-center justify-center">
                <RecurringIcon width={45} height={45} />
                <Text className="text-xl font-bold">Recurring</Text>
              </div>
            </div>
          </Link>
          <Link
            href={`/properties/${params.propertyId}/past`}
            className="block"
          >
            <div className="h-full w-full  p-7">
              <div className="flex w-full flex-col items-center justify-center">
                <PastIcon width={45} height={45} />
                <Text className="text-xl font-bold">Past Items</Text>
              </div>
            </div>
          </Link>
          <Link href={`/properties/${params.propertyId}/add`} className="block">
            <div className="h-full w-full  p-7">
              <div className="flex w-full flex-col items-center justify-center">
                <LargeAddIcon width={45} height={45} />
                <Text className="text-xl font-bold">Add Item</Text>
              </div>
            </div>
          </Link>
        </div>
      </PageWithSingleColumn>
    </>
  );
}
