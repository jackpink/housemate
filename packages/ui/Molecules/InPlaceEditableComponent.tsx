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

export function InPlaceEditableComponent({
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

export const AddButton = ({
  onClick,
  title,
}: {
  onClick: () => void;
  title: string;
}) => {
  return (
    <button className="text-xl text-brandSecondary" onClick={onClick}>
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

export function EditableComponentValue({
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
