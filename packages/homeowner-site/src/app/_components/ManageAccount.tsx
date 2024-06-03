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
import { CTAButton } from "../../../../ui/Atoms/Button";

export function GeneralSettings({ user }: { user: User }) {
  return (
    <div className="flex w-screen flex-col items-center p-4">
      <div className="flex w-full justify-between p-2">
        <EditableComponentLabel label="Email: " />
        <p className="text-lg">{user.email}</p>
      </div>
      <CTAButton rounded>Change Primary Email</CTAButton>
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
      <div className="flex w-full justify-between p-2">
        <EditableComponentLabel label="Password: " />
      </div>
      <div className="flex w-full justify-between">
        <button className="rounded-full bg-brand p-4 text-lg font-semibold">
          Change Password
        </button>
        <button className="rounded-full bg-altSecondary p-4 text-lg font-semibold">
          Reset Password
        </button>
      </div>
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
    <div className="flex shrink items-center">
      <EditableComponentLabel label="First Name:" />
      <input
        type="text"
        className="w-full	 min-w-24 shrink rounded-lg border-2 border-slate-400 p-2 text-xl"
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
      <EditableComponentLabel label="Last Name:" />
      <input
        type="text"
        className="w-full min-w-24 shrink rounded-lg border-2 border-slate-400 p-2 text-xl"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
};

/*
########################################################################
########################################################################
Alert Settings
########################################################################
########################################################################
*/

export function AlertSettings({ user }: { user: User }) {
  const warrantyAlertValue = getAlertString(user.warrantyAlert);
  const taskReminderValue = getAlertString(user.taskReminder);
  const taskOverdueValue = getAlertString(user.taskOverdueReminder);
  return (
    <div className="flex w-full flex-col items-center p-4">
      <EditableComponent
        value={warrantyAlertValue}
        EditModeComponent={EditableWarranty}
        StandardComponent={Warranty}
        updateValue={async (value: string) => {
          updateUser({
            id: user.id,
            warrantyAlert: getAlertNumber(value),
          });
        }}
        editable
      />
      <EditableComponent
        value={taskReminderValue}
        EditModeComponent={EditableTaskReminder}
        StandardComponent={TaskReminder}
        updateValue={async (value: string) => {
          updateUser({
            id: user.id,
            taskReminder: getAlertNumber(value),
          });
        }}
        editable
      />
    </div>
  );
}

const Warranty: StandardComponent = ({ value, pending }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="Warranty Alerts:" />
      <p className={clsx("p-2 text-xl ", pending && "text-slate-500")}>
        {value}
      </p>
    </div>
  );
};

const EditableWarranty: EditModeComponent = ({ value, setValue }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="Warranty Alerts:" />
      <select
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
        size={1}
      >
        <option value="No Alert">No Alert</option>
        <option value="1 Week">1 Week</option>
        <option value="2 Weeks">2 Weeks</option>
        <option value="1 Month">1 Month</option>
        <option value="3 Months">3 Months</option>
        <option value="6 Months">6 Months</option>
      </select>
    </div>
  );
};
const TaskReminder: StandardComponent = ({ value, pending }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="Task Reminder:" />
      <p className={clsx("p-2 text-xl ", pending && "text-slate-500")}>
        {value}
      </p>
    </div>
  );
};

const EditableTaskReminder: EditModeComponent = ({ value, setValue }) => {
  return (
    <div className="flex w-full items-center">
      <EditableComponentLabel label="Task Reminder:" />
      <select
        onChange={(e) => setValue(e.currentTarget.value)}
        value={value}
        size={1}
      >
        <option value="No Alert">No Alert</option>
        <option value="1 Week">1 Week</option>
        <option value="2 Weeks">2 Weeks</option>
        <option value="1 Month">1 Month</option>
        <option value="3 Months">3 Months</option>
        <option value="6 Months">6 Months</option>
      </select>
    </div>
  );
};

function getAlertString(value: number) {
  switch (value) {
    case 0:
      return "No Alert";
    case 7:
      return "1 Week";
    case 14:
      return "2 Weeks";
    case 30:
      return "1 Month";
    case 90:
      return "3 Months";
    case 180:
      return "6 Months";
    default:
      return "No Alert";
  }
}

function getAlertNumber(value: string) {
  switch (value) {
    case "No Alert":
      return 0;
    case "1 Week":
      return 7;
    case "2 Weeks":
      return 14;
    case "1 Month":
      return 30;
    case "3 Months":
      return 90;
    case "6 Months":
      return 180;
    default:
      return 0;
  }
}
