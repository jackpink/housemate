"use client";

import React from "react";
import { CompletedItems } from "../../../../core/homeowner/item";
import { ItemQuickViewDialog } from "./ToDos";

export default function PastItems({
  completedItems,
  deviceType,
}: {
  completedItems: CompletedItems;
  deviceType: "mobile" | "desktop";
}) {
  const [filteredItems, setFilteredItems] = React.useState(
    completedItems.slice(0, 10),
  );
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

function FiltersForMobile() {
  return (
    <div>
      <h1>Filters for Mobile</h1>
    </div>
  );
}

function ItemsForMobile({ items }: { items: CompletedItems }) {
  return (
    <div>
      <h1>Items for Mobile</h1>
      <div className="grid gap-4 p-4">
        {items.map((item) => (
          <ItemForMobile key={item.id} item={item} />
        ))}
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
