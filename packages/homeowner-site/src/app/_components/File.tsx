"use client";

import clsx from "clsx";
import Image from "next/image";
import { type Files } from "../../../../core/homeowner/item";
import {
  CancelIcon,
  ConfirmIcon,
  CrossIcon,
  DeleteIcon,
  EditIconSmall,
  FolderIcon,
  MoveIcon,
  OptionsIcon,
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
import { EditableComponentNoButton } from "../../../../ui/Molecules/InPlaceEditableComponent";

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
  isThumbnail = false,
}: {
  url: string;
  file: Files[number];
  updateFile: UpdateFileServerAction;
  allFolders: Folder[];
  isThumbnail?: boolean;
}) {
  if (!!isThumbnail) {
    return (
      <MobileFileListView
        url={url}
        file={file}
        updateFile={updateFile}
        allFolders={allFolders}
      />
    );
  }

  return (
    <MobileFileListView
      url={url}
      file={file}
      updateFile={updateFile}
      allFolders={allFolders}
    />
  );
}

function FileMenu({
  onRename,
  allFolders,
  file,
  updateFile,
}: {
  onRename: () => void;
  allFolders: Folder[];
  file: Files[number];
  updateFile: UpdateFileServerAction;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-1">
          <OptionsIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg border-2 border-dark bg-light p-4 shadow-lg">
        <PopoverDescription className="flex flex-col items-start gap-4 pt-5">
          <button onClick={onRename} className="flex">
            <EditIconSmall width={20} height={20} />{" "}
            <span className="pl-2">Rename</span>
          </button>

          <MoveButtonPopover
            allFolders={allFolders}
            file={file}
            updateFile={updateFile}
            onClickCancel={() => {}}
          />

          <DeleteButtonDialog />
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

function DeleteButtonDialog({}: {}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex">
          <DeleteIcon width={20} height={20} />
          <span className="pl-2">Delete</span>
        </button>
      </DialogTrigger>
      <DialogContent className="Dialog">
        <DialogClose className="float-end rounded-lg border-2 border-black p-2">
          <p>Close</p>
        </DialogClose>

        <DialogDescription className="flex  flex-col items-center gap-4 p-2 pt-14">
          <div className="max-w-96">
            <p className="pb-4">Are you sure you want to delete this file?</p>
            <div className="flex w-full justify-between gap-4">
              <button className="flex rounded-md bg-slate-300 p-2 shadow-sm shadow-black">
                <CrossIcon />
                Cancel
              </button>
              <button className="flex rounded-md bg-red-400 p-2 shadow-sm shadow-black">
                <DeleteIcon />
                Delete
              </button>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function MobileFileListView({
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
  const [isEditMode, setIsEditMode] = useState(false);

  const isPdf = file.type.endsWith("pdf");

  return (
    <div className="flex text-left">
      {isPdf ? (
        <MobilePdfWithDialog url={url} size="list" />
      ) : (
        <MobileImageWithDialog url={url} size="list" />
      )}
      <EditableComponentNoButton
        value={file.name}
        updateValue={async (value: string) => updateFile({ name: value })}
        StandardComponent={StandardComponent}
        EditModeComponent={EditModeComponent}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
      />
      {!isEditMode && (
        <FileMenu
          onRename={() => setIsEditMode(true)}
          allFolders={allFolders}
          file={file}
          updateFile={updateFile}
        />
      )}
    </div>
  );
}

function MobileImageWithDialog({
  url,
  size,
}: {
  url: string;
  size: "list" | "thumbnail";
}) {
  return (
    <ImageDialog url={url}>
      <button
        onClick={() => {}}
        className={clsx(
          "relative  flex-none bg-slate-500",
          size === "list" && "h-10 w-10",
          size === "thumbnail" && "h-20 w-20",
        )}
      >
        <Image
          src={url}
          alt="house"
          className=""
          width={size === "list" ? 40 : 80}
          height={size === "list" ? 40 : 80}
          style={{ objectFit: "cover" }}
        />
      </button>
    </ImageDialog>
  );
}

function MobilePdfWithDialog({
  url,
  size,
}: {
  url: string;
  size: "list" | "thumbnail";
}) {
  return (
    <PdfDialog url={url}>
      <button
        onClick={() => {}}
        className={clsx(
          "relative  flex-none bg-slate-500",
          size === "list" && "h-10 w-10",
          size === "thumbnail" && "h-20 w-20",
        )}
      >
        <PdfFileIcon />
      </button>
    </PdfDialog>
  );
}

function StandardComponent({
  value,
  pending,
}: {
  value: string;
  pending?: boolean;
}) {
  return (
    <p
      className={clsx(
        " w-full break-all	px-2 text-sm ",
        pending && "text-slate-500",
      )}
    >
      {value}
    </p>
  );
}

function EditModeComponent({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <input
      type="text"
      className=" w-full min-w-20  grow rounded-lg border-2 border-slate-400 p-2 text-sm"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
}

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
        <button className="flex">
          <MoveIcon width={20} height={20} />
          <span className="pl-2">Move File</span>
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
