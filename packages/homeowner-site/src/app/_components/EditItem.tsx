"use client";

import clsx from "clsx";
import { ParagraphText, Text } from "../../../../ui/Atoms/Text";
import {
  EditableComponent,
  InPlaceEditableComponent,
  EditableComponentLabel,
  type StandardComponent,
  type EditModeComponent,
} from "../../../../ui/Molecules/InPlaceEditableComponent";
import { item } from "../../../../core/db/schema";
import ImageUploader from "../../../../ui/Molecules/ImageUploader";
import { addFileToItemAction } from "../actions";
import { type ItemWithFiles } from "../../../../core/homeowner/item";
import React from "react";

const createDateString = (date: Date) => {
  const dateString = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : "1"}${date.getDate()}`;
  return dateString;
};

export type UpdateItemServerAction = ({
  title,
}: {
  title?: string;
  description?: string;
  recurring?: boolean;
  date?: string;
  warrantyEndDate?: string;
}) => Promise<void>;

export default function EditItem({
  item,
  updateItem,
  bucketName,
  propertyId,
  Files,
}: {
  item: ItemWithFiles;
  updateItem: UpdateItemServerAction;
  bucketName: string;
  propertyId: string;
  Files: React.ReactNode;
}) {
  const date = new Date(item.date);

  if (item.category === "product") {
    return (
      <EditProduct
        item={item}
        updateItem={updateItem}
        bucketName={bucketName}
        propertyId={propertyId}
        Files={Files}
        date={date}
      />
    );
  }

  return (
    <EditJob
      item={item}
      updateItem={updateItem}
      bucketName={bucketName}
      propertyId={propertyId}
      Files={Files}
      date={date}
    />
  );
}

function EditProduct({
  item,
  updateItem,
  bucketName,
  propertyId,
  Files,
  date,
}: {
  item: ItemWithFiles;
  updateItem: UpdateItemServerAction;
  bucketName: string;
  propertyId: string;
  Files: React.ReactNode;
  date: Date;
}) {
  return (
    <>
      <div className="py-4 pl-10">
        <EditableComponent
          value={item.title}
          EditModeComponent={EditableTitle}
          StandardComponent={Title}
          updateValue={async (value: string) => updateItem({ title: value })}
          editable
        />
      </div>
      <Line />
      <div className="flex flex-wrap-reverse items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center lg:w-96 2xl:w-128">
          <InPlaceEditableComponent
            title="Description"
            value={item.description}
            EditModeComponent={EditableDescription}
            StandardComponent={Description}
            updateValue={async (value: string) =>
              updateItem({ description: value })
            }
            editable
          />

          <Line />
          <EditableComponent
            value={date.toDateString()}
            EditModeComponent={EditableDateOfItem}
            StandardComponent={DateOfItem}
            updateValue={async (value: string) => {
              console.log("value before add", value);

              updateItem({ date: value });
            }}
            editable
          />

          <Line />
          <EditableComponent
            value={item.warrantyEndDate || "No Warranty"}
            EditModeComponent={EditableWarrantyEndDate}
            StandardComponent={WarrantyEndDate}
            updateValue={async (value: string) => {
              console.log("value before add", value);

              updateItem({ warrantyEndDate: value });
            }}
            editable
          />
          <Line />

          <PhotosAndDocuments
            itemId={item.id}
            bucketName={bucketName}
            propertyId={propertyId}
            Files={Files}
          />
        </div>
      </div>
    </>
  );
}

function EditIssue({
  item,
  updateItem,
  bucketName,
  propertyId,
  Files,
  date,
}: {
  item: ItemWithFiles;
  updateItem: UpdateItemServerAction;
  bucketName: string;
  propertyId: string;
  Files: React.ReactNode;
  date: Date;
}) {
  return (
    <>
      <div className="py-4 pl-10">
        <EditableComponent
          value={item.title}
          EditModeComponent={EditableTitle}
          StandardComponent={Title}
          updateValue={async (value: string) => updateItem({ title: value })}
          editable
        />
      </div>
      <Line />
      <div className="flex flex-wrap-reverse items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center lg:w-96 2xl:w-128">
          <InPlaceEditableComponent
            title="Description"
            value={item.description}
            EditModeComponent={EditableDescription}
            StandardComponent={Description}
            updateValue={async (value: string) =>
              updateItem({ description: value })
            }
            editable
          />
          <Line />
          <Status status="todo" />
          <Line />
          <EditableComponent
            value={date.toDateString()}
            EditModeComponent={EditableDateOfItem}
            StandardComponent={DateOfItem}
            updateValue={async (value: string) => {
              console.log("value before add", value);

              updateItem({ date: value });
            }}
            editable
          />

          <div className="w-full">
            <EditableComponent
              value={item.recurring ? "recurring" : "one-off"}
              EditModeComponent={EditableOneOffRecurring}
              StandardComponent={OneOffRecurring}
              updateValue={async (value: string) => {
                console.log("value", value);

                let recurring = value === "recurring" ? true : false;
                console.log("recurring", recurring);
                updateItem({ recurring: recurring });
              }}
              editable
            />
            <EditableComponent
              value="Weekly"
              EditModeComponent={EditableSchedule}
              StandardComponent={Schedule}
              updateValue={async (value) => console.log("value", value)}
              editable
            />
            <Line />
          </div>
          <PhotosAndDocuments
            itemId={item.id}
            bucketName={bucketName}
            propertyId={propertyId}
            Files={Files}
          />
        </div>
      </div>
    </>
  );
}

function EditJob({
  item,
  updateItem,
  bucketName,
  propertyId,
  Files,
  date,
}: {
  item: ItemWithFiles;
  updateItem: UpdateItemServerAction;
  bucketName: string;
  propertyId: string;
  Files: React.ReactNode;
  date: Date;
}) {
  return (
    <>
      <div className="py-4 pl-10">
        <EditableComponent
          value={item.title}
          EditModeComponent={EditableTitle}
          StandardComponent={Title}
          updateValue={async (value: string) => updateItem({ title: value })}
          editable
        />
      </div>
      <Line />
      <div className="flex flex-wrap-reverse items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center lg:w-96 2xl:w-128">
          <InPlaceEditableComponent
            title="Description"
            value={item.description}
            EditModeComponent={EditableDescription}
            StandardComponent={Description}
            updateValue={async (value: string) =>
              updateItem({ description: value })
            }
            editable
          />
          <Line />
          <Status status="todo" />
          <Line />
          <EditableComponent
            value={date.toDateString()}
            EditModeComponent={EditableDateOfItem}
            StandardComponent={DateOfItem}
            updateValue={async (value: string) => {
              console.log("value before add", value);

              updateItem({ date: value });
            }}
            editable
          />

          <div className="w-full">
            <EditableComponent
              value={item.recurring ? "recurring" : "one-off"}
              EditModeComponent={EditableOneOffRecurring}
              StandardComponent={OneOffRecurring}
              updateValue={async (value: string) => {
                console.log("value", value);

                let recurring = value === "recurring" ? true : false;
                console.log("recurring", recurring);
                updateItem({ recurring: recurring });
              }}
              editable
            />
            <EditableComponent
              value="Weekly"
              EditModeComponent={EditableSchedule}
              StandardComponent={Schedule}
              updateValue={async (value) => console.log("value", value)}
              editable
            />
            <Line />
          </div>
          <PhotosAndDocuments
            itemId={item.id}
            bucketName={bucketName}
            propertyId={propertyId}
            Files={Files}
          />
        </div>
      </div>
    </>
  );
}

function Line() {
  return <div className="w-full border-2 border-altSecondary"></div>;
}

const Title: StandardComponent = ({ value, pending }) => {
  return (
    <h1 className={clsx("p-2 text-xl font-bold", pending && "text-slate-500")}>
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

const Description: StandardComponent = function ({ value, pending }) {
  return (
    <div>
      <EditableComponentLabel label="Description" />

      <ParagraphText
        className={clsx(
          "p-4 text-xl",
          pending ? "text-slate-400" : "text-slate-700",
        )}
      >
        {value}
      </ParagraphText>
    </div>
  );
};

const EditableDescription: EditModeComponent = function ({ value, setValue }) {
  return (
    <div>
      <EditableComponentLabel label="Description" />
      <textarea
        className="rounded-lg border-2 border-slate-400 p-2 p-4 text-xl"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
};

const OneOffRecurring: StandardComponent = function ({ value, pending }) {
  const displayText = value === "recurring" ? "Recurring" : "One Off";
  const date = item;
  return (
    <div className="w-full">
      <EditableComponentLabel label="One Off / Recurring" />
      <div
        className={clsx(
          "w-full rounded-full bg-altSecondary/70 p-6 text-center",
          pending && "text-slate-500",
        )}
      >
        {displayText}
      </div>
    </div>
  );
};

const EditableOneOffRecurring: EditModeComponent = function ({
  value,
  setValue,
}) {
  return (
    <div>
      <EditableComponentLabel label="One Off / Recurring" />
      <select
        id="status"
        name="status"
        size={1}
        className="w-full rounded-full bg-altSecondary/70 p-6"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      >
        <option value="one-off">One Off</option>
        <option value="recurring">Recurring</option>
      </select>
    </div>
  );
};

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

const Schedule: StandardComponent = function ({ value, pending }) {
  return (
    <div className="w-full">
      <EditableComponentLabel label="Schedule" />
      <p className={clsx("w-full pt-2 text-lg", pending && "text-slate-500")}>
        {value}
      </p>
    </div>
  );
};

const EditableSchedule: EditModeComponent = function ({ value, setValue }) {
  return (
    <div className="w-full">
      <EditableComponentLabel label="Schedule" />
      <select
        id="schedule"
        name="schedule"
        size={1}
        className="w-full rounded-full bg-altSecondary/70 p-6"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      >
        <option value="weekly">Weekly</option>
        <option value="fortnightly">Fortnightly</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="biannually">Biannually</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>
  );
};

const DateOfItem: StandardComponent = function ({ value, pending }) {
  const date = new Date(value);
  console.log("date", date.toDateString());
  return (
    <div className="w-full">
      <EditableComponentLabel label="Date" />
      <p className={clsx("w-full pt-2 text-lg", pending && "text-slate-500")}>
        {date.toDateString()}
      </p>
    </div>
  );
};

const EditableDateOfItem: EditModeComponent = function ({ value, setValue }) {
  const date = new Date(value);
  const dateString = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
  console.log("date editable", dateString);
  return (
    <div className="w-full">
      <EditableComponentLabel label="Date" />
      <div className="w-full pt-2 text-lg">
        <input
          type="date"
          value={dateString}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>
    </div>
  );
};

const WarrantyEndDate: StandardComponent = function ({ value, pending }) {
  if (value === "No Warranty") {
    return (
      <div className="w-full">
        <EditableComponentLabel label="Warranty End Date" />
        <p className={clsx("w-full pt-2 text-lg", pending && "text-slate-500")}>
          {value}
        </p>
      </div>
    );
  }
  const date = new Date(value);
  console.log("date", date.toDateString());
  return (
    <div className="w-full">
      <EditableComponentLabel label="Warranty End Date" />
      <p className={clsx("w-full pt-2 text-lg", pending && "text-slate-500")}>
        {date.toDateString()}
      </p>
    </div>
  );
};

const EditableWarrantyEndDate: EditModeComponent = function ({
  value,
  setValue,
}) {
  const date = new Date(value);
  const dateString = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
  console.log("date editable", dateString);
  return (
    <div className="w-full">
      <EditableComponentLabel label="Warranty End Date" />
      <div className="w-full pt-2 text-lg">
        <input
          type="date"
          value={dateString}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>
    </div>
  );
};

function PhotosAndDocuments({
  itemId,
  bucketName,
  propertyId,
  Files,
}: {
  itemId: string;
  bucketName: string;
  propertyId: string;
  Files: React.ReactNode;
}) {
  const onUploadComplete = ({
    name,
    key,
    type,
  }: {
    name: string;
    key: string;
    type: string;
  }) => {
    addFileToItemAction({
      itemId,
      name,
      key,
      bucket: bucketName,
      propertyId,
      type,
    });
  };
  return (
    <div className="w-full p-2">
      <EditableComponentLabel label="Photos and Documents" />
      <ImageUploader
        bucketKey={`${itemId}/`}
        deviceType="desktop"
        onUploadComplete={onUploadComplete}
        bucketName={bucketName}
      />
      {Files}
    </div>
  );
}
