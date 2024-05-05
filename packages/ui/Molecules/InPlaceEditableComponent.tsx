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
        <button onClick={() => setEditMode(true)} disabled={pending}>
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
}: {
  onClick: () => void;
  title: string;
}) => {
  return (
    <button className="text-brandSecondary text-xl" onClick={onClick}>
      <div className="flex items-center justify-center">
        <PlusIcon width={25} height={25} colour="#c470e7" />
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
