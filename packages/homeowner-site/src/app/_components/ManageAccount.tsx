"use client";

import clsx from "clsx";
import {
  EditModeComponent,
  EditableComponent,
  EditableComponentLabel,
  StandardComponent,
} from "../../../../ui/Molecules/InPlaceEditableComponent";
import { User } from "../../../../core/homeowner/user";
import {
  deleteAccountAction,
  signOutAction,
  updatePasswordAction,
  updatePasswordWithCurrentPasswordAction,
  updateUser,
} from "../actions";
import {
  CTAButton,
  DeleteButtonWithDialog,
  DeleteButtonWithDialogAndTextConfirmation,
} from "../../../../ui/Atoms/Button";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ErrorMessage } from "../../../../ui/Atoms/Text";
import {
  FormState,
  emptyFormState,
  fromErrorToFormState,
  updatePasswordSchema,
} from "../../../../core/homeowner/forms";
import { DeleteIcon } from "../../../../ui/Atoms/Icons";

export function GeneralSettings({
  user,
  deviceType,
}: {
  user: User;
  deviceType: "mobile" | "desktop";
}) {
  return (
    <div className="flex w-full flex-col items-center p-2">
      <div className="flex w-full  py-2">
        <EditableComponentLabel label="Email: " />
        <p className="pl-2 text-lg">{user.email}</p>
      </div>

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

      <ChangePassword userId={user.id} />
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

function ChangePassword({ userId }: { userId: string }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const { pending } = useFormStatus();

  const [state, formAction] = useFormState(updatePassword, emptyFormState);

  return (
    <form action={formAction}>
      <TextInputWithError
        label="Current Password"
        name="currentPassword"
        type={showPassword ? "text" : "password"}
        error={!!state.fieldErrors["currentPassword"]?.[0]}
        errorMessage={state.fieldErrors["currentPassword"]?.[0]}
      />
      <button className="flex w-full justify-end p-2 text-slate-600">
        <input
          type="checkbox"
          className="mr-2"
          onChange={() => setShowPassword(!showPassword)}
          name="showPassword"
          id="showPassword"
        />
        <label htmlFor="showPassword">Show Password</label>
      </button>
      <TextInputWithError
        label="New Password"
        name="password"
        type={showPassword ? "text" : "password"}
        error={!!state.fieldErrors["password"]?.[0]}
        errorMessage={state.fieldErrors["password"]?.[0]}
      />

      <TextInputWithError
        label="Confirm New Password"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        error={!!state.fieldErrors["confirmPassword"]?.[0]}
        errorMessage={state.fieldErrors["confirmPassword"]?.[0]}
      />
      <input type="hidden" name="userId" value={userId} />
      <CTAButton
        rounded
        className="w-full"
        error={state.error}
        loading={pending}
      >
        Update Password
      </CTAButton>
      <ErrorMessage error={state.error} errorMessage={state.message} />
    </form>
  );
}

const updatePassword = async (
  state: any,
  formData: FormData,
): Promise<FormState> => {
  let result;

  try {
    result = updatePasswordSchema.parse({
      currentPassword: formData.get("currentPassword"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      userId: formData.get("userId"),
    });

    console.log("new user");
    await updatePasswordWithCurrentPasswordAction({
      currentPassword: result.currentPassword,
      newPassword: result.password,
      userId: result.userId,
    });
  } catch (error) {
    console.error("Error signing up", error);
    return fromErrorToFormState(error);
  }

  return {
    error: false,
    message: "Success",
    fieldErrors: {},
  };
};

/*
########################################################################
########################################################################
Alert Settings
########################################################################
########################################################################
*/

export function AlertSettings({
  user,
  deviceType,
}: {
  user: User;
  deviceType: "mobile" | "desktop";
}) {
  const warrantyAlertValue = getAlertString(user.warrantyAlert);
  const taskReminderValue = getAlertString(user.taskReminder);
  const taskOverdueValue = getAlertString(user.taskOverdueReminder);
  return (
    <div className="flex w-full flex-col items-center p-2">
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
      <EditableComponent
        value={taskOverdueValue}
        EditModeComponent={EditableTaskOverdueReminder}
        StandardComponent={TaskOverdueReminder}
        updateValue={async (value: string) => {
          updateUser({
            id: user.id,
            taskOverdueReminder: getAlertNumber(value),
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
      <EditableComponentLabel label={"Task Reminder Alerts:"} />
      <p className={clsx("p-2 text-xl ", pending && "text-slate-500")}>
        {value}
      </p>
    </div>
  );
};

const EditableTaskReminder: EditModeComponent = ({ value, setValue }) => {
  return (
    <div className="w-full items-center md:flex">
      <EditableComponentLabel label="Task Reminder Alerts:" />
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

const TaskOverdueReminder: StandardComponent = ({ value, pending }) => {
  return (
    <div className="flex w-full items-center ">
      <EditableComponentLabel label="Task Overdue Alerts:" />
      <p className={clsx("p-2 text-xl ", pending && "text-slate-500")}>
        {value}
      </p>
    </div>
  );
};

const EditableTaskOverdueReminder: EditModeComponent = ({
  value,
  setValue,
}) => {
  return (
    <div className="w-full items-center md:flex">
      <EditableComponentLabel label="Task Overdue Alerts:" />
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

export function DeleteAccountButton({ userId }: { userId: string }) {
  const onDelete = () => {
    console.log("delete account");
    deleteAccountAction({ userId: userId });
    signOutAction();
  };
  return (
    <DeleteButtonWithDialogAndTextConfirmation
      label="Account"
      onDelete={onDelete}
    >
      <button className="flex">
        <DeleteIcon width={20} height={20} />
        <span className="pl-2">Delete Account</span>
      </button>
    </DeleteButtonWithDialogAndTextConfirmation>
  );
}
