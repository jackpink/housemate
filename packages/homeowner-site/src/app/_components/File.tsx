"use client";

import clsx from "clsx";
import Image from "next/image";
import { type Files } from "../../../../core/homeowner/item";
import {
  CancelIcon,
  ConfirmIcon,
  CrossIcon,
  EditIconSmall,
  FolderIcon,
  MoveIcon,
  PdfFileIcon,
  TickIcon,
} from "../../../../ui/Atoms/Icons";
import { ReactNode, useState } from "react";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverTrigger,
  usePopoverContext,
} from "../../../../ui/Atoms/Popover";
import { type Folder } from "../../../../core/homeowner/item";
import { on } from "events";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
  useDialog,
  useDialogContext,
} from "../../../../ui/Atoms/Dialog";

export type StandardComponent = ({
  value,
  pending,
  url,
}: {
  value: string;
  pending?: boolean;
  url: string;
}) => ReactNode;

export type UpdateFileServerAction = ({}: {
  name?: string;
  folderId?: string;
}) => Promise<void>;

export function MobileFile({
  url,
  file,
  updateFile,
  allFolders,
}: {
  url: string;
  file: Files[number];
  updateFile: UpdateFileServerAction;
  allFolders: Folder[];
}) {
  const isPdf = file.type.endsWith("pdf");

  if (isPdf) {
    return (
      <EditableComponent
        value={file.name}
        EditModeComponent={EditableMobilePDF}
        StandardComponent={MobilePDF}
        url={url}
        updateValue={async (value: string) => updateFile({ name: value })}
        allFolders={allFolders}
        file={file}
        updateFile={updateFile}
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
      updateValue={async (value: string) => updateFile({ name: value })}
      allFolders={allFolders}
      file={file}
      updateFile={updateFile}
      editable
    />
  );
}

function StandardComponent({
  value,
  pending,
  children,
  onClick,
}: {
  value: string;
  pending?: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex text-left">
      <div className="w-14 flex-initial pr-2">{children}</div>
      <div className="flex h-auto flex-1 flex-col justify-center">
        <p className={clsx(" break-word	text-sm ", pending && "text-slate-500")}>
          {value}
        </p>
      </div>
    </button>
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
      <div className="w-14 pr-2">{children}</div>
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
    <PdfDialog url={url}>
      <StandardComponent value={value} pending={pending} onClick={() => {}}>
        <PdfFileIcon />
      </StandardComponent>
    </PdfDialog>
  );
};

const MobileImage: StandardComponent = ({ value, pending, url }) => {
  return (
    <ImageDialog url={url}>
      <StandardComponent value={value} pending={pending} onClick={() => {}}>
        <Image
          src={url}
          alt="house"
          className="w-auto object-cover"
          width={56}
          height={56}
        />
      </StandardComponent>
    </ImageDialog>
  );
};

function ImageDialog({ url, children }: { url: string; children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="Dialog">
        <DialogClose className="float-end rounded-lg border-2 border-black p-2">
          <p>Close</p>
        </DialogClose>

        <DialogDescription className="flex w-full flex-col items-center gap-4 pt-4">
          <Image
            src={url}
            alt="house"
            className="w-auto object-cover"
            width={400}
            height={400}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function PdfDialog({ url, children }: { url: string; children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="Dialog">
        <DialogClose className="float-end rounded-lg border-2 border-black p-2">
          <p>Close</p>
        </DialogClose>

        <DialogDescription className="flex w-full flex-col items-center gap-4 pt-4">
          <object type="application/pdf" data={url}></object>
          <iframe src={url} className="h-96 w-full" />
          <embed src={url} className="" />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

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
  allFolders,
  file,
  updateFile,
  StandardComponent,
  url,
  editable,
}: {
  value: string;
  EditModeComponent: EditModeComponent;
  updateValue: (value: string) => Promise<void>;
  allFolders: Folder[];
  file: Files[number];
  updateFile: UpdateFileServerAction;
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
        allFolders={allFolders}
        file={file}
        updateFile={updateFile}
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
    <div className="inline-block  flex	 justify-between	">
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
  allFolders: Folder[];
  file: Files[number];
  updateFile: UpdateFileServerAction;
  EditableComponent: ReactNode;
}> = ({
  onClickConfirm,
  onClickCancel,
  EditableComponent,
  allFolders,
  file,
  updateFile,
}) => {
  return (
    <div>
      {EditableComponent}
      <div className="flex flex-nowrap justify-around pt-2">
        <MoveButtonPopover
          allFolders={allFolders}
          file={file}
          updateFile={updateFile}
          onClickCancel={onClickCancel}
        />
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
    </div>
  );
};

function MoveButtonPopover({
  allFolders,
  file,
  updateFile,
  onClickCancel,
}: {
  allFolders: Folder[];
  file: Files[number];
  updateFile: UpdateFileServerAction;
  onClickCancel: () => void;
}) {
  const allOtherFolders = allFolders.filter(
    (folder) => folder.id !== file.folderId,
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex rounded-full border-2 border-black p-2 text-sm font-semibold">
          <MoveIcon />
          Move
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg border-2 border-dark bg-light p-4 shadow-lg">
        <PopoverHeading>Choose a Folder to Move the File to</PopoverHeading>
        <PopoverDescription className="flex flex-col items-center gap-4 pt-5">
          <div className="grid w-full gap-4">
            {allOtherFolders.map((folder) => (
              <MoveToFolderButton
                folder={folder}
                updateFile={updateFile}
                key={folder.id}
                onClickCancel={onClickCancel}
              />
            ))}
          </div>
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

function MoveToFolderButton({
  folder,
  updateFile,
  onClickCancel,
}: {
  folder: Folder;
  updateFile: UpdateFileServerAction;
  onClickCancel: () => void;
}) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      name={folder.id}
      onClick={(e) => {
        updateFile({ folderId: folder.id });
        setOpen(false);
        onClickCancel();
      }}
      className="flex w-full rounded-full bg-slate-300 p-2"
    >
      <FolderIcon />
      {folder.name}
    </button>
  );
}
