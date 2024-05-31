import { concatAddress } from "~/utils/functions";
import { type Alerts } from "../../../../core/homeowner/alert";
import { Property } from "../../../../core/homeowner/property";

export function Alerts({ alerts }: { alerts: Alerts }) {
  if (!alerts.length) return <div>No alerts to display</div>;
  return (
    <div>
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
  return (
    <div>
      <h1>{alert.title}</h1>
      <p>{alert.description}</p>
      <p>{address}</p>
    </div>
  );
}
