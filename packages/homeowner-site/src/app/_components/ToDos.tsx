"use client";

import Link from "next/link";
import { type ToDos } from "../../../../core/homeowner/item";
import { Text } from "../../../../ui/Atoms/Text";
import React, { DragEventHandler } from "react";

export type UpdateItemPriorityServerAction = ({
  priority,
  id,
}: {
  id: string;
  priority: number;
}) => Promise<void>;

export default function ToDos({
  toDos,
  updateItem,
}: {
  toDos: ToDos;
  updateItem: UpdateItemPriorityServerAction;
}) {
  const [pending, startTransition] = React.useTransition();

  const [optimisticToDos, setOptimisticValue] = React.useOptimistic(
    toDos,
    (state, newToDos: ToDos) => {
      console.log("newToDos in optimiistic", newToDos);
      return newToDos;
    },
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    toDoId: string,
  ) => {
    //e.dataTransfer.setData("text/plain", toDoId);
    e.dataTransfer.setData("todo", toDoId || "-1");
    console.log("dataTransfer", e.dataTransfer.getData("todo"));
  };

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    highlightIndicator(e.clientY);
    console.log("dataTransfer", e.dataTransfer.getData("todo"));
  };

  const handleDragEnd: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    clearHighlights();
    const toDoId = e.dataTransfer.getData("todo");
    console.log("drag end", e.dataTransfer.getData("todo"));

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e.clientY, indicators);

    console.log("element", element?.getAttribute("data-before"));
    console.log("toDoId", toDoId);

    const droppedOnId = element?.getAttribute("data-id") || "-1";

    const droppedOnPriority = element?.getAttribute("data-priority") || "-1";

    if (droppedOnId !== toDoId) {
      console.log("reorder", toDoId, droppedOnPriority);
      // get update priority to droppeOnPriority +1
      let newToDos = [...toDos];
      //   for (let index = 0; index < toDos.length; index++) {
      //     if (toDos[index]?.id === toDoId) {
      //         // this is the item we are moving
      //         newToDos.push(toDos[index+1]);
      //     }
      //     else if (toDos[index]?.id === droppedOnId) {
      //         // this is where we are moving the item
      //         newToDos.push(toDos.find(toDo => toDo.id === toDoId));
      //     } else {
      //         newToDos.push(toDos[index]);
      //     }
      //       const toDo = toDos[i];
      //       toDos.splice(i, 1);
      //       toDos.splice(parseInt(droppedOnPriority), 0, toDo);
      //       break;
      //     }

      const originalPriority =
        newToDos.find((toDo) => toDo.id === toDoId)!.toDoPriority || -1;
      if (parseInt(droppedOnPriority) > originalPriority) {
        newToDos.find((toDo) => toDo.id === toDoId)!.toDoPriority =
          parseInt(droppedOnPriority) + 1;
      } else {
        newToDos.find((toDo) => toDo.id === toDoId)!.toDoPriority =
          parseInt(droppedOnPriority) - 1;
      }
      newToDos.sort((a, b) => (b.toDoPriority || -1) - (a.toDoPriority || -1));
      console.log("newToDos", newToDos);
      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: toDoId,
          priority: parseInt(droppedOnPriority) + 1,
        });
      });
    }
  };

  const highlightIndicator = (clientY: number) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(clientY, indicators);
    // @ts-ignore
    el.element.style.opacity = "1";
  };
  const getIndicators = () => {
    return Array.from(document.querySelectorAll("[data-id]"));
  };
  const getNearestIndicator = (clientY: number, indicators: Element[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );
    return el;
  };

  const clearHighlights = (els?: Element[]) => {
    const indicators = els || getIndicators();
    indicators.forEach((el) => {
      // @ts-ignore
      el.style.opacity = "0";
    });
  };

  return (
    <div className="p-4">
      {optimisticToDos.map((toDo) => (
        <ToDo
          key={toDo.id}
          toDo={toDo}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
        />
      ))}
      <DropIndicator toDoId="-2" toDoPriority="-4" />
    </div>
  );
}

function ToDo({
  toDo,
  handleDragOver,
  handleDragEnd,
  handleDragStart,
}: {
  toDo: ToDos[0];
  handleDragOver: DragEventHandler<HTMLDivElement>;
  handleDragEnd: DragEventHandler<HTMLDivElement>;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, toDoId: string) => void;
}) {
  return (
    <>
      <DropIndicator
        toDoId={toDo.id}
        toDoPriority={toDo.toDoPriority?.toString() || null}
      />
      <div
        draggable={true}
        onDragStart={(e) => handleDragStart(e, toDo.id)}
        onDragOver={handleDragOver}
        onDrop={handleDragEnd}
        className="cursor-grab rounded-lg border-2 border-altSecondary bg-brand/50 p-2 active:cursor-grabbing"
      >
        <div className="flex justify-between">
          <Text>{toDo.title}</Text>
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
    </>
  );
}

function DropIndicator({
  toDoId,
  toDoPriority,
}: {
  toDoId: string;
  toDoPriority: string | null;
}) {
  return (
    <div
      data-id={toDoId}
      data-priority={toDoPriority || "-1"}
      className="my-0.5 h-2 w-full bg-brand opacity-0"
    />
  );
}
