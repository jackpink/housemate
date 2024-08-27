"use client";

import Link, { LinkProps } from "next/link";
import { type ToDos } from "../../../../core/homeowner/item";
import { Text } from "../../../../ui/Atoms/Text";
import React, { Children, DragEventHandler, useCallback } from "react";
import clsx from "clsx";
import {
  CompletedIcon,
  DownArrowIcon,
  MoveIcon,
  OptionsLargeIcon,
  TickIcon,
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
import { Item } from "./PastItems";
import { CompletedStatusLabel, ToDoStatusLabel } from "./EditItem";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
  usePopoverContext,
} from "../../../../ui/Atoms/Popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { sleep } from "~/utils/functions";

type Filter = "overdue" | "day" | "week" | "month" | "all";

export type UpdateItemPriorityServerAction = ({
  priority,
  id,
}: {
  id: string;
  priority?: number;
  status?: ItemStatus;
}) => Promise<void>;

export default function ToDos({
  toDos,
  completedToDos,
  updateItem,
}: {
  toDos: ToDos;
  completedToDos: ToDos;
  updateItem: UpdateItemPriorityServerAction;
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
    const diffDays = Math.abs(timeDiff) / (1000 * 3600 * 24);
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

  return (
    <div className="min-w-96 max-w-lg">
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
      let newToDos = [...toDos];
      newToDos = newToDos.filter((toDo) => toDo.id !== clickedToDo.id);

      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: clickedToDo.id,
          status: "completed" as ItemStatus,
        });
      });
    },
    [toDos],
  );

  return (
    <AnimatePresence>
      <Reorder.Group
        className="flex flex-col gap-5 p-4"
        values={optimisticToDos}
        onReorder={() => {
          console.log("reorder");
        }}
        axis="y"
        transition={{ duration: 1 }}
      >
        {optimisticToDos.map((toDo, index) => {
          return (
            <Reorder.Item value={toDo} key={toDo.id} dragListener={false}>
              <MotionComponent>
                <MobileTodo
                  toDo={toDo}
                  moveUp={moveUp}
                  moveDown={moveDown}
                  markAsCompleted={markAsCompleted}
                />
              </MotionComponent>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </AnimatePresence>
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
  const [isMoving, setIsMoving] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);

  const selectedToDoId = usePathname().split("todo/")[1];

  if (isSelected === false && selectedToDoId === toDo.id) {
    setIsSelected(true);
  }

  return (
    <div className="">
      <button
        onClick={() => moveUp(toDo)}
        className={clsx(
          " flex w-full animate-pulse flex-col items-center overflow-hidden rounded-t-full p-1 px-5 py-1 transition-all duration-1000 ease-in-out ",
          toDo.category === "job" ? "bg-todo active:bg-todo/30" : "bg-issue",
          !isMoving ? "collapse h-0" : "visible h-10",
        )}
      >
        <UpArrowIcon width={30} height={30} />
      </button>
      <Item
        item={toDo}
        rounded={isMoving ? false : true}
        colour={isSelected ? "selected" : isComplete ? "completed" : undefined}
        collapsed={isComplete ? true : false}
      >
        {isMoving ? (
          <button
            className={clsx(
              " flex w-20 flex-col items-center justify-center px-1",
              toDo.category === "job" ? "bg-todo" : "bg-issue",
            )}
            onClick={() => setIsMoving(false)}
          >
            <TickIcon />
            Save
          </button>
        ) : (
          <ToDoOptionsPopover
            itemId={toDo.id}
            setIsMovingActive={() => {
              setIsMoving(true);
            }}
            isTask={toDo.category === "job"}
            markAsCompleted={() => {
              markAsCompleted(toDo);
            }}
            setIsComplete={setIsComplete}
            setIsSelected={setIsSelected}
            isSelected={isSelected}
          />
        )}
      </Item>
      <button
        onClick={() => moveDown(toDo)}
        className={clsx(
          "flex w-full animate-pulse flex-col items-center rounded-b-full bg-altSecondary p-1 transition-all duration-1000 ease-in-out",
          toDo.category === "job" ? "bg-todo active:bg-todo/30" : "bg-issue",
          !isMoving ? "collapse h-0" : "visible h-10",
        )}
      >
        <DownArrowIcon width={30} height={30} />
      </button>
    </div>
  );
}

function ToDoOptionsPopover({
  itemId,
  setIsMovingActive,
  markAsCompleted,
  isTask,
  setIsComplete,
  setIsSelected,

  isSelected,
}: {
  itemId: string;
  setIsMovingActive: () => void;
  markAsCompleted: () => void;
  isTask: boolean;
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isSelected: boolean;
}) {
  const propertyPathname = usePathname().split("todo")[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={clsx(
            " flex w-20 flex-col items-center justify-center px-1 focus:bg-black/20",
            isSelected ? "bg-brandSecondary" : isTask ? "bg-todo" : "bg-issue",
          )}
        >
          <OptionsLargeIcon width={30} height={30} />
          Options
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg border-2 border-black bg-white p-4 shadow-lg">
        <PopoverDescription className="flex flex-col items-start gap-4 pt-5">
          <AnimatedLink
            href={`${propertyPathname}todo/${itemId}`}
            className="flex items-center"
            setIsSelected={setIsSelected}
          >
            <div className="pl-1">
              <ViewIcon width={15} height={15} />
            </div>
            <span className="pl-6">Show</span>
          </AnimatedLink>
          <button onClick={setIsMovingActive} className="flex items-center">
            <div className="pl-2">
              <MoveIcon width={20} height={20} />
            </div>
            <span className="pl-5">Move</span>
          </button>
          <MarkAsCompleted
            markAsCompleted={markAsCompleted}
            setIsComplete={setIsComplete}
          />
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

interface AnimatedLinkProps extends LinkProps {
  children: React.ReactNode;
  href: string;
  className: string;
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

function AnimatedLink({
  children,
  href,
  className,
  setIsSelected,
  ...props
}: AnimatedLinkProps) {
  const { setOpen } = usePopoverContext();
  const router = useRouter();

  const handleTransition = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setIsSelected(true);
    setOpen(false);
    await sleep(1200);
    router.push(href);
  };
  return (
    <Link
      onClick={handleTransition}
      href={href}
      {...props}
      className={className}
    >
      {children}
    </Link>
  );
}

function MarkAsCompleted({
  markAsCompleted,
  setIsComplete,
}: {
  markAsCompleted: () => void;
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setOpen } = usePopoverContext();

  const markAsCompletedAnimated = async () => {
    setOpen(false);
    setIsComplete(true);
    await sleep(1200);
    markAsCompleted();
  };
  return (
    <button
      onClick={markAsCompletedAnimated}
      className={clsx("flex items-center transition duration-700 ease-in-out")}
    >
      <CompletedIcon width={40} height={40} />
      <span className="pl-2">Mark as Completed</span>
    </button>
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
    <div className="mx-auto max-w-md p-1">
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
        " rounded-lg border-2 border-dark p-2 active:bg-brandSecondary",
        selected && "bg-brandSecondary/70",
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
      <AnimatePresence mode="sync">
        <div className="p-3 py-20 text-center text-xl font-semibold">
          {filter === "all" && (
            <MotionComponent>
              <p>There are no incomplete tasks</p>
            </MotionComponent>
          )}
          {filter === "overdue" && (
            <MotionComponent>
              <p>There are no overdue tasks</p>
            </MotionComponent>
          )}
          {filter === "day" && (
            <MotionComponent>
              <p>There are no incomplete tasks today</p>
            </MotionComponent>
          )}
          {filter === "week" && (
            <MotionComponent>
              <p>There are no incomplete tasks this week</p>
            </MotionComponent>
          )}
          {filter === "month" && (
            <MotionComponent>
              <p>There are no incomplete tasks this month</p>
            </MotionComponent>
          )}
        </div>
      </AnimatePresence>
    );
  }
  return (
    <div className="p-3 pt-5 text-center text-xl font-semibold">
      {filter === "all" && (
        <MotionComponent>
          <p>All Tasks</p>
        </MotionComponent>
      )}
      {filter === "overdue" && (
        <MotionComponent>
          <p>Overdue Tasks</p>
        </MotionComponent>
      )}
      {filter === "day" && (
        <MotionComponent>
          <p>Tasks due Today</p>
        </MotionComponent>
      )}
      {filter === "week" && (
        <MotionComponent>
          <p>Tasks due This Week</p>
        </MotionComponent>
      )}
      {filter === "month" && (
        <MotionComponent>
          <p>Tasks due This Month</p>
        </MotionComponent>
      )}
    </div>
  );
}

function MotionComponent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ filter: "blur(5px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      exit={{ filter: "blur(5px)", opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.div>
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
    async (clickedToDo: ToDos[0]) => {
      let newToDos = [...toDos];
      newToDos = newToDos.filter((toDo) => toDo.id !== clickedToDo.id);
      await sleep(1200);
      startTransition(async () => {
        setOptimisticValue(newToDos);
        await updateItem({
          id: clickedToDo.id,
          status: "todo" as ItemStatus,
        });
      });
    },
    [toDos],
  );

  return (
    <AnimatePresence>
      <Reorder.Group
        className="flex flex-col gap-5 p-4"
        values={optimisticToDos}
        onReorder={() => {
          console.log("reorder");
        }}
        axis="y"
        transition={{ duration: 1 }}
      >
        <CompletedTodoMessage completedToDos={toDos} />
        {optimisticToDos.map((toDo, index) => (
          <Reorder.Item
            value={toDo}
            key={`${toDo.id}-${index}`}
            dragListener={false}
          >
            <MotionComponent>
              <CompletedToDo2
                key={toDo.id + index}
                toDo={toDo}
                markAsToDo={markAsToDo}
              />
            </MotionComponent>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </AnimatePresence>
  );
}
function CompletedToDo2({
  toDo,
  markAsToDo,
}: {
  toDo: ToDos[0];
  markAsToDo: (toDo: ToDos[0]) => void;
}) {
  const [isComplete, setIsComplete] = React.useState(false);
  return (
    <Item item={toDo} rounded={true} collapsed={isComplete ? true : false}>
      <CompletedOptionsPopover
        markAsToDo={() => {
          markAsToDo(toDo);
        }}
        itemId={toDo.id}
        setIsComplete={setIsComplete}
      />
    </Item>
  );
}

function CompletedOptionsPopover({
  markAsToDo,
  itemId,
  setIsComplete,
}: {
  markAsToDo: () => void;
  itemId: string;
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const propertyPathname = pathname.split("todo")[0];
  const selectedToDoId = pathname.split("todo/")[1];

  let isSelected = false;
  if (selectedToDoId === itemId) {
    isSelected = true;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-20 flex-col items-center justify-center bg-completed px-1 active:bg-black/10">
          <OptionsLargeIcon width={30} height={30} />
          Options
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg border-2 border-black bg-white p-4 shadow-lg">
        <PopoverDescription className="flex flex-col items-start gap-4 pt-5">
          <Link
            href={`${propertyPathname}/todo/${itemId}`}
            className="flex items-center"
          >
            <div className="pl-1">
              <ViewIcon width={15} height={15} />
            </div>
            <span className="pl-6">Show</span>
          </Link>
          <MarkAsToDo markAsToDo={markAsToDo} setIsComplete={setIsComplete} />
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

function MarkAsToDo({
  markAsToDo,
  setIsComplete,
}: {
  markAsToDo: () => void;
  setIsComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setOpen } = usePopoverContext();

  const markAsToDoAnimated = async () => {
    setOpen(false);
    setIsComplete(true);

    markAsToDo();
  };
  return (
    <button onClick={markAsToDoAnimated} className="flex items-center">
      <ToDoIcon width={40} height={40} />
      <span className="pl-2">Mark as To Do</span>
    </button>
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
