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
  commonTasks,
}: {
  homeownerId: string;
  propertyId: string;
  commonTasks: CommonTask[];
}) {
  return (
    <div>
      <CTAButton rounded className="w-full" onClick={() => {}}>
        Create Custom Task
      </CTAButton>
      <h1>Common Tasks</h1>
      <div className="grid gap-4">
        {commonTasks.map((commonTask) => {
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

  const { pending } = useFormStatus();

  const createItem = async (formState: FormState, formData: FormData) => {
    try {
      const result = addTaskSchema.parse({
        title: formData.get("title") as string,
        recurring: (formData.get("recurring") as string) === "1",
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
      <input type="hidden" name="recurring" value={1} />
      <input type="hidden" name="schedule" value={commonTask.schedule} />
      <input type="hidden" name="homeownerId" value={homeownerId} />
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="commonTaskId" value={commonTask.id} />
      <ErrorMessage error={state.error} errorMessage={state.message} />
      <CommonTaskButton title={commonTask.title} pending={pending} />
    </form>
  );
}

function CommonTaskButton({
  title,
  pending,
}: {
  title: string;
  pending: boolean;
}) {
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

export function AddItemForm({
  homeownerId,
  propertyId,
}: {
  homeownerId: string;
  propertyId: string;
}) {
  const [category, setCategory] = useState("job");

  const { pending } = useFormStatus();

  const router = useRouter();

  const createItem = async (formState: FormState, formData: FormData) => {
    try {
      const result = addTaskSchema.parse({
        title: formData.get("title") as string,
        status: formData.get("status") as string,
        category: formData.get("category") as string,
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
      <Category setCategory={setCategory} />
      <Status category={category} />

      <CTAButton rounded className="mt-8 w-full" loading={pending}>
        {pending ? "Adding Item..." : "Add Item"}
      </CTAButton>
      <ErrorMessage error={state.error} errorMessage={state.message} />
      <input type="hidden" name="homeownerId" value={homeownerId} />
      <input type="hidden" name="propertyId" value={propertyId} />
    </form>
  );
}

function Status({ category }: { category: string }) {
  if (category === "issue") {
    return (
      <div className="hidden">
        <label htmlFor="status" className="text-lg">
          Status
        </label>
        <select
          id="status"
          name="status"
          size={1}
          className="rounded-full bg-altSecondary/70 p-6"
          value={"todo"}
        >
          <option value="todo">To Do</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    );
  } else if (category === "product") {
    return (
      <div className="hidden">
        <label htmlFor="status" className="text-lg">
          Status
        </label>
        <select
          id="status"
          name="status"
          size={1}
          className="rounded-full bg-altSecondary/70 p-6"
          value={"completed"}
        >
          <option value="todo">To Do</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    );
  }
  return (
    <>
      <label htmlFor="status" className="text-lg">
        Status
      </label>
      <select
        id="status"
        name="status"
        size={1}
        className="rounded-full bg-altSecondary/70 p-6"
      >
        <option value="todo">To Do</option>
        <option value="completed">Completed</option>
      </select>
    </>
  );
}

function Category({
  setCategory,
}: {
  setCategory: Dispatch<SetStateAction<string>>;
}) {
  return (
    <>
      <label htmlFor="category" className="text-lg">
        Category
      </label>
      <select
        id="category"
        name="category"
        size={1}
        className="rounded-full bg-altSecondary/70 p-6"
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option value="job">Job</option>
        <option value="product">Product</option>
        <option value="issue">Issue</option>
      </select>
    </>
  );
}
