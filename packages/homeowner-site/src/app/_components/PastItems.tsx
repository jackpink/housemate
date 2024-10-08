"use client";

import React, { useCallback } from "react";
import { CompletedItems } from "../../../../core/homeowner/item";
import clsx from "clsx";
import { CancelIcon, PlusIcon, ViewIcon } from "../../../../ui/Atoms/Icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "../../../../ui/Atoms/Dialog";
import {
  usePathname,
  useSearchParams,
  useRouter,
  useParams,
} from "next/navigation";
import { useViewport } from "./ContextProviders";
import Link from "next/link";

export default function PastItems({
  completedItems,
  itemsToShow = 10,
}: {
  completedItems: CompletedItems;
  itemsToShow?: number;
}) {
  const { width, height } = useViewport();
  const [filteredItems, setFilteredItems] = React.useState(completedItems);

  // Filter by saerc params
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const category = searchParams.get("category");
  const date = searchParams.get("date");

  const newFilteredItems = completedItems.filter((item) => {
    let titleResult = true,
      categoryResult = true,
      dateResult = true;
    if (title) {
      titleResult = item.title.toLowerCase().includes(title.toLowerCase());
    }
    if (category) {
      categoryResult = item.category === category;
    }
    if (date) {
      const dateRange = date.split(" to ");
      const startDate = dateRange[0]!;
      const endDate = dateRange[1]!;
      const itemDate = item.date;

      dateResult = itemDate >= startDate && itemDate <= endDate;
    }
    return titleResult && categoryResult && dateResult;
  });

  if (width < 660) {
    return (
      <div>
        <Filters isMobile={true} />
        <Items items={newFilteredItems} itemsToShow={itemsToShow} />
      </div>
    );
  }

  return (
    <div className="flex">
      <Filters isMobile={false} />
      <Items items={newFilteredItems} itemsToShow={itemsToShow} />
    </div>
  );
}

/* 
##########################################################################
FILTERS
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
        " text-xl text-brandSecondary",
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

type Filters = { title: Filter; category: Filter; date: Filter };

function Filters({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  const dateObj = new Date();
  const todaysDate = dateObj.toISOString().split("T")[0];

  dateObj.setMonth(dateObj.getMonth() - 6);
  const sixMonthsAgo = dateObj.toISOString().split("T")[0];

  const initialFilters = {
    title: { status: false, value: "" },
    category: { status: false, value: "job" },
    date: { status: false, value: `${sixMonthsAgo} to ${todaysDate}` },
  };

  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const category = searchParams.get("category");
  const date = searchParams.get("date");

  if (title) {
    initialFilters.title = { status: true, value: title };
  }
  if (category) {
    initialFilters.category = { status: true, value: category };
  }
  if (date) {
    initialFilters.date = { status: true, value: date };
  }

  const [filters, setFilters] = React.useState<Filters>(initialFilters);

  const activeFilters = [];

  for (const filter in filters) {
    if (filters[filter as filterValues].status) {
      const activeFilter = { ...filters[filter as filterValues], name: filter };
      activeFilters.push(activeFilter);
    }
  }

  const removeQueryString = useCallback(
    (name: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(name);
      return params.toString();
    },
    [searchParams],
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { value, name } = e.target;
      setFilters({
        ...filters,
        [name as filterValues]: {
          status: filters[name as filterValues].status,
          value,
        },
      });

      if (filters[name as filterValues].status) {
        const newQueryString = createQueryString(name, value);
        router.push(`${pathname}?${newQueryString}`);
      }
    },
    [filters],
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;
      const currentValue = filters.date.value.split(" to ");
      let newValue = `${value} to ${currentValue[1]}`;
      if (name === "end") {
        newValue = `${currentValue[0]} to ${value}`;
      }
      console.log("New Date Value", newValue);
      setFilters({
        ...filters,
        date: {
          status: filters.date.status,
          value: newValue,
        },
      });
      if (filters.date.status) {
        const newQueryString = createQueryString("date", newValue);
        router.push(`${pathname}?${newQueryString}`);
      }
    },
    [filters],
  );

  console.log("Active Filters", filters);
  if (isMobile) {
    return (
      <FiltersForMobile
        activeFilters={activeFilters}
        setFilters={setFilters}
        filters={filters}
        removeQueryString={removeQueryString}
        toggleFilterStatus={toggleFilterStatus}
        handleFilterChange={handleFilterChange}
        handleDateChange={handleDateChange}
      />
    );
  }

  return (
    <FiltersForDesktop
      filters={filters}
      toggleFilterStatus={toggleFilterStatus}
      handleFilterChange={handleFilterChange}
      handleDateChange={handleDateChange}
    />
  );
}

function FiltersForMobile({
  activeFilters,
  setFilters,
  filters,
  removeQueryString,
  toggleFilterStatus,
  handleFilterChange,
  handleDateChange,
}: {
  activeFilters: { name: string; value: string }[];
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  filters: Filters;
  removeQueryString: (name: string) => string;
  toggleFilterStatus: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="p-4">
      <div className="flex w-full flex-wrap gap-3 pb-4">
        {activeFilters.map((filter) => (
          <div
            key={filter.value}
            className="flex items-center rounded-full border-2 border-dark bg-brandSecondary/40 p-2"
          >
            <span className="font-medium capitalize">{filter.name}</span>
            <span className="px-2">{":"}</span>
            <span className="capitalize">{filter.value}</span>
            <button
              className="pl-4"
              onClick={() => {
                setFilters({
                  ...filters,
                  [filter.name as filterValues]: {
                    status: false,
                    value: filters[filter.name as filterValues].value,
                  },
                });
                const newQueryString = removeQueryString(filter.name);
                router.push(`${pathname}?${newQueryString}`);
              }}
            >
              <CancelIcon width={27} />
            </button>
          </div>
        ))}
      </div>
      <AddFilterDialog
        filters={filters}
        toggleFilterStatus={toggleFilterStatus}
        handleFilterChange={handleFilterChange}
        handleDateChange={handleDateChange}
      />
    </div>
  );
}

function AddFilterDialog({
  filters,
  toggleFilterStatus,
  handleFilterChange,
  handleDateChange,
}: {
  filters: Filters;
  toggleFilterStatus: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
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
        <DialogDescription className="flex w-full flex-col items-center gap-4 pt-4">
          <FilterContainer
            filterName="title"
            filterStatus={filters.title.status}
            toggleFilterStatus={toggleFilterStatus}
          >
            <input
              type="text"
              placeholder="Enter Title to Search"
              onChange={handleFilterChange}
              name="title"
              value={filters.title.value}
              className="w-full rounded-full border-2 border-slate-400 p-4"
            />
          </FilterContainer>
          {/* <FilterContainer
            filterName="category"
            filterStatus={filters.category.status}
            toggleFilterStatus={toggleFilterStatus}
          >
            <select
              onChange={handleFilterChange}
              name="category"
              className="w-full rounded-full border-2 border-slate-400 p-4"
            >
              <option value="job">Job</option>
              <option value="issue">Issue</option>
              <option value="product">Product</option>
            </select>
          </FilterContainer> */}
          <FilterContainer
            filterName="date"
            filterStatus={filters.date.status}
            toggleFilterStatus={toggleFilterStatus}
          >
            <input
              type="date"
              placeholder="Enter Category to Search"
              onChange={handleDateChange}
              name="start"
              value={filters.date.value.split(" to ")[0]}
              className="w-full rounded-full border-2 border-slate-400 p-4"
            />
            <input
              type="date"
              placeholder="Enter Category to Search"
              onChange={handleDateChange}
              name="end"
              value={filters.date.value.split(" to ")[1]}
              className="w-full rounded-full border-2 border-slate-400 p-4"
            />
          </FilterContainer>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function FilterContainer({
  children,
  filterStatus,
  filterName,
  toggleFilterStatus,
}: {
  children: React.ReactNode;
  filterStatus: boolean;
  filterName: string;
  toggleFilterStatus: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={clsx(
        "w-full rounded-lg border-2 border-black p-2",
        filterStatus && "bg-brandSecondary/70",
      )}
    >
      <input
        type="checkbox"
        checked={filterStatus}
        name={filterName}
        onChange={toggleFilterStatus}
      />
      <label className="pl-3 text-xl font-semibold capitalize">
        {filterName}
      </label>
      <div className="pt-4">{children}</div>
    </div>
  );
}

function FiltersForDesktop({
  filters,
  toggleFilterStatus,
  handleFilterChange,
  handleDateChange,
}: {
  filters: Filters;
  toggleFilterStatus: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex max-w-64 flex-col items-center gap-4 p-4">
      <FilterContainer
        filterName="title"
        filterStatus={filters.title.status}
        toggleFilterStatus={toggleFilterStatus}
      >
        <input
          type="text"
          placeholder="Enter Title to Search"
          onChange={handleFilterChange}
          name="title"
          value={filters.title.value}
          className="w-full rounded-full border-2 border-slate-400 p-4"
        />
      </FilterContainer>
      {/* <FilterContainer
        filterName="category"
        filterStatus={filters.category.status}
        toggleFilterStatus={toggleFilterStatus}
      >
        <select
          onChange={handleFilterChange}
          name="category"
          className="w-full rounded-full border-2 border-slate-400 p-4"
        >
          <option value="job">Job</option>
          <option value="issue">Issue</option>
          <option value="product">Product</option>
        </select>
      </FilterContainer> */}
      <FilterContainer
        filterName="date"
        filterStatus={filters.date.status}
        toggleFilterStatus={toggleFilterStatus}
      >
        <input
          type="date"
          placeholder="Enter Category to Search"
          onChange={handleDateChange}
          name="start"
          value={filters.date.value.split(" to ")[0]}
          className="w-full rounded-full border-2 border-slate-400 p-4"
        />
        <input
          type="date"
          placeholder="Enter Category to Search"
          onChange={handleDateChange}
          name="end"
          value={filters.date.value.split(" to ")[1]}
          className="w-full rounded-full border-2 border-slate-400 p-4"
        />
      </FilterContainer>
    </div>
  );
}

/*
##########################################################################
ITEMS
##########################################################################
*/

function Items({
  items,
  itemsToShow,
}: {
  items: CompletedItems;
  itemsToShow: number;
}) {
  const reducedItems = items.slice(0, itemsToShow);

  // need to add a function to add 10 to itemsToShow
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const addTenToItemsToShowParams = () => {
    const params = new URLSearchParams(searchParams.toString());
    const searchLimit = Number(params.get("limit")) || 10;
    const newSearchLimit = searchLimit + 10;
    params.set("limit", newSearchLimit.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-w-80 max-w-lg grow">
      <div className="grid gap-4 p-4">
        {reducedItems.map((item) => (
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
        {itemsToShow < items.length && (
          <button
            className="rounded-full bg-altSecondary p-3"
            onClick={addTenToItemsToShowParams}
          >
            Load More...
          </button>
        )}
      </div>
    </div>
  );
}

export function Item({
  item,
  children,
  rounded = true,
  colour = item.category === "product"
    ? "product"
    : item.category === "issue" && item.status === "completed"
      ? "completed"
      : item.category === "issue" && item.status === "todo"
        ? "issue"
        : item.category === "job" && item.status === "completed"
          ? "completed"
          : "todo",
  collapsed = false,
}: {
  item: CompletedItems[0];
  children?: React.ReactNode;
  rounded?: boolean;
  colour?: string;
  collapsed?: boolean;
}) {
  const dateString = new Date(item.date).toDateString();
  const category =
    item.category === "job" && item.status === "completed"
      ? "Completed Job"
      : item.category === "job" && item.status === "todo"
        ? "Task"
        : item.category === "issue" && item.status === "completed"
          ? "Completed Issue"
          : item.category === "issue" && item.status === "todo"
            ? "Issue"
            : "Product";

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const isOverdue =
    new Date(item.date) <= startOfToday && item.status !== "completed";

  return (
    <div
      className={clsx(
        "flex p-3 transition-all duration-[1000ms] ease-linear",
        colour === "product" && "bg-product/50",
        colour === "completed" && "bg-completed/50",
        colour === "todo" && "bg-todo/70",
        colour === "issue" && "bg-issue/50",
        colour === "selected" && "bg-brandSecondary/50",
        rounded && "rounded-xl",
        collapsed ? "max-h-20 blur-sm" : "max-h-40",
      )}
    >
      <div className="grow">
        <p className="text-sm italic">
          {dateString}
          {isOverdue && (
            <span className="ml-3 rounded-full bg-red-300 p-1 font-semibold not-italic text-red-700">
              Overdue
            </span>
          )}
        </p>
        <p className="p-1 text-center text-lg font-semibold">{item.title}</p>
        <p>{category}</p>
      </div>

      {/* <Link
        href={`/properties/${item.propertyId}/past/${item.id}`}
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
        <div className="text-center text-xs">
          Show
          {item.category === "job"
            ? " Job"
            : item.category === "product"
              ? " Product"
              : " Issue"}
        </div>
      </Link> */}

      {children}
    </div>
  );
}

function ShowButton({
  item,
  colour,
}: {
  item: CompletedItems[0];
  colour: string;
}) {
  const params = useParams();
  const currentItemId = params.itemId?.toString() || "";
  return (
    <Link
      href={`/properties/${item.propertyId}/search/${item.id}`}
      className={clsx(
        "h-full w-20 rounded-sm py-3",
        currentItemId === item.id
          ? "bg-brandSecondary"
          : colour === "todo"
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
      <div className="flex flex-col items-center justify-center text-center text-xs font-bold">
        <ViewIcon />
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
