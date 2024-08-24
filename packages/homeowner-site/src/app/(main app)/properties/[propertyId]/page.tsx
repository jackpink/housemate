import { PropertiesBreadcrumbs } from "~/app/_components/Breadcrumbs";
import { PageTitle } from "../../../../../../ui/Atoms/Title";
import { PageWithSingleColumn } from "../../../../../../ui/Atoms/PageLayout";
import { Property } from "../../../../../../core/homeowner/property";
import { Text } from "../../../../../../ui/Atoms/Text";
import Link from "next/link";
import {
  LargeAddIcon,
  LargeSearchIcon,
  PastIcon,
  PlusIcon,
  RecurringIcon,
  ScheduleIcon,
  ToDoListIcon,
  TradeRequestIcon,
} from "../../../../../../ui/Atoms/Icons";
import { concatAddress } from "~/utils/functions";
import { getVerifiedUserOrRedirect } from "~/utils/pageRedirects";

export default async function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  console.log("PropertyId", params.propertyId);

  const property = await Property.get(params.propertyId);

  if (!property) return <div>Property not found</div>;

  const address = concatAddress(property);

  const user = await getVerifiedUserOrRedirect();

  if (user.id !== property.homeownerId) {
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
            href={`/properties/${params.propertyId}/search`}
            className="block"
          >
            <div className="h-full w-full  p-7">
              <div className="flex w-full flex-col items-center justify-center">
                <LargeSearchIcon width={45} height={45} />
                <Text className="text-xl font-bold">Search</Text>
              </div>
            </div>
          </Link>
          <Link href={`/properties/${params.propertyId}/add`} className="block">
            <div className="h-full w-full  p-7">
              <div className="flex w-full flex-col items-center justify-center">
                <LargeAddIcon width={40} height={40} />
                <Text className="text-xl font-bold">Add Task</Text>
              </div>
            </div>
          </Link>
        </div>
      </PageWithSingleColumn>
    </>
  );
}
