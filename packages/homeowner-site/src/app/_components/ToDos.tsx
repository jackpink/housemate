import Link from "next/link";
import { type ToDos } from "../../../../core/homeowner/item";
import { Text } from "../../../../ui/Atoms/Text";

export default function ToDos({ toDos }: { toDos: ToDos }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {toDos.map((toDo) => (
        <ToDo key={toDo.id} toDo={toDo} />
      ))}
    </div>
  );
}

function ToDo({ toDo }: { toDo: ToDos[0] }) {
  return (
    <div className="rounded-lg border-2 border-altSecondary bg-brand/50 p-2">
      <div className="flex justify-between">
        <Text>{toDo.title}</Text>

        {/* <Text>{toDo.category === "job" && "Job"}</Text> */}
        <Text>{toDo.date}</Text>
      </div>
      <div className="flex justify-between">
        <Link href={`/properties/${toDo.propertyId}/items/${toDo.id}`}>
          <button className="rounded-full bg-altSecondary p-2 hover:bg-altSecondary/70">
            Go To{" "}
            {toDo.category === "job"
              ? "Job"
              : toDo.category === "product"
                ? "Product"
                : "Issue"}
          </button>
        </Link>
        <button className="rounded-full bg-green-300 p-2 hover:bg-green-400">
          Mark as Completed
        </button>
      </div>
    </div>
  );
}
