"use client";

import { ReactNode, useState } from "react";
import { EditIconSmall, PlusIcon, CrossIcon, TickIcon } from "../Atoms/Icons";
import { TextSpan, ParagraphText } from "../Atoms/Text";
import clsx from "clsx";
import React from "react";

export function InPlaceEditableComponent({
  title,
  value,
  EditModeComponent,
  updateValue,
  StandardComponent,
  editable = true,
}: {
  title: string;
  value: string | null;
  EditModeComponent: EditModeComponent;
  updateValue: (value: string) => Promise<void>;
  StandardComponent: StandardComponent;
  editable?: boolean;
}) {
  const [editMode, setEditMode] = useState(false);

  const [inputValue, setInputValue] = useState(value ?? "");

  const [pending, startTransition] = React.useTransition();

  const [optimisticValue, setOptimisticValue] = React.useOptimistic(
    value,
    (state, newValue: string) => {
      return newValue;
    },
  );

  const exists = optimisticValue !== null;

  const onClickConfirmButton = () => {
    console.log("input value", inputValue);
    setEditMode(false);
    startTransition(async () => {
      setOptimisticValue(inputValue);
      await updateValue(inputValue);
    });
  };

  if (!exists && editMode) {
    return (
      <EditableComponentWrapper>
        <EditMode
          onClickConfirm={onClickConfirmButton}
          onClickCancel={() => setEditMode(false)}
          EditableComponent={
            <EditModeComponent value={inputValue} setValue={setInputValue} />
          }
        />
      </EditableComponentWrapper>
    );
  }
  if (!exists && !editMode) {
    return <AddButton title={title} onClick={() => setEditMode(true)} />;
  }

  return (
    <EditableComponent
      value={optimisticValue ?? ""}
      EditModeComponent={EditModeComponent}
      updateValue={updateValue}
      StandardComponent={StandardComponent}
      editable={editable}
    />
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
      <EditableComponentWrapper>
        <EditMode
          onClickConfirm={onClickConfirmButton}
          onClickCancel={onClickCancelButton}
          EditableComponent={
            <EditModeComponent value={inputValue} setValue={setInputValue} />
          }
        />
      </EditableComponentWrapper>
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
    <div className="flex w-full justify-between">
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
  return <div className={clsx(" w-full justify-between p-2")}>{children}</div>;
}

export const AddButton = ({
  onClick,
  title,
  editable = true,
}: {
  onClick: () => void;
  title: string;
  editable?: boolean;
}) => {
  let colour = "#c470e7";
  if (!editable) {
    colour = "#c4c4c4";
  }
  return (
    <button
      className={clsx(
        "text-brandSecondary p-6 text-xl",
        !editable && "cursor-not-allowed text-slate-500",
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        <PlusIcon width={25} height={25} colour={colour} />
        <span className="pl-4">Add {title}</span>
      </div>
    </button>
  );
};

export const EditMode: React.FC<{
  onClickConfirm: () => void;
  onClickCancel: () => void;
  EditableComponent: ReactNode;
}> = ({ onClickConfirm, onClickCancel, EditableComponent }) => {
  return (
    <>
      <div>{EditableComponent}</div>
      <div className="flex flex-nowrap justify-around pt-2">
        <button
          className="flex rounded-full border-2 border-black p-2 text-sm font-semibold"
          onClick={onClickCancel}
        >
          <CrossIcon width={15} />
          <span className="pl-1">Cancel</span>
        </button>
        <button
          className="flex rounded-full border-2 border-black p-2 text-sm font-semibold"
          onClick={onClickConfirm}
        >
          <TickIcon />
          <span className="pl-1">Confirm</span>
        </button>
      </div>
    </>
  );
};

export function EditableComponentLabel({ label }: { label: string }) {
  return (
    <TextSpan className="text-nowrap text-xl font-medium">{label}</TextSpan>
  );
}

export function CapitaliseText({
  value,
  capitalise = true,
}: {
  value: string;
  capitalise?: boolean;
}) {
  return (
    <>
      <span>{capitalise ? value.charAt(0).toUpperCase() : value}</span>
      <span className="	">{capitalise ? value.slice(1) : ""}</span>
    </>
  );
}

export function EditableComponentValueLargeText({ value }: { value: string }) {
  return (
    <>
      <ParagraphText className="pl-10 text-xl font-normal">
        {value}
      </ParagraphText>
    </>
  );
}
