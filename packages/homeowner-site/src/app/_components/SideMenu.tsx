import Link from "next/link";
import {
  LargeAddIcon,
  PastIcon,
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
  selected: "todo" | "schedule" | "past" | "add";
}) {
  return (
    <aside className="xs:block hidden max-w-min">
      <Link
        href={`/properties/${propertyId}/items/todo`}
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
        href={`/properties/${propertyId}/items/schedule`}
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
        href={`/properties/${propertyId}/items/past`}
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
        href={`/properties/${propertyId}/items/add`}
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
