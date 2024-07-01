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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
  useDialogContext,
} from "../../../../ui/Atoms/Dialog";
import {
  EditableComponentLabel,
  EditableComponentNoButton,
} from "../../../../ui/Molecules/InPlaceEditableComponent";
import {
  FormState,
  emptyFormState,
  fromErrorToFormState,
} from "../../../../core/homeowner/forms";
import { createFolderForItem } from "../actions";
import { useFormState } from "react-dom";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { z } from "zod";
import { useState } from "react";
import clsx from "clsx";

export type UpdateFolderServerAction = ({}: {
  name: string;
  folderId: string;
  itemId: string;
}) => Promise<void>;

export default function Folder({
  folder,
  children,
  propertyId,
  itemId,
  updateFolder,
}: {
  folder: Folder;
  children: React.ReactNode;
  propertyId: string;
  itemId: string;
  updateFolder: UpdateFolderServerAction;
}) {
  const [isEditMode, setIsEditMode] = useState(false);

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
          <EditableComponentNoButton
            value={folder.name}
            updateValue={async (value: string) =>
              updateFolder({ name: value, folderId: folder.id, itemId })
            }
            StandardComponent={StandardComponent}
            EditModeComponent={EditModeComponent}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        </div>
        {!isEditMode && (
          <FolderMenu
            folderId={folder.id}
            propertyId={propertyId}
            itemId={itemId}
            onRename={() => setIsEditMode(true)}
          />
        )}
      </summary>

      <div className="grid gap-4 py-2 pl-4 transition-all duration-300 ease-in-out">
        {children}
      </div>
    </details>
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
        " break-word w-full	px-2 text-sm ",
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

function FolderMenu({
  folderId,
  propertyId,
  itemId,
  onRename,
}: {
  folderId: string;
  propertyId: string;
  itemId: string;
  onRename: () => void;
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
          <button className="flex">
            <MoveIcon width={20} height={20} />{" "}
            <span className="pl-2">Move Files</span>
          </button>
          <AddFolder
            folderId={folderId}
            propertyId={propertyId}
            itemId={itemId}
          />
          <button className="flex">
            <UploadIcon width={20} height={20} />
            <span className="pl-2">Upload Files</span>
          </button>
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}

/* ############################################################## */

function AddFolder({
  folderId,
  propertyId,
  itemId,
}: {
  folderId: string;
  propertyId: string;
  itemId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <AddFolderButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="Dialog">
        <DialogClose className="float-end rounded-lg border-2 border-black p-2">
          <p>Close</p>
        </DialogClose>
        <DialogHeading className="pt-3 text-xl">New Folder</DialogHeading>
        <DialogDescription className="flex w-full flex-col items-center gap-4 pt-4">
          <EditableComponentLabel label="Folder Name" />
          <AddFolderFormMobile
            parentFolderId={folderId}
            propertyId={propertyId}
            itemId={itemId}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function AddFolderFormMobile({
  parentFolderId,
  propertyId,
  itemId,
}: {
  parentFolderId: string;
  propertyId: string;
  itemId: string;
}) {
  const { setOpen } = useDialogContext();
  const createFolder = async (
    state: any,
    formData: FormData,
  ): Promise<FormState> => {
    let result;

    try {
      result = addFolderSchema.parse({
        name: formData.get("name"),
        parentId: formData.get("parentId"),
        propertyId: formData.get("propertyId"),
        itemId: formData.get("itemId"),
      });

      console.log("new folder", result.name);
    } catch (error) {
      console.error("Error signing up", error);
      return fromErrorToFormState(error);
    }
    await createFolderForItem(result);

    //close the dialog
    setOpen(false);

    return {
      error: false,
      message: "Success",
      fieldErrors: {},
    };
  };

  const [state, formAction] = useFormState(createFolder, emptyFormState);

  return (
    <>
      <EditableComponentLabel label="Folder Name" />
      <form action={formAction}>
        <TextInputWithError
          label="Folder Name"
          name="name"
          error={!!state.fieldErrors["name"]?.[0]}
          errorMessage={state.fieldErrors["name"]?.[0]}
        />
        <input
          type="text"
          value={parentFolderId}
          name="parentId"
          id="parentId"
          hidden
          readOnly
        />
        <input
          type="text"
          value={propertyId}
          name="propertyId"
          id="propertyId"
          hidden
          readOnly
        />
        <input type="text" value={itemId} name="itemId" id="itemId" hidden />

        <CTAButton rounded>Create Folder</CTAButton>
      </form>
    </>
  );
}

function AddFolderButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex">
      <PlusIcon width={20} height={20} />{" "}
      <span className="pl-2">Add Folder</span>
    </button>
  );
}

export const addFolderSchema = z.object({
  name: z.string().min(1),
  parentId: z.string().min(1),
  propertyId: z.string().min(1),
  itemId: z.string().min(1),
});

// const createFolder = async (
//   state: any,
//   formData: FormData,
// ): Promise<FormState> => {
//   let result;

//   try {
//     result = addFolderSchema.parse({
//       name: formData.get("name"),
//       parentId: formData.get("parentId"),
//       propertyId: formData.get("propertyId"),
//       itemId: formData.get("itemId"),
//     });

//     console.log("new folder", result.name);
//   } catch (error) {
//     console.error("Error signing up", error);
//     return fromErrorToFormState(error);
//   }
//   await createFolderForItem(result);

//   return {
//     error: false,
//     message: "Success",
//     fieldErrors: {},
//   };
// };
