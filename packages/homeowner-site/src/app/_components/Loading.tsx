export function ToDosLoading() {
  return (
    <div className=" max-w-lg">
      <ToDoFilter />
      <div className="flex flex-col gap-5 p-4">
        <ItemLoading />
        <ItemLoading />
        <ItemLoading />
      </div>
    </div>
  );
}

function ToDoFilter({}: {}) {
  return (
    <div className="mx-auto max-w-md p-1">
      <p className="p-3 pl-2 text-center text-xl font-semibold">Filter Items</p>
      <div className="flex w-full justify-around p-1">
        <Selector>All</Selector>
        <Selector>Overdue</Selector>
        <Selector>Today</Selector>
        <Selector>
          This
          <br />
          Week
        </Selector>
        <Selector>
          This
          <br />
          Month
        </Selector>
      </div>
      <div className="p-3 pt-5 text-center text-lg font-semibold blur-sm">
        Loading
      </div>
    </div>
  );
}

function Selector({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex flex-col items-center justify-center rounded-lg border-2 border-dark p-2 text-center align-middle">
      <span>{children}</span>
    </span>
  );
}

function ItemLoading() {
  return (
    <div className="flex bg-todo/70 p-3">
      <div className="grow">
        <p className="text-sm italic blur-sm">Thu Jun 15 2028</p>
        <p className="p-1 text-center text-lg  font-semibold blur-sm">
          Item Title
        </p>
        <p className="blur-sm">Task</p>
      </div>

      <div className="h-20 w-20 rounded-sm bg-todo py-3"></div>
    </div>
  );
}
