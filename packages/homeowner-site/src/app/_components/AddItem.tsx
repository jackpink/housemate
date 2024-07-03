"use client";

import { useFormStatus, useFormState } from "react-dom";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import {
  FormState,
  addItemSchema,
  emptyFormState,
  fromErrorToFormState,
} from "../../../../core/homeowner/forms";
import { createItemAction } from "../actions";
import { ErrorMessage } from "../../../../ui/Atoms/Text";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export default function AddItem({
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
      const result = addItemSchema.parse({
        title: formData.get("title") as string,
        status: formData.get("status") as string,
        category: formData.get("category") as string,
        homeownerId: formData.get("homeownerId") as string,
        propertyId: formData.get("propertyId") as string,
      });
      console.log(result);
      createItemAction(result)
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
