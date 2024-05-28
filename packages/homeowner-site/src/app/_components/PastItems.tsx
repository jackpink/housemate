"use client";

import React, { use, useCallback } from "react";
import { CompletedItems } from "../../../../core/homeowner/item";
import { ItemQuickViewDialog } from "./ToDos";
import clsx from "clsx";
import { PlusIcon } from "../../../../ui/Atoms/Icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "../../../../ui/Atoms/Dialog";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function PastItems({
  completedItems,
  deviceType,
}: {
  completedItems: CompletedItems;
  deviceType: "mobile" | "desktop";
}) {
  const [filteredItems, setFilteredItems] = React.useState(completedItems);

  if (deviceType === "mobile") {
    return (
      <div>
        <FiltersForMobile />
        <ItemsForMobile items={filteredItems} />
      </div>
    );
  }

  return (
    <div>
      <FiltersForDesktop />
      <ItemsForDesktop />
    </div>
  );
}

/* 
##########################################################################
FOR MOBILE
##########################################################################
*/

export const AddButton = ({
  onClick,
  editable = true,
}: {
  onClick: () => void;
  editable?: boolean;
}) => {
  let colour = "#c470e7";
  if (!editable) {
    colour = "#c4c4c4";
  }
  return (
    <button
      className={clsx(
        "p-6 text-xl text-brandSecondary",
        !editable && "cursor-not-allowed text-slate-500",
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        <PlusIcon width={25} height={25} colour={colour} />
        <span className="pl-4">Add Filter</span>
      </div>
    </button>
  );
};

type filterValues = "title";

type Filter = { status: boolean; value: string };

type Filters = { title: Filter };

function FiltersForMobile() {
  const [filters, setFilters] = React.useState<{ title: Filter }>({
    title: { status: false, value: "" },
  });

  return (
    <div>
      <AddFilterDialog filters={filters} setFilters={setFilters} />
    </div>
  );
}

function AddFilterDialog({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const removeQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams],
  );

  const toggleFilterStatus = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;
      const newStatus = !filters[name as filterValues].status;
      const currentValue = filters[name as filterValues].value;
      setFilters({
        ...filters,
        [name as filterValues]: {
          status: newStatus,
          value: currentValue,
        },
      });
      if (!!newStatus) {
        const newQueryString = createQueryString(name, currentValue);
        router.push(`${pathname}?${newQueryString}`);
      } else {
        const newQueryString = removeQueryString(name);
        router.push(`${pathname}?${newQueryString}`);
      }
    },
    [filters],
  );

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;
      setFilters({
        ...filters,
        [name as filterValues]: {
          status: filters[name as filterValues].status,
          value,
        },
      });
      if (filters[name as filterValues]) {
        const newQueryString = createQueryString(name, value);
        router.push(`${pathname}?${newQueryString}`);
      }
    },
    [filters],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <AddButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="Dialog">
        <DialogClose className="float-end rounded-lg border-2 border-black p-2">
          <p>Close</p>
        </DialogClose>
        <DialogHeading className="pt-3 text-xl">Filters</DialogHeading>
        <DialogDescription className="flex w-full flex-col items-center pt-4">
          <div>
            <input
              type="checkbox"
              checked={filters.title.status}
              name="title"
              onChange={toggleFilterStatus}
            />
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter Title to Search"
              onChange={handleFilterChange}
              name="title"
            />
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function ItemsForMobile({ items }: { items: CompletedItems }) {
  const [itemsToShow, setItemsToShow] = React.useState(2);

  const reducedItems = items.slice(0, itemsToShow);

  return (
    <div>
      <h1>Items for Mobile</h1>
      <div className="grid gap-4 p-4">
        {reducedItems.map((item) => (
          <ItemForMobile key={item.id} item={item} />
        ))}
        {itemsToShow < items.length && (
          <button
            className="rounded-full bg-altSecondary p-3"
            onClick={() => setItemsToShow(itemsToShow + 2)}
          >
            Load More...
          </button>
        )}
      </div>
    </div>
  );
}

function ItemForMobile({ item }: { item: CompletedItems[0] }) {
  const dateString = new Date(item.date).toDateString();
  const category =
    item.category === "job"
      ? "Job"
      : item.category === "issue"
        ? "Issue"
        : "Product";
  return (
    <div className="flex rounded-xl bg-brand/50 p-3">
      <div className="grow">
        <p className="italic">{dateString}</p>
        <p className="text-center text-lg font-semibold">{item.title}</p>
        <p>{category}</p>
      </div>
      <ItemQuickViewDialog toDo={item} isOverdue={false} />
    </div>
  );
}
/*
##########################################################################
FOR DESKTOP
##########################################################################
*/

function FiltersForDesktop() {
  return (
    <div>
      <h1>Filters for Desktop</h1>
    </div>
  );
}

function ItemsForDesktop() {
  return (
    <div>
      <h1>Items for Desktop</h1>
    </div>
  );
}
