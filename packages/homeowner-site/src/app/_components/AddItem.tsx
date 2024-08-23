"use client";

import { useFormStatus, useFormState } from "react-dom";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import {
  FormState,
  addTaskSchema,
  emptyFormState,
  fromErrorToFormState,
} from "../../../../core/homeowner/forms";
import { createTaskAction } from "../actions";
import { ErrorMessage } from "../../../../ui/Atoms/Text";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import {
  LoadingIcon,
  PlusIcon,
  SmallPlusIcon,
  TickIcon,
} from "../../../../ui/Atoms/Icons";
import { RecurringSchedule } from "../../../../core/db/schema";
import clsx from "clsx";
import Link from "next/link";
import { EditableComponentLabel } from "../../../../ui/Molecules/InPlaceEditableComponent";
import { date } from "drizzle-orm/mysql-core";

export type CommonTask = {
  title: string;
  recurring: boolean;
  schedule: RecurringSchedule;
  exists: boolean;
  id: string;
};

export default function AddItem({
  homeownerId,
  propertyId,
  interiorCommonTasks,
  exteriorCommonTasks,
}: {
  homeownerId: string;
  propertyId: string;
  interiorCommonTasks: CommonTask[];
  exteriorCommonTasks: CommonTask[];
}) {
  return (
    <div className="justify-around p-2 md:flex">
      <div className="md:hidden">
        <Link href={`/properties/${propertyId}/add/custom`}>
          <CTAButton rounded className="w-full" onClick={() => {}}>
            Create Task
          </CTAButton>
        </Link>
        <p className="text-center">Create your own custom task</p>
      </div>
      <div className="hidden md:block">
        <p className="text-center">Create your own custom task</p>
        <div className="p-4"></div>
        <AddTaskForm propertyId={propertyId} homeownerId={homeownerId} />
      </div>
      <div>
        <p className="p-2 text-center font-semibold">OR</p>
      </div>
      <div>
        <p className="pb-4 text-center">Quickly add from common tasks below</p>
        <h1 className="p-2 text-center text-2xl font-bold">Common Tasks</h1>
        <div className="grid gap-4">
          <h2 className="text-center text-xl font-semibold">Interior</h2>
          {interiorCommonTasks.map((commonTask) => {
            if (commonTask.exists) {
              return (
                <div className=" flex items-center justify-center gap-2 rounded-full border-4 border-green-600 p-2">
                  <TickIcon colour="#16a34a" />
                  <p className="text-lg font-semibold text-green-600">
                    {commonTask.title}
                  </p>
                </div>
              );
            }
            return (
              <AddCommonTask
                key={commonTask.title}
                commonTask={commonTask}
                homeownerId={homeownerId}
                propertyId={propertyId}
              />
            );
          })}
          <h2 className="text-center text-xl font-semibold">Exterior</h2>
          {exteriorCommonTasks.map((commonTask) => {
            if (commonTask.exists) {
              return (
                <div className=" flex items-center justify-center gap-2 rounded-full border-4 border-green-600 p-2">
                  <TickIcon colour="#16a34a" />
                  <p className="text-lg font-semibold text-green-600">
                    {commonTask.title}
                  </p>
                </div>
              );
            }
            return (
              <AddCommonTask
                key={commonTask.title}
                commonTask={commonTask}
                homeownerId={homeownerId}
                propertyId={propertyId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AddCommonTask({
  commonTask,
  homeownerId,
  propertyId,
}: {
  commonTask: CommonTask;
  homeownerId: string;
  propertyId: string;
}) {
  const router = useRouter();

  const createItem = async (formState: FormState, formData: FormData) => {
    try {
      const result = addTaskSchema.parse({
        title: formData.get("title") as string,
        recurring: (formData.get("recurring") as string) === "true",
        schedule: formData.get("schedule") as string,
        homeownerId: formData.get("homeownerId") as string,
        propertyId: formData.get("propertyId") as string,
        commonTaskId: formData.get("commonTaskId") as string,
      });
      console.log(result);
      createTaskAction(result)
        .then((itemId) => {
          router.push(`/properties/${result.propertyId}/add/${itemId}`);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      return fromErrorToFormState(error);
    }

    return {
      error: false,
      message: "Item created successfully",
      fieldErrors: {},
    };
  };

  const [state, formAction] = useFormState(createItem, emptyFormState);

  return (
    <form action={formAction}>
      <input type="hidden" name="title" value={commonTask.title} />
      <input type="hidden" name="recurring" value="true" />
      <input type="hidden" name="schedule" value={commonTask.schedule} />
      <input type="hidden" name="homeownerId" value={homeownerId} />
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="commonTaskId" value={commonTask.id} />
      <ErrorMessage error={state.error} errorMessage={state.message} />
      <CommonTaskButton title={commonTask.title} />
    </form>
  );
}

function CommonTaskButton({ title }: { title: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={clsx(
        "flex w-full items-center justify-center gap-2 rounded-full border-4 border-brandSecondary p-2 text-lg font-semibold text-brandSecondary",
        pending && "bg-brandSecondary/30",
      )}
    >
      {pending ? (
        <LoadingIcon />
      ) : (
        <>
          <SmallPlusIcon colour="#c470e7" />
          {title}
        </>
      )}
    </button>
  );
}

export function AddTaskForm({
  homeownerId,
  propertyId,
}: {
  homeownerId: string;
  propertyId: string;
}) {
  const [isRecurring, setIsRecurring] = useState(true);

  const router = useRouter();

  const createItem = async (formState: FormState, formData: FormData) => {
    try {
      console.log("formData", formData.get("date"));
      const result = addTaskSchema.parse({
        title: formData.get("title") as string,
        recurring: (formData.get("recurring") as string) === "recurring",
        date: formData.get("date") as string,
        schedule: formData.get("schedule") as string,
        homeownerId: formData.get("homeownerId") as string,
        propertyId: formData.get("propertyId") as string,
      });
      console.log(result);
      createTaskAction(result)
        .then((itemId) => {
          router.push(`/properties/${result.propertyId}/add/${itemId}`);
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      return fromErrorToFormState(error);
    }

    return {
      error: false,
      message: "Item created successfully",
      fieldErrors: {},
    };
  };

  const [state, formAction] = useFormState(createItem, emptyFormState);

  return (
    <form className="flex max-w-96 flex-col gap-4" action={formAction}>
      <TextInputWithError
        label="Title"
        name="title"
        error={!!state.fieldErrors["title"]?.[0]}
        errorMessage={state.fieldErrors["title"]?.[0]}
      />
      <DateInput />
      <Recurring setIsRecuring={setIsRecurring} />
      {isRecurring ? (
        <ScheduleInput />
      ) : (
        <input type="hidden" name="schedule" value={RecurringSchedule.YEARLY} />
      )}
      <CreateTaskButton />
      <ErrorMessage error={state.error} errorMessage={state.message} />
      <input type="hidden" name="homeownerId" value={homeownerId} />
      <input type="hidden" name="propertyId" value={propertyId} />
    </form>
  );
}

function Recurring({
  setIsRecuring,
}: {
  setIsRecuring: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <p className="pb-2 text-lg">Recurring or One Time</p>
      <div className="flex justify-between">
        <input
          type="radio"
          id="recurring"
          name="recurring"
          value="recurring"
          className="peer/recurring hidden"
          defaultChecked
          onChange={(e) => {
            setIsRecuring(e.target.checked);
            console.log(e.target.checked);
          }}
        />
        <label
          htmlFor="recurring"
          className="cursor-pointer rounded border-2 border-brandSecondary p-2 text-lg peer-checked/recurring:bg-brandSecondary/50 peer-checked/recurring:font-bold"
        >
          Recurring
        </label>
        <input
          type="radio"
          id="one-time"
          name="recurring"
          value="one-time"
          className="peer/one-time hidden"
          onChange={(e) => {
            setIsRecuring(!e.target.checked);
            console.log(!e.target.checked);
          }}
        />
        <label
          htmlFor="one-time"
          className="cursor-pointer rounded border-2 border-brandSecondary p-2 text-lg peer-checked/one-time:bg-brandSecondary/50 peer-checked/one-time:font-bold"
        >
          One Time
        </label>
      </div>
    </>
  );
}

function DateInput({}: {}) {
  const todaysDate = new Date();
  const dateString = `${todaysDate.getFullYear()}-${todaysDate.getMonth() < 9 ? "0" : ""}${todaysDate.getMonth() + 1}-${todaysDate.getDate() < 10 ? "0" : ""}${todaysDate.getDate()}`;
  return (
    <div className="w-full pb-4">
      <p className="text-lg">Date</p>
      <div className="flex w-full items-center justify-center pt-2 text-lg">
        <input type="date" defaultValue={dateString} name="date" />
      </div>
    </div>
  );
}

function ScheduleInput({}: {}) {
  return (
    <div className="peer-checked/recurring:hidden">
      <p className="pb-2 text-lg">Schedule</p>
      <select
        id="schedule"
        name="schedule"
        size={1}
        className="w-full rounded-full bg-altSecondary/70 p-6 capitalize"
        defaultValue={RecurringSchedule.YEARLY}
      >
        {Object.values(RecurringSchedule).map((schedule) => (
          <option key={schedule} value={schedule} className="capitalize">
            {schedule}
          </option>
        ))}
      </select>
    </div>
  );
}

function CreateTaskButton() {
  const { pending } = useFormStatus();
  return (
    <CTAButton rounded className="mt-8 w-full" loading={pending}>
      {pending ? "Adding Task..." : "Add Task"}
    </CTAButton>
  );
}
