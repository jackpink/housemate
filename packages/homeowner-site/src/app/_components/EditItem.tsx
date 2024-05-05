"use client";

import clsx from "clsx";
import { EditIconSmall } from "../../../../ui/Atoms/Icons";
import { ParagraphText, Text } from "../../../../ui/Atoms/Text";
import {
  EditableComponent,
  InPlaceEditableComponentWithAdd,
  EditableComponentLabel,
  type StandardComponent,
  type EditModeComponent,
} from "../../../../ui/Molecules/InPlaceEditableComponent";
import { Dispatch, SetStateAction, useState } from "react";
import { InferSelectModel } from "drizzle-orm";
import { item } from "../../../../core/db/schema";

type Item = InferSelectModel<typeof item>;

type UpdateItemServerAction = ({ title }: { title?: string }) => Promise<void>;

export default function EditItem({
  item,
  updateItem,
}: {
  item: Item;
  updateItem: UpdateItemServerAction;
}) {
  return (
    <>
      <EditableComponent
        value={item.title}
        EditModeComponent={EditableTitle}
        StandardComponent={Title}
        updateValue={async (value: string) => updateItem({ title: value })}
        editable
      />
      <Line />
      <div className="flex flex-wrap-reverse items-center justify-center">
        <div className="m-2 flex w-full flex-col items-center justify-center lg:w-96 2xl:w-128">
          <InPlaceEditableComponentWithAdd
            title="Description"
            EditableComponent={<EditableDescription description="sd" />}
            StandardComponent={<Description description="sd" />}
            onConfirmEdit={() => console.log("confirm edit")}
            exists={false}
            editable
          />
          <Line />
          <Status status="todo" />
          <Line />
          <div className="w-full">
            <EditableComponentLabel label="One Off / Recurring" />
            <Recurring recurring={false} />
            <Line />
          </div>
        </div>
      </div>
    </>
  );
}

function Line() {
  return <div className="w-full border-2 border-altSecondary"></div>;
}

const Title: StandardComponent = ({ value, pending }) => {
  console.log("pending", pending, value);
  return (
    <h1 className={clsx("p-2 text-xl", pending && "text-slate-500")}>
      {value}
    </h1>
  );
};

const EditableTitle: EditModeComponent = ({ value, setValue }) => {
  return (
    <input
      type="text"
      className="rounded-lg border-2 border-slate-400 p-2 text-xl"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
};

function Description({ description }: { description: string }) {
  return (
    <ParagraphText className="pl-10 text-xl font-normal">
      {description}
    </ParagraphText>
  );
}

function EditableDescription({ description }: { description: string }) {
  return (
    <textarea
      className="rounded-lg border-2 border-slate-400 p-2 text-xl"
      value={description}
    />
  );
}

function Status({ status }: { status: string }) {
  let statusFormatted = "";
  switch (status) {
    case "todo":
      statusFormatted = "To Do";
      break;
    case "completed":
      statusFormatted = "completed";
      break;
  }
  return (
    <div className="w-full">
      <EditableComponentLabel label="Status" />
      <div className="rounded-full bg-altSecondary/70 p-6 text-center">
        {statusFormatted}
      </div>
      <button>
        <Text>Mark as Complete? ✓</Text>
      </button>
      <Text></Text>
    </div>
  );
}

function Recurring({ recurring }: { recurring: boolean }) {
  const [editMode, setEditMode] = useState(false);

  if (editMode && recurring) {
    return (
      <>
        <select
          id="status"
          name="status"
          size={1}
          className="rounded-full bg-altSecondary/70 p-6"
        >
          <option value="todo">One Off</option>
          <option value="completed">Recurring</option>
        </select>
        <Schedule />
      </>
    );
  } else if (editMode && !recurring) {
    return (
      <select
        id="status"
        name="status"
        size={1}
        className="w-full rounded-full bg-altSecondary/70 p-6 text-center"
      >
        <option value="todo">Recurring</option>
        <option value="completed">One Off</option>
      </select>
    );
  }
  return (
    <>
      <div className="flex justify-between rounded-full bg-altSecondary/70 p-6 text-center">
        <div></div>
        <div>{recurring ? "Recurring" : "One Off"}</div>
        <button onClick={() => setEditMode(true)}>
          <EditIconSmall />
        </button>
      </div>
      <Schedule />
      <Text></Text>
    </>
  );
}

function Schedule() {
  return (
    <div>
      <select>
        <option>Weekly</option>
        <option>Fortnightly</option>
        <option>Monthly</option>
        <option>Quarterly</option>
        <option>Biannually</option>
        <option>Yearly</option>
      </select>
      <input type="date" />
    </div>
  );
}
