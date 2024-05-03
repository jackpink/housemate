"use client";

import { useFormState } from "react-dom";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { ErrorMessage } from "../../../../ui/Atoms/Text";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import {
  FormState,
  emptyFormState,
  fromErrorToFormState,
  signUpSchema,
} from "../../../../core/homeowner/forms";
import React from "react";
import { signUp } from "../actions";
import Link from "next/link";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, formAction] = useFormState(createUser, emptyFormState);

  return (
    <>
      <form action={formAction} className="flex w-96 flex-col items-center">
        <TextInputWithError
          label="First Name"
          name="firstName"
          error={!!state.fieldErrors["firstName"]?.[0]}
          errorMessage={state.fieldErrors["firstName"]?.[0]}
        />
        <TextInputWithError
          label="Last Name"
          name="lastName"
          error={!!state.fieldErrors["lastName"]?.[0]}
          errorMessage={state.fieldErrors["lastName"]?.[0]}
        />
        <TextInputWithError
          label="Email"
          name="email"
          type="email"
          error={!!state.fieldErrors["email"]?.[0]}
          errorMessage={state.fieldErrors["email"]?.[0]}
        />
        <TextInputWithError
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          error={!!state.fieldErrors["password"]?.[0]}
          errorMessage={state.fieldErrors["password"]?.[0]}
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
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          error={!!state.fieldErrors["confirmPassword"]?.[0]}
          errorMessage={state.fieldErrors["confirmPassword"]?.[0]}
        />

        <CTAButton rounded>Create Account</CTAButton>
      </form>

      <ErrorMessage error={state.error} errorMessage={state.message} />
      <Link href="/sign-in" className="mt-2 block text-center">
        Already have an account? Sign in
      </Link>
    </>
  );
}

const createUser = async (
  state: any,
  formData: FormData,
): Promise<FormState> => {
  try {
    const result = signUpSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    console.log("new user", result.firstName);

    await signUp(result);
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
