"use client";

import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import { useFormState } from "react-dom";
import React from "react";
import { CTAButton } from "../../../../ui/Atoms/Button";
import {
  FormState,
  emptyFormState,
  fromErrorToFormState,
  signInSchema,
} from "../../../../core/homeowner/forms";
import Link from "next/link";
import { signInAction } from "../actions";
import { ErrorMessage } from "../../../../ui/Atoms/Text";

export function SignInForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, formAction] = useFormState(AttemptSignIn, emptyFormState);

  return (
    <form action={formAction}>
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
      <CTAButton rounded className="w-full" error={state.error}>
        Sign In
      </CTAButton>
      <ErrorMessage error={state.error} errorMessage={state.message} />
    </form>
  );
}

const AttemptSignIn = async (
  state: FormState,
  formData: FormData,
): Promise<FormState> => {
  try {
    const result = signInSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    console.log("Try to sign in ", result.email, result.password);
    await signInAction(result.email, result.password);
  } catch (error) {
    console.error("Error signing in", error);
    return fromErrorToFormState(error);
  }

  return {
    error: false,
    message: "Success",
    fieldErrors: {},
  };
};
