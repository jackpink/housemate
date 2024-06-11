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

const MobileImage: StandardComponent = ({ value, pending, url }) => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-14 ">
        <Image
          src={url}
          alt="house"
          className="w-auto object-cover"
          width={56}
          height={56}
        />
      </div>
      <p
        className={clsx(
          "w-40 text-wrap break-words p-2 text-sm",
          pending && "text-slate-500",
        )}
      >
        {value}
      </p>
    </div>
  );
};

const EditableMobileImage: EditModeComponent = ({ value, setValue, url }) => {
  return (
    <div className="flex  w-full items-center justify-center">
      <div className="w-14 ">
        <Image
          src={url}
          alt="house"
          className="w-auto object-cover"
          width={56}
          height={56}
        />
      </div>
      <input
        type="text"
        className=" rounded-lg border-2 border-slate-400 p-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
};

const MobilePDF: StandardComponent = ({ value, pending, url }) => {
  return (
    <>
      <div className="w-10 pr-2">
        <PdfFileIcon />
      </div>
      <p
        className={clsx(
          "text-wrap break-words align-middle text-sm",
          pending && "text-slate-500",
        )}
      >
        {value}
      </p>
    </>
  );
};

const EditableMobilePDF: EditModeComponent = ({ value, setValue, url }) => {
  return (
    <div className="flex items-center">
      <div className="w-10 pr-2">
        <PdfFileIcon />
      </div>
      <input
        type="text"
        className="grow rounded-lg border-2 border-slate-400 p-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
};

export type StandardComponent = ({
  value,
  pending,
  url,
}: {
  value: string;
  pending?: boolean;
  url: string;
}) => ReactNode;

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
      {EditableComponent}
      <div className="flex flex-nowrap justify-around pt-2">
        <button className=" rounded-full border-2 border-black p-2 text-sm font-semibold">
          Move
        </button>
        <button onClick={onClickCancel} className="flex">
          <CancelIcon />
        </button>
        <button className="flex" onClick={onClickConfirm}>
          <ConfirmIcon />
        </button>
      </div>
    </div>
  );
};
