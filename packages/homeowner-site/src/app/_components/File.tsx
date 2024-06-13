"use client";

import clsx from "clsx";
import Image from "next/image";
import { type Files } from "../../../../core/homeowner/item";
import {
  CancelIcon,
  ConfirmIcon,
  CrossIcon,
  EditIconSmall,
  MoveIcon,
  PdfFileIcon,
  TickIcon,
} from "../../../../ui/Atoms/Icons";
import { ReactNode, useState } from "react";
import React from "react";

export type StandardComponent = ({
  value,
  pending,
  url,
}: {
  value: string;
  pending?: boolean;
  url: string;
}) => ReactNode;

export function MobileFile({
  url,
  file,
}: {
  url: string;
  file: Files[number];
}) {
  const isPdf = file.type.endsWith("pdf");

  if (isPdf) {
    return (
      <EditableComponent
        value={file.name}
        EditModeComponent={EditableMobilePDF}
        StandardComponent={MobilePDF}
        url={url}
        updateValue={async (value: string) => console.log("update value")}
        editable
      />
    );
  }

  return (
    <EditableComponent
      value={file.name}
      EditModeComponent={EditableMobileImage}
      StandardComponent={MobileImage}
      url={url}
      updateValue={async (value: string) => console.log("update value")}
      editable
    />
  );
}

function StandardComponent({
  value,
  pending,
  url,
  children,
}: {
  value: string;
  pending?: boolean;
  url: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="w-10 flex-initial pr-2">{children}</div>
      <div className="flex h-auto flex-1 flex-col justify-center">
        <p
          className={clsx(
            "table w-full table-fixed break-words align-bottom	text-sm",
            pending && "text-slate-500",
          )}
        >
          {value}
        </p>
      </div>
    </>
  );
}

function EditModeComponent({
  value,
  setValue,
  url,
  children,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center">
      <div className="w-10 pr-2">{children}</div>
      <input
        type="text"
        className="grow rounded-lg border-2 border-slate-400 p-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
}

const MobilePDF: StandardComponent = ({ url, pending, value }) => {
  return (
    <StandardComponent value={value} pending={pending} url={url}>
      <PdfFileIcon />
    </StandardComponent>
  );
};

const MobileImage: StandardComponent = ({ value, pending, url }) => {
  return (
    <StandardComponent value={value} pending={pending} url={url}>
      <Image
        src={url}
        alt="house"
        className="w-auto object-cover"
        width={56}
        height={56}
      />
    </StandardComponent>
  );
};

const EditableMobilePDF: EditModeComponent = ({ value, setValue, url }) => {
  return (
    <EditModeComponent value={value} setValue={setValue} url={url}>
      <PdfFileIcon />
    </EditModeComponent>
  );
};

const EditableMobileImage: EditModeComponent = ({ value, setValue, url }) => {
  return (
    <EditModeComponent value={value} setValue={setValue} url={url}>
      <Image
        src={url}
        alt="house"
        className="w-auto object-cover"
        width={56}
        height={56}
      />
    </EditModeComponent>
  );
};

export type EditModeComponent = ({
  value,
  setValue,
  url,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  url: string;
}) => ReactNode;

export function EditableComponent({
  value,
  EditModeComponent,
  updateValue,
  StandardComponent,
  url,
  editable,
}: {
  value: string;
  EditModeComponent: EditModeComponent;
  updateValue: (value: string) => Promise<void>;
  StandardComponent: StandardComponent;
  url: string;
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
          <EditModeComponent
            value={inputValue}
            setValue={setInputValue}
            url={url}
          />
        }
      />
    );
  }

  if (!editable) {
    return (
      <EditableComponentWrapper>
        <StandardComponent
          value={optimisticValue}
          pending={pending}
          url={url}
        />
        <div className="justify-self-end"></div>
      </EditableComponentWrapper>
    );
  }

  return (
    <div className="flex justify-between">
      <StandardComponent value={optimisticValue} pending={pending} url={url} />
      <div className="flex-initial justify-self-end">
        <button
          onClick={() => setEditMode(true)}
          className={clsx("pl-2", pending && "cursor-wait")}
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
      {EditableComponent}
      <div className="flex flex-nowrap justify-around pt-2">
        <button className="flex rounded-full border-2 border-black p-2 text-sm font-semibold">
          <MoveIcon />
          Move
        </button>
        <button
          className="flex rounded-full border-2 border-black p-2 text-sm font-semibold"
          onClick={onClickCancel}
        >
          <CrossIcon width={15} />
          Cancel
        </button>
        <button
          className="flex rounded-full border-2 border-black p-2 text-sm font-semibold"
          onClick={onClickConfirm}
        >
          <TickIcon />
          Confirm
        </button>
      </div>
    </div>
  );
};
