import Link from "next/link";
import { ToDos } from "../../../../core/homeowner/item";
import { EditIconSmall } from "../../../../ui/Atoms/Icons";

export default function Recurring({
  recurringTasks,
  propertyId,
}: {
  recurringTasks: ToDos;
  propertyId: string;
}) {
  return (
    <div>
      <table>
        <tr>
          <th>Task</th>
          <th>Every</th>
          <th>Last</th>
          <th>Next</th>
        </tr>
        {recurringTasks.map((task) => (
          <tr>
            <td className="p-2 capitalize">{task.title}</td>
            <td className="p-2 capitalize">{task.recurringSchedule}</td>
            <td className="p-2 capitalize">{task.pastDates[0]?.date}</td>
            <td className="p-2 capitalize">{task.date}</td>
            <td>
              <Link
                href={`/properties/${propertyId}/recurring/${task.id}`}
                className="flex items-center rounded-md border-2 border-black p-1"
              >
                <EditIconSmall width={15} height={15} /> Edit
              </Link>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
