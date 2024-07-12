import { ToDoIcon } from "../../../../ui/Atoms/Icons";
import { ParagraphText } from "../../../../ui/Atoms/Text";
import { EditableComponentLabel } from "../../../../ui/Molecules/InPlaceEditableComponent";

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

export function EditItemLoading() {
  return (
    <div className="flex flex-wrap gap-4 p-4 blur-sm">
      <div className="min-w-80 max-w-lg grow">
        <Title />
        <Line />
        <Description />
        <Line />
        <ToDoStatusLabel />
        <Line />
        <OneOffRecurring />
        <Line />
        <DateOfItem />
        <Line />
      </div>
    </div>
  );
}

function Line() {
  return <div className="w-full border-2 border-altSecondary"></div>;
}

const Title = () => {
  return <h1 className="p-2 text-xl font-bold ">Item Title</h1>;
};

const Description = function () {
  return (
    <div>
      <EditableComponentLabel label="Description" />

      <ParagraphText className="p-4 text-xl">
        This is the paragraph text that is used in the description. lets see how
        it looks on a loaing state skeleton hting you know
      </ParagraphText>
    </div>
  );
};

const OneOffRecurring = function () {
  const displayText = "Recurring";

  return (
    <div className="w-full">
      <EditableComponentLabel label="One Off / Recurring" />
      <div className="w-full rounded-full bg-altSecondary/70 p-6 text-center">
        {displayText}
      </div>
    </div>
  );
};

function ToDoStatusLabel() {
  return (
    <div className="flex w-full items-center justify-center rounded-full bg-todo p-6 text-center">
      <ToDoIcon width={50} height={50} />
      To Do
    </div>
  );
}
const DateOfItem = function () {
  return (
    <div className="w-full">
      <EditableComponentLabel label="Date" />
      <p className="w-full pt-2 text-lg">Thur Jul 12 2024</p>
    </div>
  );
};
