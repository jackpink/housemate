"use client";

import { ParagraphText } from "../../../../ui/Atoms/Text";
import {
  InPlaceEditableComponent,
  InPlaceEditableComponentWithAdd,
} from "../../../../ui/Molecules/InPlaceEditableComponent";

export default function EditItem({ title }: { title: string }) {
  return (
    <>
      <InPlaceEditableComponent
        EditableComponent={<EditableTitle title={title} />}
        StandardComponent={<Title title={title} />}
        onConfirmEdit={() => console.log("confirm edit")}
        editable
      />
      <div className="w-full border-2 border-altSecondary"></div>
      <div className="flex flex-wrap-reverse items-center justify-center">
        <div className="m-2 flex w-full flex-col items-center justify-center lg:w-96 2xl:w-128">
          <InPlaceEditableComponentWithAdd
            title="Description"
            EditableComponent={<EditableDescription description="sd" />}
            StandardComponent={<Description description="sd" />}
            onConfirmEdit={() => console.log("confirm edit")}
            exists={false}
            editable
          />
        </div>
      </div>
    </>
  );
}

function Title({ title }: { title: string }) {
  return <h1 className="p-2 text-xl">{title}</h1>;
}

function EditableTitle({ title }: { title: string }) {
  return (
    <input
      type="text"
      className="rounded-lg border-2 border-slate-400 p-2 text-xl"
      value={title}
    />
  );
}

function Description({ description }: { description: string }) {
  return (
    <ParagraphText className="pl-10 text-xl font-normal">
      {description}
    </ParagraphText>
  );
}

function EditableDescription({ description }: { description: string }) {
  return (
    <textarea
      className="rounded-lg border-2 border-slate-400 p-2 text-xl"
      value={description}
    />
  );
}

function JobStatus({ status }: { status: string }) {
  return (
    <div>
      <EditableComponentLabel label="Status" />
    </div>
  );
}
