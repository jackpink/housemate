import Link from "next/link";
import {
  LargeAddIcon,
  LargeSearchIcon,
  PastIcon,
  RecurringIcon,
  ScheduleIcon,
  ToDoListIcon,
  TradeRequestIcon,
} from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";
import clsx from "clsx";

export default function SideMenu({
  propertyId,
  selected,
}: {
  propertyId: string;
  selected: "todo" | "schedule" | "recurring" | "search" | "add";
}) {
  return (
    <aside className="hidden max-w-min xs:block">
      <SideMenuLinkButton
        href={`/properties/${propertyId}/todo`}
        selected={selected === "todo"}
        Icon={<ToDoListIcon width={45} height={45} />}
        title="To Do List"
      />

      <SideMenuLinkButton
        href={`/properties/${propertyId}/schedule`}
        selected={selected === "schedule"}
        Icon={<ScheduleIcon width={45} height={45} />}
        title="Schedule"
      />

      <SideMenuLinkButton
        href={`/properties/${propertyId}/search`}
        selected={selected === "search"}
        Icon={<LargeSearchIcon width={45} height={45} />}
        title="Search"
      />

      <SideMenuLinkButton
        href={`/properties/${propertyId}/add`}
        selected={selected === "add"}
        Icon={<LargeAddIcon width={45} height={45} />}
        title="Add Task"
      />
    </aside>
  );
}

function SideMenuLinkButton({
  href,
  selected,
  Icon,
  title,
}: {
  href: string;
  selected: boolean;
  Icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "group block ",
        selected
          ? "bg-altSecondary"
          : "focus:animate-pulse focus:bg-altSecondary",
      )}
    >
      <div className="h-full w-full  p-7">
        <div className="flex w-full flex-col items-center justify-center">
          {Icon}
          <Text className="text-xl font-bold">{title}</Text>
        </div>
      </div>
    </Link>
  );
}
