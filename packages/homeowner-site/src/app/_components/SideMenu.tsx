import Link from "next/link";
import {
  LargeAddIcon,
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
  selected: "todo" | "schedule" | "recurring" | "past" | "add";
}) {
  return (
    <aside className="hidden max-w-min xs:block">
      <Link
        href={`/properties/${propertyId}/todo`}
        className={clsx("block", selected === "todo" && "bg-altSecondary")}
      >
        <div className="h-full w-full  p-7">
          <div className="flex w-full flex-col items-center justify-center">
            <ToDoListIcon width={45} height={45} />
            <Text className="text-xl font-bold">To Do List</Text>
          </div>
        </div>
      </Link>
      <Link
        href={`/properties/${propertyId}/schedule`}
        className={clsx("block", selected === "schedule" && "bg-altSecondary")}
      >
        <div className="h-full w-full p-7">
          <div className="flex w-full flex-col items-center justify-center">
            <ScheduleIcon width={45} height={45} />
            <Text className="text-xl font-bold">Schedule</Text>
          </div>
        </div>
      </Link>

      <Link
        href={`/properties/${propertyId}/recurring`}
        className={clsx("block", selected === "recurring" && "bg-altSecondary")}
      >
        <div className="h-full w-full p-7">
          <div className="flex w-full flex-col items-center justify-center">
            <RecurringIcon width={45} height={45} />
            <Text className="text-xl font-bold">Recurring</Text>
          </div>
        </div>
      </Link>

      <Link
        href={`/properties/${propertyId}/past`}
        className={clsx("block", selected === "past" && "bg-altSecondary")}
      >
        <div className="h-full w-full  p-7">
          <div className="flex w-full flex-col items-center justify-center">
            <PastIcon width={45} height={45} />
            <Text className="text-xl font-bold">Past Items</Text>
          </div>
        </div>
      </Link>
      <Link
        href={`/properties/${propertyId}/add`}
        className={clsx("block", selected === "add" && "bg-altSecondary")}
      >
        <div className="h-full w-full  p-7">
          <div className="flex w-full flex-col items-center justify-center">
            <LargeAddIcon width={45} height={45} />
            <Text className="text-xl font-bold">Add Item</Text>
          </div>
        </div>
      </Link>
    </aside>
  );
}
