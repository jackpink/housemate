"use client";

import { ReactNode, useState } from "react";
import {
  EditIconSmall,
  PlusIcon,
  CancelIcon,
  ConfirmIcon,
} from "../Atoms/Icons";
import { TextSpan, ParagraphText } from "../Atoms/Text";
import clsx from "clsx";
import React from "react";

export function InPlaceEditableComponentWithAdd({
  title,
  EditableComponent,
  onConfirmEdit,
  StandardComponent,
  exists,
  editable = true,
  loading = false,
}: {
  title: string;
  EditableComponent: ReactNode;
  onConfirmEdit: () => void;
  StandardComponent: ReactNode;
  exists: boolean;
  editable?: boolean;
  loading?: boolean;
}) {
  const [editMode, setEditMode] = useState(false);

  const onClickConfirmButton = () => {
    setEditMode(false);
    onConfirmEdit();
  };

  return (
    <div className="flex w-full justify-between py-5 pl-6">
      {editMode ? (
        <>
          <EditMode
            onClickConfirm={onClickConfirmButton}
            onClickCancel={() => setEditMode(false)}
            EditableComponent={EditableComponent}
          />
        </>
      ) : !exists ? (
        <AddButton title={title} onClick={() => setEditMode(true)} />
      ) : !editable ? (
        <>
          <div>{StandardComponent}</div>
          <div className="justify-self-end"></div>
        </>
      ) : (
        <>
          <div className={clsx(loading && "animate-pulse")}>
            {StandardComponent}
          </div>
          <div className="justify-self-end">
            <button onClick={() => setEditMode(true)} disabled={loading}>
              <EditIconSmall />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

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
  console.log("pending", pending);

  if (editMode) {
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

  if (!editable) {
    return (
      <EditableComponentWrapper>
        <StandardComponent value={optimisticValue} pending={pending} />
        <div className="justify-self-end"></div>
      </EditableComponentWrapper>
    );
  }

  return (
    <EditableComponentWrapper>
      <StandardComponent value={optimisticValue} pending={pending} />
      <div className="justify-self-end">
        <button
          onClick={() => setEditMode(true)}
          className={clsx(pending && "cursor-wait")}
        >
          <EditIconSmall />
        </button>
      </div>
    </EditableComponentWrapper>
  );
}

function EditableComponentWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full justify-between py-5 pl-6">{children}</div>
  );
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
      <div className="flex flex-nowrap">
        <button onClick={onClickCancel}>
          <CancelIcon />
        </button>
        <button onClick={onClickConfirm}>
          <ConfirmIcon />
        </button>
      </div>
    </>
  );
};

export function EditableComponentLabel({ label }: { label: string }) {
  return <TextSpan className="text-xl font-medium">{label}</TextSpan>;
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
      <TextSpan className="pl-10 text-xl font-normal">
        {capitalise ? value.charAt(0).toUpperCase() : value}
      </TextSpan>
      <TextSpan className=" text-xl font-normal">
        {capitalise ? value.slice(1) : ""}
      </TextSpan>
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
