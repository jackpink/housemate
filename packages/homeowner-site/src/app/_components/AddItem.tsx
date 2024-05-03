"use client";

import { useFormState } from "react-dom";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import { addItemSchema } from "../../../../core/homeowner/forms";
import { ZodError } from "zod";

type FormState = {
  error: boolean;
  message?: string;
  fieldErrors: Record<string, string[] | undefined>;
};

const emptyFormState: FormState = {
  error: false,
  message: "",
  fieldErrors: {},
};

export default function AddItem() {
  const [state, formAction] = useFormState(createItem, emptyFormState);
  const title = "title";

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      <TextInputWithError
        label="Title"
        name={title}
        error={!!state.fieldErrors["title"]?.[0]}
        errorMessage={state.fieldErrors["title"]?.[0]}
      />
      <Status />
      <Category />
      <CTAButton rounded className="mt-8 w-full">
        Add Item
      </CTAButton>
    </form>
  );
}

function Status() {
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
        <option value="ToDo">To Do</option>
        <option value="Completed">Completed</option>
      </select>
    </>
  );
}

function Category() {
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
      >
        <option value="Job">Job</option>
        <option value="Product">Product</option>
        <option value="Issue">Issue</option>
      </select>
    </>
  );
}

const fromErrorToFormState = (error: unknown) => {
  if (error instanceof ZodError) {
    return {
      error: true,
      fieldErrors: error.flatten().fieldErrors,
    };
  } else if (error instanceof Error) {
    return {
      error: true,
      message: error.message,
      fieldErrors: {},
    };
  } else {
    return {
      error: true,
      message: "An unknown error occurred",
      fieldErrors: {},
    };
  }
};

const createItem = async (formState: FormState, formData: FormData) => {
  try {
    const result = addItemSchema.parse({
      title: formData.get("title") as string,
      status: formData.get("status") as string,
      category: formData.get("category") as string,
    });
    console.log(result);
  } catch (error) {
    return fromErrorToFormState(error);
  }

  return {
    error: false,
    message: "Item created successfully",
    fieldErrors: {},
  };
};
