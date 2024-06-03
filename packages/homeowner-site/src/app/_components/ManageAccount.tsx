"use client";

import clsx from "clsx";
import {
  EditModeComponent,
  EditableComponent,
  EditableComponentLabel,
  StandardComponent,
} from "../../../../ui/Molecules/InPlaceEditableComponent";
import { User } from "../../../../core/homeowner/user";
import { updateUser } from "../actions";

export function GeneralSettings({ user }: { user: User }) {
  return (
    <div className="w-full p-4">
      <EditableComponent
        value={user.firstName}
        EditModeComponent={EditableFirstName}
        StandardComponent={FirstName}
        updateValue={async (value: string) =>
          updateUser({ id: user.id, firstName: value })
        }
        editable
      />
      <EditableComponent
        value={user.lastName}
        EditModeComponent={EditableLastName}
        StandardComponent={LastName}
        updateValue={async (value: string) =>
          updateUser({ id: user.id, lastName: value })
        }
        editable
      />
    </div>
  );
}

export function AlertSettings() {
  return (
    <div>
      <h1>Alerts</h1>
    </div>
  );
}

const FirstName: StandardComponent = ({ value, pending }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="First Name:" />
      <p className={clsx("p-2 text-xl ", pending && "text-slate-500")}>
        {value}
      </p>
    </div>
  );
};

const EditableFirstName: EditModeComponent = ({ value, setValue }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="First Name" />
      <input
        type="text"
        className="rounded-lg border-2 border-slate-400 p-2 text-xl"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
};

const LastName: StandardComponent = ({ value, pending }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="Last Name:" />
      <p className={clsx("p-2 text-xl ", pending && "text-slate-500")}>
        {value}
      </p>
    </div>
  );
};

const EditableLastName: EditModeComponent = ({ value, setValue }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="Last Name" />
      <input
        type="text"
        className="rounded-lg border-2 border-slate-400 p-2 text-xl"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
};
