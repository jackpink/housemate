"use client";

import Link from "next/link";
import { type ToDos } from "../../../../core/homeowner/item";
import { Text } from "../../../../ui/Atoms/Text";
import React, { DragEventHandler, useCallback } from "react";
import clsx from "clsx";
import {
  CompletedIcon,
  DownArrowIcon,
  ToDoIcon,
  UpArrowIcon,
  ViewIcon,
} from "../../../../ui/Atoms/Icons";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "../../../../ui/Atoms/Dialog";
import { ItemStatus } from "../../../../core/db/schema";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { EditableComponentLabel } from "../../../../ui/Molecules/InPlaceEditableComponent";
import { ItemForMobile } from "./PastItems";
import { CompletedStatusLabel, ToDoStatusLabel } from "./EditItem";

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
        <ToDoFilter
          filter={filter}
          setFilter={setfilter}
          filteredToDos={filteredToDos}
        />
        <MobileToDos toDos={filteredToDos} updateItem={updateItem} />
        <Line />
        <CompletedToDos toDos={completedToDos} updateItem={updateItem} />
      </div>
    );
  }
  return (
    <div>
      <ToDoFilter
        filter={filter}
        setFilter={setfilter}
        filteredToDos={filteredToDos}
      />
      <DraggableToDos toDos={filteredToDos} updateItem={updateItem} />
    </div>
  );
}

/*
############################################################################
DESKTOP TODOS
############################################################################
*/

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

/*
############################################################################
MOBILE TODOS
############################################################################
*/

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
    <div className="flex flex-col gap-5 p-4">
      {optimisticToDos.map((toDo) => (
        <MobileTodoNew
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

function MobileTodoNew({
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
  return (
    <div className={clsx("")}>
      <button
        onClick={() => moveUp(toDo)}
        className={clsx(
          " flex w-full flex-col items-center overflow-hidden rounded-t-full p-1 px-5 py-1 ",
          toDo.category === "job" ? "bg-todo active:bg-todo/30" : "bg-issue",
        )}
      >
        <UpArrowIcon width={30} height={30} />
      </button>
      <ItemForMobile item={toDo} rounded={false}>
        <button
          onClick={() => markAsCompleted(toDo)}
          className="flex h-full w-20 flex-col items-center rounded-sm bg-completed p-2 active:bg-green-400"
        >
          <CompletedIcon width={30} height={30} />
          <p className="text-xs">Mark as Completed</p>
        </button>
      </ItemForMobile>
      <button
        onClick={() => moveDown(toDo)}
        className={clsx(
          "flex w-full flex-col items-center rounded-b-full bg-altSecondary p-1",
          toDo.category === "job" ? "bg-todo active:bg-todo/30" : "bg-issue",
        )}
      >
        <DownArrowIcon width={30} height={30} />
      </button>
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
        isOverdue ? "bg-red-300" : " bg-todo/70",
      )}
    >
      <div className="flex h-full flex-col items-center gap-2 rounded-sm">
        <button
          onClick={() => moveUp(toDo)}
          className={clsx(
            "flex w-full flex-col items-center rounded-md  p-1 px-5 py-1 ",
            isOverdue
              ? "bg-red-400 active:bg-red-600"
              : "bg-todo active:bg-todo/30",
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
              : "bg-todo active:bg-todo/30",
          )}
        >
          <DownArrowIcon width={30} height={30} />
        </button>
      </div>
      <div className="flex grow items-center justify-center">
        <Text className="text-xl font-semibold">{toDo.title}</Text>
      </div>

      <div className="grow-0">
        <ItemQuickViewDialog
          toDo={toDo}
          colour={toDo.category === "job" ? "todo" : "issue"}
        />
      </div>
      <div className="grow-0">
        <button
          onClick={() => markAsCompleted(toDo)}
          className="h-full w-20 rounded-sm bg-completed p-2 active:bg-green-400"
        >
          <div>✔</div>
          <div className="text-xs">Mark as Completed</div>
        </button>
      </div>
    </div>
  );
}

export function ItemQuickViewDialog({
  toDo,
  colour,
}: {
  toDo: ToDos[0];
  colour: "todo" | "completed" | "issue" | "product";
}) {
  const date = new Date(toDo.date).toDateString();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={clsx(
            "h-full w-20 rounded-sm py-3",
            colour === "todo"
              ? "bg-todo active:bg-todo/30"
              : colour === "completed"
                ? "bg-completed active:bg-completed/30"
                : colour === "issue"
                  ? "bg-issue active:bg-issue/30"
                  : colour === "product"
                    ? "bg-product active:bg-product/30"
                    : "bg-todo active:bg-todo/30",
          )}
        >
          <div className="flex justify-center pb-1">
            <ViewIcon />
          </div>
          <div className="text-center text-xs">
            Quick View
            <br />
            {toDo.category === "job"
              ? "Job"
              : toDo.category === "product"
                ? "Product"
                : "Issue"}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="Dialog">
        <DialogClose className="float-end rounded-lg border-2 border-black p-2">
          <p>Close</p>
        </DialogClose>
        <DialogHeading className="pt-3 text-xl">Quick View</DialogHeading>
        <DialogDescription className="flex w-full flex-col items-center pt-4">
          <Link href={`/properties/${toDo.propertyId}/items/${toDo.id}`}>
            <CTAButton rounded>Go To Item's Edit Page</CTAButton>
          </Link>
          <Text className="w-full pt-6 text-start text-xl font-medium">
            {toDo.title}
          </Text>
          <Line />
          <EditableComponentLabel label="Date" />
          <Text>{date}</Text>
          <Line />
          {toDo.description && (
            <>
              <EditableComponentLabel label="Description" />
              <Text>{toDo.description}</Text>
            </>
          )}
          {toDo.status === "todo" ? (
            <>
              <ToDoStatusLabel />
              <Line />
            </>
          ) : (
            <>
              <CompletedStatusLabel />
              <Line />
            </>
          )}
          <EditableComponentLabel label="Category" />
          <Text className="capitalize">{toDo.category}</Text>
          <Line />
          <EditableComponentLabel label="Recurring/One Off" />
          <Text>{toDo.recurring ? "Recurring" : "One-Off"}</Text>
          <Line />
          <div className="h-44"></div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

/*
############################################################################
FILTER TODOS
############################################################################
*/

function ToDoFilter({
  filter,
  setFilter,
  filteredToDos,
}: {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  filteredToDos: ToDos;
}) {
  return (
    <div className="p-1">
      <p className="p-3 pl-2 text-center text-xl font-semibold">Filter Items</p>
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
      <FilterMessage filter={filter} filteredToDos={filteredToDos} />
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

function FilterMessage({
  filter,
  filteredToDos,
}: {
  filter: Filter;
  filteredToDos: ToDos;
}) {
  if (filteredToDos.length === 0) {
    return (
      <p className="p-3 text-center text-xl font-semibold">
        {filter === "all" && <p>There are no incomplete tasks</p>}
        {filter === "overdue" && <p>There are no overdue tasks</p>}
        {filter === "day" && <p>There are no incomplete tasks today</p>}
        {filter === "week" && <p>There are no incomplete tasks this week</p>}
        {filter === "month" && <p>There are no incomplete tasks this month</p>}
      </p>
    );
  }
  return (
    <div className="p-3 pt-5 text-lg font-medium">
      {filter === "all" && <p>Showing all tasks</p>}
      {filter === "overdue" && <p>Showing overdue tasks</p>}
      {filter === "day" && <p>Showing tasks due Today</p>}
      {filter === "week" && <p>Showing tasks due This Week</p>}
      {filter === "month" && <p>Showing tasks due This Month</p>}
    </div>
  );
}

/*
############################################################################
COMPLETED TODOS
############################################################################
*/

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
      <CompletedTodoMessage completedToDos={toDos} />
      {optimisticToDos.map((toDo) => (
        <CompletedToDo2 key={toDo.id} toDo={toDo} markAsToDo={markAsToDo} />
      ))}
    </div>
  );
}
function CompletedToDo2({
  toDo,
  markAsToDo,
}: {
  toDo: ToDos[0];
  markAsToDo: (toDo: ToDos[0]) => void;
}) {
  return (
    <ItemForMobile item={toDo} rounded={true}>
      <button
        onClick={() => markAsToDo(toDo)}
        className="h-20 w-20 rounded-sm bg-todo p-2 hover:bg-green-400"
      >
        {/* <div className="flex justify-center">
            <div className="h-5 w-5 border-2 border-dark"></div>
          </div> */}
        <div className="flex flex-col items-center text-xs">
          <ToDoIcon width={30} height={30} />
          Mark as
          <br />
          To Do
        </div>
      </button>
    </ItemForMobile>
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
    <div className="flex rounded-lg border-2 border-altSecondary bg-completed p-2">
      <div className="flex grow items-center justify-center">
        <Text className="text-xl font-semibold">{toDo.title}</Text>
      </div>
      <div className="grow-0">
        <button
          onClick={() => markAsToDo(toDo)}
          className="h-20 w-20 rounded-sm border-2 border-dark bg-todo p-2 hover:bg-green-400"
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

function CompletedTodoMessage({ completedToDos }: { completedToDos: ToDos }) {
  if (completedToDos.length === 0) {
    return (
      <p className="p-3 text-center text-xl font-semibold">
        No tasks have been completed this week
      </p>
    );
  }
  return (
    <div className="p-3 pt-5 text-lg font-medium">
      <p>Showing tasks completed this week</p>
    </div>
  );
}

function Line() {
  return <div className="w-full border-2 border-altSecondary"></div>;
}
