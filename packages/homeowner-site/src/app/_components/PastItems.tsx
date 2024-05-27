"use client";

import React from "react";
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

function FiltersForMobile() {
  return (
    <div>
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
              <input type="checkbox" />
              <label>Title</label>
              <input type="text" placeholder="Enter Title to Search" />
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
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
