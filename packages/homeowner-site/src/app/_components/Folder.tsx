"use client";

import { type Folder } from "../../../../core/homeowner/item";
import {
  DropDownIcon,
  EditIconSmall,
  FolderIcon,
  LargeAddIcon,
  MoveIcon,
  OptionsIcon,
  PlusIcon,
  UploadIcon,
} from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTrigger,
} from "../../../../ui/Atoms/Popover";

export default function Folder({
  folder,
  children,
}: {
  folder: Folder;
  children: React.ReactNode;
}) {
  return (
    <details
      className="group cursor-pointer border-b border-slate-300 pt-2 "
      open
    >
      <summary className="flex items-center justify-between rounded-md bg-slate-300 p-2 capitalize transition-all duration-500 ease-out group-open:mb-10">
        <span className="transition group-open:rotate-180">
          <DropDownIcon />
        </span>
        <div className="flex grow items-center pl-4">
          <FolderIcon width={20} height={20} />
          <Text>{folder.name}</Text>
        </div>
        <FolderMenu />
      </summary>

      <div className="grid gap-4 py-2 pl-4 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </details>
  );
}

function FolderMenu({}: {}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-1">
          <OptionsIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="rounded-lg border-2 border-dark bg-light p-4 shadow-lg">
        <PopoverDescription className="flex flex-col items-start gap-4 pt-5">
          <button className="flex">
            <EditIconSmall width={20} height={20} />{" "}
            <span className="pl-2">Rename</span>
          </button>
          <button className="flex">
            <MoveIcon width={20} height={20} />{" "}
            <span className="pl-2">Move Files</span>
          </button>
          <button className="flex">
            <PlusIcon width={20} height={20} />{" "}
            <span className="pl-2">Add Folder</span>
          </button>
          <button className="flex">
            <UploadIcon width={20} height={20} />
            <span className="pl-2">Upload Files</span>
          </button>
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
