import { ToDos } from "../../../../core/homeowner/item";

export default function Recurring({
  recurringTasks,
}: {
  recurringTasks: ToDos;
}) {
  return (
    <div>
      <h1>Recurring</h1>
      <table>
        <tr>
          <th>Recurring</th>
          <th>Task</th>
          <th>Every</th>
          <th>Last</th>
          <th>Next</th>
        </tr>
        {recurringTasks.map((task) => (
          <tr>
            <td>
              <input type="checkbox" checked={task.recurring ?? false} />
            </td>
            <td>{task.title}</td>
            <td>{task.recurringSchedule}</td>
            <td>{task.pastDates[0]?.date}</td>
            <td>{task.date}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
