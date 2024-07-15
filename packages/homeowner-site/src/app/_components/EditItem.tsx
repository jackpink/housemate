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
import {
  ItemStatus,
  RecurringSchedule,
  item,
  property,
} from "../../../../core/db/schema";
import ImageUploader from "../../../../ui/Molecules/ImageUploader";
import { addFileToFolderAction, createFolderForItem } from "../actions";
import { type ItemWithFiles } from "../../../../core/homeowner/item";
import React from "react";
import {
  CompletedIcon,
  LargeAddIcon,
  PlusIcon,
  ToDoIcon,
} from "../../../../ui/Atoms/Icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
  useDialogContext,
} from "../../../../ui/Atoms/Dialog";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { useFormState } from "react-dom";
import {
  FormState,
  emptyFormState,
  fromErrorToFormState,
} from "../../../../core/homeowner/forms";
import { z } from "zod";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";

const createDateString = (date: Date) => {
  const dateString = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : "1"}${date.getDate()}`;
  return dateString;
};

export type UpdateItemServerAction = ({
  title,
}: {
  title?: string;
  description?: string;
  status?: ItemStatus;
  recurring?: boolean;
  recurringSchedule?: string;
  date?: Date;
  warrantyEndDate?: string;
}) => Promise<void>;

export default function EditItem({
  item,
  updateItem,
  bucketName,
  propertyId,
  Files,
  deviceType,
}: {
  item: ItemWithFiles;
  updateItem: UpdateItemServerAction;
  bucketName: string;
  propertyId: string;
  Files: React.ReactNode;
  deviceType: "desktop" | "mobile";
}) {
  const date = new Date(item.date);

  return (
    <div className="flex flex-wrap gap-4 p-4">
      <div className="min-w-80 max-w-lg grow">
        <EditableComponent
          value={item.title}
          EditModeComponent={EditableTitle}
          StandardComponent={Title}
          updateValue={async (value: string) => updateItem({ title: value })}
          editable
        />
        <Line />
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
        <ItemDetails
          item={item}
          updateItem={updateItem}
          date={date}
          deviceType={deviceType}
        />
      </div>
      <div className="min-w-80 max-w-lg grow">
        <PhotosAndDocuments
          itemId={item.id}
          bucketName={bucketName}
          propertyId={propertyId}
          Files={Files}
          folderId={item.filesRootFolderId!}
          deviceType={deviceType}
        />
      </div>
    </div>
  );
}

function ItemDetails({
  item,
  updateItem,
  date,
  deviceType,
}: {
  item: ItemWithFiles;
  updateItem: UpdateItemServerAction;
  date: Date;
  deviceType: "desktop" | "mobile";
}) {
  if (item.category === "issue") {
    return (
      <>
        <Status status={item.status} updateItem={updateItem} />
        <Line />

        <EditableComponent
          value={date.toDateString()}
          EditModeComponent={EditableDateOfItem}
          StandardComponent={DateOfItem}
          updateValue={async (value: string) => {
            console.log("value before add", value);

            updateItem({ date: new Date(value) });
          }}
          editable
        />
        <Line />
      </>
    );
  } else if (item.category === "job") {
    return (
      <>
        <Status status={item.status} updateItem={updateItem} />
        <Line />
        <JobOneOffRecurring
          item={item}
          updateItem={updateItem}
          deviceType={deviceType}
        />
        <Line />
      </>
    );
  }
  return (
    <>
      <EditableComponent
        value={date.toDateString()}
        EditModeComponent={EditableDateOfItem}
        StandardComponent={DateOfItem}
        updateValue={async (value: string) => {
          console.log("value before add", value);

          updateItem({ date: new Date(value) });
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
    </>
  );
}

function JobOneOffRecurring({
  item,
  updateItem,
  deviceType,
}: {
  item: ItemWithFiles;
  updateItem: UpdateItemServerAction;
  deviceType: "desktop" | "mobile";
}) {
  const date = new Date(item.date);
  if (item.recurring) {
    return (
      <>
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
          value={item.recurringSchedule}
          EditModeComponent={EditableSchedule}
          StandardComponent={Schedule}
          updateValue={async (value) =>
            updateItem({ recurringSchedule: value })
          }
          editable
        />
        <EditableComponent
          value={date.toDateString()}
          EditModeComponent={EditableDateOfItemUpcoming}
          StandardComponent={DateOfItemUpcoming}
          updateValue={async (value: string) => {
            updateItem({ date: new Date(value) });
          }}
          editable
        />
        <PastDates pastDates={item.pastDates} />
      </>
    );
  }

  return (
    <>
      <EditableComponent
        value={item.recurring ? "recurring" : "one-off"}
        EditModeComponent={EditableOneOffRecurring}
        StandardComponent={OneOffRecurring}
        updateValue={async (value: string) => {
          let recurring = value === "recurring" ? true : false;
          updateItem({ recurring: recurring });
        }}
        editable
      />
      <EditableComponent
        value={date.toDateString()}
        EditModeComponent={EditableDateOfItem}
        StandardComponent={DateOfItem}
        updateValue={async (value: string) => {
          updateItem({ date: new Date(value) });
        }}
        editable
      />
    </>
  );
}

function PastDates({ pastDates }: { pastDates: ItemWithFiles["pastDates"] }) {
  if (pastDates.length === 0) {
    return (
      <div className="w-full pl-2">
        <EditableComponentLabel label="Past Dates" />
        <p>No Past Dates to display</p>
      </div>
    );
  }
  return (
    <div className="w-full pl-2">
      <EditableComponentLabel label="Past Dates" />
      {pastDates.map((date) => (
        <p key={date.id}>{date.date}</p>
      ))}
    </div>
  );
}

function Line() {
  return <div className="w-full border-2 border-altSecondary"></div>;
}

const Title: StandardComponent = ({ value, pending }) => {
  return (
    <h1 className={clsx("p-2 text-xl font-bold ", pending && "text-slate-500")}>
      {value}
    </h1>
  );
};

const EditableTitle: EditModeComponent = ({ value, setValue }) => {
  return (
    <input
      type="text"
      className="max-w-64 grow rounded-lg border-2 border-slate-400 p-2 text-xl"
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

export function CompletedStatusLabel() {
  return (
    <div className="flex w-full items-center justify-center rounded-full bg-completed p-6 text-center ">
      <CompletedIcon width={50} height={50} />
      Completed
    </div>
  );
}

export function ToDoStatusLabel() {
  return (
    <div className="flex w-full items-center justify-center rounded-full bg-todo p-6 text-center">
      <ToDoIcon width={50} height={50} />
      To Do
    </div>
  );
}
function Status({
  status,
  updateItem,
}: {
  status: string;
  updateItem: UpdateItemServerAction;
}) {
  if (status === "completed") {
    return (
      <div className="w-full">
        <EditableComponentLabel label="Status" />
        <CompletedStatusLabel />
        <div className="h-2"></div>
        <button
          className="rounded-full bg-todo/80 p-1 text-center"
          onClick={() => updateItem({ status: ItemStatus.TODO })}
        >
          <span className="flex items-center justify-center">
            Mark as To Do? <ToDoIcon width={30} height={30} />
          </span>
        </button>
        <div className="h-2"></div>
      </div>
    );
  }
  return (
    <div className="w-full">
      <EditableComponentLabel label="Status" />
      <ToDoStatusLabel />
      <div className="h-2"></div>
      <button
        className="rounded-full bg-completed/50 p-1 text-center"
        onClick={() => updateItem({ status: ItemStatus.COMPLETED })}
      >
        <span className="flex items-center justify-center">
          Mark as Complete? <CompletedIcon width={30} height={30} />
        </span>
      </button>
      <div className="h-2"></div>
    </div>
  );
}

const Schedule: StandardComponent = function ({ value, pending }) {
  console.log("value of schedule", value);
  return (
    <div className="w-full">
      <EditableComponentLabel label="Schedule" />
      <p
        className={clsx(
          "w-full pt-2 text-lg capitalize",
          pending && "text-slate-500",
        )}
      >
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
        className="w-full rounded-full bg-altSecondary/70 p-6 capitalize"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      >
        {Object.values(RecurringSchedule).map((schedule) => (
          <option key={schedule} value={schedule} className="capitalize">
            {schedule}
          </option>
        ))}
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

const DateOfItemUpcoming: StandardComponent = function ({ value, pending }) {
  const date = new Date(value);
  console.log("date", date.toDateString());
  return (
    <div className="w-full">
      <EditableComponentLabel label="Date Upcoming" />
      <p className={clsx("w-full pt-2 text-lg", pending && "text-slate-500")}>
        {date.toDateString()}
      </p>
    </div>
  );
};

const EditableDateOfItemUpcoming: EditModeComponent = function ({
  value,
  setValue,
}) {
  const date = new Date(value);
  const dateString = `${date.getFullYear()}-${date.getMonth() < 9 ? "0" : ""}${date.getMonth() + 1}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
  console.log("date editable", dateString);
  return (
    <div className="w-full">
      <EditableComponentLabel label="Date Upcoming" />
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
  folderId,
  bucketName,
  propertyId,
  Files,
  deviceType,
}: {
  itemId: string;
  folderId: string;
  bucketName: string;
  propertyId: string;
  Files: React.ReactNode;
  deviceType: "desktop" | "mobile";
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
    addFileToFolderAction({
      folderId,
      itemId,
      name,
      key,
      bucket: bucketName,
      propertyId,
      type,
    });
  };
  console.log("deviceType", deviceType);
  if (deviceType === "desktop") {
    return (
      <div className="w-full p-2">
        <EditableComponentLabel label="Photos and Documents" />

        {Files}
      </div>
    );
  }
  return (
    <div className="w-full p-2">
      <EditableComponentLabel label="Photos and Documents" />

      {Files}
    </div>
  );
}
