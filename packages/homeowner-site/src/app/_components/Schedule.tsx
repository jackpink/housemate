"use client";

import { type ScheduledItems } from "../../../../core/homeowner/item";
import { Item } from "./PastItems";
import { DropDownIcon } from "../../../../ui/Atoms/Icons";
import Link from "next/link";
import clsx from "clsx";
import { number } from "zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

export default function Schedule({
  scheduledItems,
  deviceType,
  pastMonths,
  futureMonths,
}: {
  scheduledItems: ScheduledItems;
  deviceType: string;
  pastMonths: number;
  futureMonths: number;
}) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  console.log("currentMonth", currentMonth);

  return (
    <div className="p-2">
      <PastMonths
        currentMonth={currentMonth}
        numberOfMonths={pastMonths}
        currentYear={currentYear}
        items={scheduledItems}
      />
      <div className="min-w-80 max-w-lg">
        <CurrentMonth
          month={currentMonth}
          year={currentYear}
          items={scheduledItems.filter((item) => {
            return parseInt(item.date.split("-")[1]!) === currentMonth;
          })}
        />
        <FutureMonths
          currentMonth={currentMonth}
          numberOfMonths={futureMonths}
          currentYear={currentYear}
          items={scheduledItems}
        />
      </div>
    </div>
  );
}

const monthMap = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

function MobileSchedule({
  scheduledItems,
}: {
  scheduledItems: ScheduledItems;
}) {
  return (
    <div className="grid gap-4 p-2">
      {scheduledItems.map((item, index) => (
        <Item key={index} item={item} />
      ))}
    </div>
  );
}

function PastMonths({
  currentMonth,
  numberOfMonths,
  currentYear,
  items,
}: {
  currentMonth: number;
  numberOfMonths: number;
  currentYear: number;
  items: ScheduledItems;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const addThreeMonthsToParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    const pastMonths = params.get("pastMonths");
    const newPastMonths = pastMonths
      ? parseInt(pastMonths) + 3
      : numberOfMonths + 3;
    params.set("pastMonths", newPastMonths.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  const months: { month: number; year: number }[] = [];
  console.log("numberOfMonths", numberOfMonths);
  let iter = 0;
  for (let i = numberOfMonths; i > 0; i--) {
    console.log("i", i, currentMonth - i);
    const month = currentMonth - i;
    const year = currentYear;
    months[iter] =
      month < 0 ? { month: month + 12, year: year - 1 } : { month, year };
    iter++;
  }
  console.log("Months", months);
  return (
    <div className="min-w-80 max-w-lg">
      <button
        onClick={addThreeMonthsToParams}
        className="mb-4 w-full rounded-md bg-brand p-2"
      >
        Load More
      </button>
      {months.map(({ month, year }) => {
        const monthItems = items.filter((item) => {
          return (
            parseInt(item.date.split("-")[1]!) === month &&
            parseInt(item.date.split("-")[0]!) === year
          );
        });
        return (
          <Month
            key={`${month}-${year}`}
            month={month}
            year={year}
            items={monthItems}
          />
        );
      })}
    </div>
  );
}

function FutureMonths({
  currentMonth,
  numberOfMonths,
  currentYear,
  items,
}: {
  currentMonth: number;
  numberOfMonths: number;
  currentYear: number;
  items: ScheduledItems;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const addThreeMonthsToParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    const futureMonths = params.get("futureMonths");
    const newFutureMonths = futureMonths
      ? parseInt(futureMonths) + 3
      : numberOfMonths + 3;
    params.set("futureMonths", newFutureMonths.toString());

    router.push(`${pathname}?${params.toString()}`);
  };
  const months: { month: number; year: number }[] = [];
  console.log("numberOfMonths", numberOfMonths);

  for (let i = 1; i <= numberOfMonths; i++) {
    console.log("i", i, currentMonth + i);
    const month = currentMonth + i;
    const year = currentYear;
    console.log(
      "month",
      month,
      month > 12 ? { month: month - 12, year: year + 1 } : { month, year },
    );
    months[i - 1] =
      month > 12 ? { month: month - 12, year: year + 1 } : { month, year };
  }
  console.log("Months", months);
  return (
    <>
      {months.map(({ month, year }) => {
        const monthItems = items.filter((item) => {
          return (
            parseInt(item.date.split("-")[1]!) === month &&
            parseInt(item.date.split("-")[0]!) === year
          );
        });
        return (
          <Month
            key={`${month}-${year}`}
            month={month}
            year={year}
            items={monthItems}
          />
        );
      })}
      <button
        onClick={addThreeMonthsToParams}
        className="mt-4 w-full rounded-md bg-brand p-2"
      >
        Load More
      </button>
    </>
  );
}

function CurrentMonth({
  month,
  year,
  items,
}: {
  month: number;
  year: number;
  items: ScheduledItems;
}) {
  items.sort((a, b) => {
    return parseInt(a.date.split("-")[2]!) - parseInt(b.date.split("-")[2]!);
  });
  return (
    <details
      open
      className="group cursor-pointer border-b border-slate-300 pt-2"
    >
      <summary className="flex items-center justify-between rounded-md bg-brandSecondary p-2 capitalize transition-all duration-500 ease-out group-open:mb-10">
        <span className="transition group-open:rotate-180">
          <DropDownIcon />
        </span>
        <div className="grow">
          <p className=" text-center">Current Month</p>

          <div className="flex justify-between">
            <div className="w-4"></div>
            <p className="text-lg font-semibold">{`${monthMap[month as keyof typeof monthMap]} ${year}`}</p>
            <p>{`(${items.length})`}</p>
          </div>
        </div>
      </summary>

      <div className="grid gap-4 p-4">
        {items.map((item) => (
          <Item key={item.id} item={item}>
            <ShowButton
              item={item}
              colour={
                item.category === "product"
                  ? "product"
                  : item.category === "issue"
                    ? "issue"
                    : item.category === "job" && item.status === "completed"
                      ? "completed"
                      : "todo"
              }
            />
          </Item>
        ))}
      </div>
    </details>
  );
}

function Month({
  month,
  year,
  items,
}: {
  month: number;
  year: number;
  items: ScheduledItems;
}) {
  items.sort((a, b) => {
    return parseInt(a.date.split("-")[2]!) - parseInt(b.date.split("-")[2]!);
  });
  return (
    <details className="group cursor-pointer border-b border-slate-300 pt-2">
      <summary className="flex items-center justify-between rounded-md bg-altSecondary p-2 capitalize transition-all duration-500 ease-out group-open:mb-10">
        <span className="transition group-open:rotate-180">
          <DropDownIcon />
        </span>
        <div className="grow">
          <div className="flex justify-between">
            <div className="w-4"></div>
            <p className="text-lg font-semibold">{`${monthMap[month as keyof typeof monthMap]} ${year}`}</p>
            <p>{`(${items.length})`}</p>
          </div>
        </div>
      </summary>

      <div className="grid gap-4 p-4">
        {items.map((item) => (
          <Item key={item.id} item={item}>
            <ShowButton
              item={item}
              colour={
                item.category === "product"
                  ? "product"
                  : item.category === "issue"
                    ? "issue"
                    : item.category === "job" && item.status === "completed"
                      ? "completed"
                      : "todo"
              }
            />
          </Item>
        ))}
      </div>
    </details>
  );
}

function ShowButton({
  item,
  colour,
}: {
  item: ScheduledItems[0];
  colour: string;
}) {
  return (
    <Link
      href={`/properties/${item.propertyId}/schedule/${item.id}`}
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
      <div className="flex justify-center pb-1"></div>
      <div className="text-center text-xs font-bold">
        Show
        {item.category === "job"
          ? " Job"
          : item.category === "product"
            ? " Product"
            : " Issue"}
      </div>
    </Link>
  );
}
