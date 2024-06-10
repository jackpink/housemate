"use client";

import clsx from "clsx";
import { Text } from "../../../../ui/Atoms/Text";
import Image from "next/image";
import { type Files } from "../../../../core/homeowner/item";
import {
  CancelIcon,
  ConfirmIcon,
  EditIconSmall,
  PdfFileIcon,
} from "../../../../ui/Atoms/Icons";
import { ReactNode, useState } from "react";
import React from "react";

export function MobileImage({
  url,
  file,
}: {
  url: string;
  file: Files[number];
}) {
  return (
    <div className="relative flex  w-full items-center justify-center">
      <div className="w-14 ">
        <Image
          src={url}
          alt="house"
          className="h-full w-auto object-contain"
          width={56}
          height={56}
        />
      </div>
      <EditableComponent
        value={file.name}
        EditModeComponent={EditableTitle}
        StandardComponent={Title}
        updateValue={async (value: string) => console.log("update value")}
        editable
      />
    </div>
  );
}

const Title: StandardComponent = ({ value, pending }) => {
  return (
    <p
      className={clsx(
        "w-40 text-wrap break-words p-2 text-sm",
        pending && "text-slate-500",
      )}
    >
      {value}
    </p>
  );
};

const EditableTitle: EditModeComponent = ({ value, setValue }) => {
  return (
    <>
      <input
        type="text"
        className="absolute -left-0 w-28 rounded-lg  border-2 border-slate-400 p-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <button className=" absolute left-32 rounded-full border-2 border-black p-2 text-sm font-semibold">
        Move
      </button>
    </>
  );
};

export function MobilePDF({ file }: { file: Files[number] }) {
  return (
    <div className="flex h-14 w-full items-center justify-between">
      <div className="w-10">
        <PdfFileIcon />
      </div>
      <EditableComponent
        value={file.name}
        EditModeComponent={EditableTitle}
        StandardComponent={Title}
        updateValue={async (value: string) => console.log("update value")}
        editable
      />
    </div>
  );
}

export type StandardComponent = ({
  value,
  pending,
}: {
  value: string;
  pending?: boolean;
}) => ReactNode;

export type EditModeComponent = ({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => ReactNode;

export function EditableComponent({
  value,
  EditModeComponent,
  updateValue,
  StandardComponent,
  editable,
}: {
  value: string;
  EditModeComponent: EditModeComponent;
  updateValue: (value: string) => Promise<void>;
  StandardComponent: StandardComponent;
  editable?: boolean;
}) {
  const [editMode, setEditMode] = useState(false);

  const [inputValue, setInputValue] = useState(value);

  const [pending, startTransition] = React.useTransition();

  const [optimisticValue, setOptimisticValue] = React.useOptimistic(
    value,
    (state, newValue: string) => {
      return newValue;
    },
  );

  const onClickConfirmButton = () => {
    console.log("input value", inputValue);
    setEditMode(false);
    startTransition(async () => {
      setOptimisticValue(inputValue);
      await updateValue(inputValue);
    });
  };

  const onClickCancelButton = () => {
    setEditMode(false);
    setInputValue(optimisticValue ?? "");
  };

  if (editMode) {
    return (
      <EditMode
        onClickConfirm={onClickConfirmButton}
        onClickCancel={onClickCancelButton}
        EditableComponent={
          <EditModeComponent value={inputValue} setValue={setInputValue} />
        }
      />
    );
  }

  if (!editable) {
    return (
      <EditableComponentWrapper>
        <StandardComponent value={optimisticValue} pending={pending} />
        <div className="justify-self-end"></div>
      </EditableComponentWrapper>
    );
  }

  return (
    <div className="flex justify-between p-2">
      <StandardComponent value={optimisticValue} pending={pending} />
      <div className="justify-self-end">
        <button
          onClick={() => setEditMode(true)}
          className={clsx(pending && "cursor-wait")}
        >
          <EditIconSmall />
        </button>
      </div>
    </div>
  );
}

function EditableComponentWrapper({ children }: { children: ReactNode }) {
  return <div className="w-full justify-between p-2">{children}</div>;
}

export const EditMode: React.FC<{
  onClickConfirm: () => void;
  onClickCancel: () => void;
  EditableComponent: ReactNode;
}> = ({ onClickConfirm, onClickCancel, EditableComponent }) => {
  return (
    <div>
      <div>{EditableComponent}</div>
      <div className="flex flex-nowrap">
        <button onClick={onClickCancel}>
          <CancelIcon />
        </button>
        <button onClick={onClickConfirm}>
          <ConfirmIcon />
        </button>
      </div>
    </div>
  );
};
