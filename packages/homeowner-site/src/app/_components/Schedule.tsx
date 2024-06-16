"use client";

import { type ScheduledItems } from "../../../../core/homeowner/item";
import { ItemForMobile } from "./PastItems";

export default function Schedule({
  scheduledItems,
  deviceType,
}: {
  scheduledItems: ScheduledItems;
  deviceType: string;
}) {
  console.log("Scheduled Items", scheduledItems);
  if (deviceType === "mobile") {
    return <MobileSchedule scheduledItems={scheduledItems} />;
  }
  return <div>Schedule</div>;
}

function MobileSchedule({
  scheduledItems,
}: {
  scheduledItems: ScheduledItems;
}) {
  return (
    <div className="grid gap-4 p-2">
      {scheduledItems.map((item) => (
        <ItemForMobile key={item.id} item={item} />
      ))}
    </div>
  );
}
