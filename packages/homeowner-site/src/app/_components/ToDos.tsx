"use client";

import Link from "next/link";
import { type ToDos } from "../../../../core/homeowner/item";
import { Text } from "../../../../ui/Atoms/Text";
import React, { DragEventHandler, useCallback } from "react";
import clsx from "clsx";
import {
  DownArrowIcon,
  UpArrowIcon,
  ViewIcon,
} from "../../../../ui/Atoms/Icons";
import { ItemStatus } from "../../../../core/db/schema";
import { time } from "drizzle-orm/pg-core";

type Filter = "overdue" | "day" | "week" | "month" | "all";

export type UpdateItemPriorityServerAction = ({
  priority,
  id,
}: {
  id: string;
  priority: number;
  status?: ItemStatus;
}) => Promise<void>;

export default function ToDos({
  toDos,
  completedToDos,
  updateItem,
  deviceType,
}: {
  toDos: ToDos;
  completedToDos: ToDos;
  updateItem: UpdateItemPriorityServerAction;
  deviceType: "mobile" | "desktop";
}) {
  const [filter, setfilter] = React.useState<Filter>("all");

  // filter todos based on interval
  // if interval is day, show only todos that are due today
  // if interval is week, show only todos that are due this week
  // if interval is month, show only todos that are due this month
  // if interval is all, show all todos
  const filteredToDos = toDos.filter((toDo) => {
    const todaysDate = new Date();
    const toDoDate = new Date(toDo.date);
    const timeDiff = toDoDate.getTime() - todaysDate.getTime();
    console.log(toDo.title);
    console.log("timeDiff", timeDiff);
    const diffDays = Math.abs(timeDiff) / (1000 * 3600 * 24);
    console.log("diffDays", diffDays);
    if (filter === "day") {
      return diffDays < 1;
    } else if (filter === "week") {
      return diffDays <= 7 && timeDiff > 0;
    } else if (filter === "month") {
      return diffDays <= 30 && timeDiff > 0;
    } else if (filter === "overdue") {
      return timeDiff < 0;
    } else {
      return true;
    }
  });
  console.log("filteredToDos", filteredToDos);
  if (deviceType === "mobile") {
    return (
      <div>
        <ToDoFilter filter={filter} setFilter={setfilter} />
        <MobileToDos toDos={filteredToDos} updateItem={updateItem} />
        <CompletedToDos toDos={completedToDos} updateItem={updateItem} />
      </div>
    );
  }
  return (
    <div>
      <ToDoFilter filter={filter} setFilter={setfilter} />
      <DraggableToDos toDos={filteredToDos} updateItem={updateItem} />
    </div>
  );
}

function DraggableToDos({
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

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    console.log("touch move", e);
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

    const droppedOnPriority = parseInt(
      element?.getAttribute("data-priority") || "-1",
    );

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

      const movingDown = originalPriority > droppedOnPriority;
      let newPriority: number;
      if (movingDown) {
        newPriority = droppedOnPriority + 1;
      } else {
        newPriority = droppedOnPriority + 1;
      }
      console.log(
        "newPriority",
        newPriority,
        droppedOnPriority,
        originalPriority,
      );
      newToDos.find((toDo) => toDo.id === toDoId)!.toDoPriority = newPriority;
      newToDos.sort((a, b) => (b.toDoPriority || -1) - (a.toDoPriority || -1));
      console.log("newToDos", newToDos);
      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: toDoId,
          priority: newPriority,
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
        <DraggableToDo
          key={toDo.id}
          toDo={toDo}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          handleDragStart={handleDragStart}
          handleTouchMove={handleTouchMove}
        />
      ))}
      <DropIndicator toDoId="-2" toDoPriority="-4" />
    </div>
  );
}

function DraggableToDo({
  toDo,
  handleDragOver,
  handleDragEnd,
  handleTouchMove,
  handleDragStart,
}: {
  toDo: ToDos[0];
  handleDragOver: DragEventHandler<HTMLDivElement>;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
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
        onTouchMove={handleTouchMove}
        className="flex cursor-grab rounded-lg border-2 border-altSecondary bg-brand/50 p-2 active:cursor-grabbing"
      >
        <div className="grow justify-between">
          <Text>{toDo.title}</Text>
        </div>

        <div className="grow-0">
          <button className="w-20 rounded-sm bg-green-300 p-2 hover:bg-green-400">
            <div>✔</div>
            <div className="text-xs">Mark as Completed</div>
          </button>
        </div>
        <div className="grow-0">
          <Link href={`/properties/${toDo.propertyId}/items/${toDo.id}`}>
            <button className="h-full rounded-sm bg-altSecondary p-2 hover:bg-altSecondary/70">
              <div className="flex justify-center">
                <ViewIcon />
              </div>
              <div className="text-xs">
                View{" "}
                {toDo.category === "job"
                  ? "Job"
                  : toDo.category === "product"
                    ? "Product"
                    : "Issue"}
              </div>
            </button>
          </Link>
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

function MobileToDos({
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

  const moveUp = useCallback(
    (clickedToDo: ToDos[0]) => {
      let newToDos = [...toDos];

      const newPriority = clickedToDo.toDoPriority! + 3;

      newToDos.find((toDo) => toDo.id === clickedToDo.id)!.toDoPriority =
        newPriority;
      newToDos.sort((a, b) => (b.toDoPriority || -1) - (a.toDoPriority || -1));

      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: clickedToDo.id,
          priority: newPriority,
        });
      });
    },
    [toDos],
  );

  const moveDown = useCallback(
    (clickedToDo: ToDos[0]) => {
      let newToDos = [...toDos];

      const newPriority = clickedToDo.toDoPriority! - 3;

      newToDos.find((toDo) => toDo.id === clickedToDo.id)!.toDoPriority =
        newPriority;
      newToDos.sort((a, b) => (b.toDoPriority || -1) - (a.toDoPriority || -1));

      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: clickedToDo.id,
          priority: newPriority,
        });
      });
    },
    [toDos],
  );

  const markAsCompleted = useCallback(
    (clickedToDo: ToDos[0]) => {
      console.log("mark as completed", clickedToDo);
      let newToDos = [...toDos];
      newToDos = newToDos.filter((toDo) => toDo.id !== clickedToDo.id);
      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: clickedToDo.id,
          status: "completed" as ItemStatus,
          priority: clickedToDo.toDoPriority!,
        });
      });
    },
    [toDos],
  );

  console.log("mobile");

  return (
    <div className="flex flex-col gap-3 p-4">
      {optimisticToDos.map((toDo) => (
        <MobileTodo
          toDo={toDo}
          key={toDo.id}
          moveUp={moveUp}
          moveDown={moveDown}
          markAsCompleted={markAsCompleted}
        />
      ))}
    </div>
  );
}

function MobileTodo({
  toDo,
  moveUp,
  moveDown,
  markAsCompleted,
}: {
  toDo: ToDos[0];
  moveUp: (toDo: ToDos[0]) => void;
  moveDown: (toDo: ToDos[0]) => void;
  markAsCompleted: (toDo: ToDos[0]) => void;
}) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const toDoDate = new Date(toDo.date);
  console.log("toDoDate", toDoDate);
  console.log("startOfToday", startOfToday);
  const isOverdue = new Date(toDo.date) <= startOfToday;
  return (
    <div
      className={clsx(
        "flex rounded-lg border-2 border-dark p-2",
        isOverdue ? "bg-red-300" : " bg-brand/50",
      )}
    >
      <div className="flex h-full flex-col items-center gap-2 rounded-sm">
        <button
          onClick={() => moveUp(toDo)}
          className={clsx(
            "flex w-full flex-col items-center rounded-md  p-1 px-5 py-1 ",
            isOverdue
              ? "bg-red-400 active:bg-red-600"
              : "bg-altSecondary active:bg-altSecondary/30",
          )}
        >
          <UpArrowIcon width={30} height={30} />
        </button>

        <button
          onClick={() => moveDown(toDo)}
          className={clsx(
            "flex w-full flex-col items-center rounded-md bg-altSecondary p-1",
            isOverdue
              ? "bg-red-400 active:bg-red-600"
              : "bg-altSecondary active:bg-altSecondary/30",
          )}
        >
          <DownArrowIcon width={30} height={30} />
        </button>
      </div>
      <div className="flex grow items-center justify-center">
        <Text className="text-xl font-semibold">{toDo.title}</Text>
      </div>
      <div className="grow-0">
        <button
          onClick={() => markAsCompleted(toDo)}
          className="h-full w-20 rounded-sm bg-green-300 p-2 active:bg-green-400"
        >
          <div>✔</div>
          <div className="text-xs">Mark as Completed</div>
        </button>
      </div>
      <div className="grow-0">
        <Link href={`/properties/${toDo.propertyId}/items/${toDo.id}`}>
          <button className="h-full rounded-sm bg-altSecondary p-2 active:bg-altSecondary/70">
            <div className="flex justify-center">
              <ViewIcon />
            </div>
            <div className="text-xs">
              View
              <br />
              {toDo.category === "job"
                ? "Job"
                : toDo.category === "product"
                  ? "Product"
                  : "Issue"}
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
}

function ToDoFilter({
  filter,
  setFilter,
}: {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}) {
  return (
    <div className="p-1">
      <p className="pl-2 text-left text-lg font-medium">Filter Items</p>
      <div className="flex w-full justify-around p-1">
        <Selector onClick={() => setFilter("all")} selected={filter === "all"}>
          All
        </Selector>
        <Selector
          onClick={() => setFilter("overdue")}
          selected={filter === "overdue"}
        >
          Overdue
        </Selector>
        <Selector onClick={() => setFilter("day")} selected={filter === "day"}>
          Today
        </Selector>
        <Selector
          onClick={() => setFilter("week")}
          selected={filter === "week"}
        >
          This
          <br />
          Week
        </Selector>
        <Selector
          onClick={() => setFilter("month")}
          selected={filter === "month"}
        >
          This
          <br />
          Month
        </Selector>
      </div>
    </div>
  );
}

function Selector({
  selected = false,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={clsx(
        " rounded-lg border-2 border-dark p-2",
        selected && "bg-brand",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function CompletedToDos({
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

  const markAsToDo = useCallback(
    (clickedToDo: ToDos[0]) => {
      console.log("mark as completed", clickedToDo);
      let newToDos = [...toDos];
      newToDos = newToDos.filter((toDo) => toDo.id !== clickedToDo.id);
      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: clickedToDo.id,
          status: "todo" as ItemStatus,
          priority: clickedToDo.toDoPriority!,
        });
      });
    },
    [toDos],
  );

  return (
    <div className="flex flex-col gap-3 p-4">
      <p className="text-lg font-medium">Completed To Dos</p>
      {optimisticToDos.map((toDo) => (
        <CompletedToDo key={toDo.id} toDo={toDo} markAsToDo={markAsToDo} />
      ))}
    </div>
  );
}

function CompletedToDo({
  toDo,
  markAsToDo,
}: {
  toDo: ToDos[0];
  markAsToDo: (toDo: ToDos[0]) => void;
}) {
  return (
    <div className="flex rounded-lg border-2 border-altSecondary bg-green-300 p-2">
      <div className="flex grow items-center justify-center">
        <Text className="text-xl font-semibold">{toDo.title}</Text>
      </div>
      <div className="grow-0">
        <button
          onClick={() => markAsToDo(toDo)}
          className="h-20 w-20 rounded-sm border-2 border-dark bg-brand p-2 hover:bg-green-400"
        >
          {/* <div className="flex justify-center">
            <div className="h-5 w-5 border-2 border-dark"></div>
          </div> */}
          <div className="text-xs">
            <div className="text-xl">⇧</div>
            Mark as
            <br />
            To Do
          </div>
        </button>
      </div>
    </div>
  );
}
