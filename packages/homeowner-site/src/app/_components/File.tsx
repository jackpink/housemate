"use client";

import {
  EditModeComponent,
  EditableComponent,
  StandardComponent,
} from "../../../../ui/Molecules/InPlaceEditableComponent";
import clsx from "clsx";
import { Text } from "../../../../ui/Atoms/Text";
import Image from "next/image";
import { type Files } from "../../../../core/homeowner/item";

export function MobileImage({
  url,
  file,
}: {
  url: string;
  file: Files[number];
}) {
  return (
    <div className="relative flex h-14 w-full items-center justify-center">
      <div className="w-14 ">
        <Image
          src={url}
          alt="house"
          className="h-full w-auto object-contain"
          width={56}
          height={56}
        />
      </div>
      <EditableComponent
        value={file.name}
        EditModeComponent={EditableTitle}
        StandardComponent={Title}
        updateValue={async (value: string) => console.log("update value")}
        editable
      />
    </div>
  );
}

const Title: StandardComponent = ({ value, pending }) => {
  return (
    <p className={clsx("p-2 text-sm", pending && "text-slate-500")}>{value}</p>
  );
};

const EditableTitle: EditModeComponent = ({ value, setValue }) => {
  return (
    <>
      <input
        type="text"
        className="absolute -left-0 w-28 rounded-lg  border-2 border-slate-400 p-2 text-sm"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <button className=" absolute left-32 rounded-full border-2 border-black p-2 text-sm font-semibold">
        Move
      </button>
    </>
  );
};
