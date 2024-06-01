import { concatAddress } from "~/utils/functions";
import { type Alerts } from "../../../../core/homeowner/alert";
import { Property } from "../../../../core/homeowner/property";
import { Item } from "../../../../core/homeowner/item";
import clsx from "clsx";
import Link from "next/link";

export function Alerts({ alerts }: { alerts: Alerts }) {
  if (!alerts.length) return <div>No alerts to display</div>;
  return (
    <div className="grid gap-8 p-4">
      {alerts.map((alert) => (
        <Alert alert={alert} />
      ))}
    </div>
  );
}

export async function Alert({ alert }: { alert: Alerts[number] }) {
  const property = await Property.get(alert.propertyId);
  if (!property) return <div>Property not found</div>;
  const address = concatAddress(property);

  const todaysDate = new Date().getTime();
  const alertDate = new Date(alert.date).getTime();

  const daysSinceAlertNumber = Math.floor(
    (todaysDate - alertDate) / (1000 * 60 * 60 * 24),
  );
  let daysSinceAlertString = "today";
  if (daysSinceAlertNumber === 1) daysSinceAlertString = "yesterday";
  if (daysSinceAlertNumber > 1 && daysSinceAlertNumber < 7)
    daysSinceAlertString = `${daysSinceAlertNumber} days ago`;
  if (daysSinceAlertNumber >= 7 && daysSinceAlertNumber < 14)
    daysSinceAlertString = `a week ago`;
  if (daysSinceAlertNumber >= 14)
    daysSinceAlertString = `${Math.floor(daysSinceAlertNumber / 7)} weeks ago`;

  if (alert.itemId)
    return (
      <ItemAlert
        alert={alert}
        address={address}
        daysSinceAlert={daysSinceAlertString}
      />
    );

  return (
    <div className="flex">
      <div className="grow">
        <h1>{alert.title}</h1>
        <p>{address}</p>

        <p>{alert.description}</p>
      </div>
      <div className="w-20"></div>
    </div>
  );
}

export async function ItemAlert({
  alert,
  address,
  daysSinceAlert,
}: {
  alert: Alerts[number];
  address: string;
  daysSinceAlert: string;
}) {
  const item = await Item.get(alert.itemId!);
  if (!item) return <div>Item not found</div>;

  return (
    <div className="flex">
      <div className="grow">
        <h1 className="pb-2 text-lg font-semibold">{alert.title}</h1>
        <p className="pb-1 text-sm">{address}</p>
        <Link href={`/properties/${alert.propertyId}/items/${alert.itemId}`}>
          <button className="rounded-full bg-brand p-3 font-medium capitalize">{`${item.category} - ${item.title}`}</button>
        </Link>
        <p>{alert.description}</p>
      </div>
      <div className="flex w-20 flex-col items-center justify-center">
        <div
          className={clsx(
            "h-7 w-7 rounded-full",
            !alert.viewed && "bg-brandSecondary",
          )}
        ></div>
        <p className="capitalize text-brandSecondary">{daysSinceAlert}</p>
      </div>
    </div>
  );
}
