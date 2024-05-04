"use client";

import { EditIconSmall } from "../../../../ui/Atoms/Icons";
import { ParagraphText, Text } from "../../../../ui/Atoms/Text";
import {
  InPlaceEditableComponent,
  InPlaceEditableComponentWithAdd,
  EditableComponentLabel,
} from "../../../../ui/Molecules/InPlaceEditableComponent";
import { useState } from "react";

export default function EditItem({ title }: { title: string }) {
  return (
    <>
      <InPlaceEditableComponent
        EditableComponent={<EditableTitle title={title} />}
        StandardComponent={<Title title={title} />}
        onConfirmEdit={() => console.log("confirm edit")}
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

function Title({ title }: { title: string }) {
  return <h1 className="p-2 text-xl">{title}</h1>;
}

function EditableTitle({ title }: { title: string }) {
  return (
    <input
      type="text"
      className="rounded-lg border-2 border-slate-400 p-2 text-xl"
      value={title}
    />
  );
}

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
