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
import { DeletePropertyButtonDialog } from "~/app/_components/CreateProperty";

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
          <MainMenuLinkButton
            href={`/properties/${params.propertyId}/todo`}
            Icon={<ToDoListIcon width={45} height={45} colour="black" />}
            IconSecondary={
              <ToDoListIcon width={45} height={45} colour="#c470e7" />
            }
            title="To Do List"
          />
          <MainMenuLinkButton
            href={`/properties/${params.propertyId}/schedule`}
            Icon={<ScheduleIcon width={45} height={45} />}
            IconSecondary={
              <ScheduleIcon width={45} height={45} colour="#c470e7" />
            }
            title="Schedule"
          />

          <MainMenuLinkButton
            href={`/properties/${params.propertyId}/search`}
            Icon={<LargeSearchIcon width={45} height={45} />}
            IconSecondary={
              <LargeSearchIcon width={45} height={45} colour="#c470e7" />
            }
            title="Search"
          />

          <MainMenuLinkButton
            href={`/properties/${params.propertyId}/add`}
            Icon={<LargeAddIcon width={40} height={40} />}
            IconSecondary={
              <LargeAddIcon width={40} height={40} colour="#c470e7" />
            }
            title="Add Task"
          />
        </div>
        <div className="flex w-full justify-center">
          <DeletePropertyButtonDialog propertyId={params.propertyId} />
        </div>
      </PageWithSingleColumn>
    </>
  );
}

function MainMenuLinkButton({
  href,
  Icon,
  IconSecondary,
  title,
}: {
  href: string;
  Icon: React.ReactNode;
  IconSecondary: React.ReactNode;
  title: string;
}) {
  return (
    <Link href={href} className="group/todo block">
      <div className="h-full w-full p-7">
        <div className="flex w-full flex-col items-center justify-center">
          <div className=" group-hover/todo:hidden group-focus/todo:hidden">
            {Icon}
          </div>
          <div className="hidden group-hover/todo:flex group-focus/todo:flex group-focus/todo:animate-pulse">
            {IconSecondary}
          </div>
          <Text className="text-xl font-bold group-hover/todo:text-brandSecondary group-focus/todo:animate-pulse group-focus/todo:text-brandSecondary">
            {title}
          </Text>
        </div>
      </div>
    </Link>
  );
}
