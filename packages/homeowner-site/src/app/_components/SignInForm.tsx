"use client";

import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import { useFormState, useFormStatus } from "react-dom";
import React from "react";
import { CTAButton } from "../../../../ui/Atoms/Button";
import {
  FormState,
  emptyFormState,
  fromErrorToFormState,
  passwordResetEmailSchema,
  passwordResetSchema,
  signInSchema,
  updatePasswordSchema,
} from "../../../../core/homeowner/forms";
import Link from "next/link";
import {
  sendPasswordResetEmailAction,
  signInAction,
  updatePasswordAction,
} from "../actions";
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

export function SendPasswordResetEmailForm() {
  const { pending, data } = useFormStatus();

  const [state, formAction] = useFormState(
    sendPasswordResetEmail,
    emptyFormState,
  );

  return (
    <form action={formAction}>
      <TextInputWithError
        label="Email"
        name="email"
        type="email"
        error={!!state.fieldErrors["email"]?.[0]}
        errorMessage={state.fieldErrors["email"]?.[0]}
      />
      <CTAButton
        rounded
        className="w-full"
        error={state.error}
        loading={pending}
      >
        Send Reset Email
      </CTAButton>
      <ErrorMessage error={state.error} errorMessage={state.message} />
    </form>
  );
}

const sendPasswordResetEmail = async (
  state: any,
  formData: FormData,
): Promise<FormState> => {
  let result;

  try {
    result = passwordResetEmailSchema.parse({
      email: formData.get("email"),
    });

    await sendPasswordResetEmailAction({ email: result.email });
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

export function PasswordResetForm() {}

export function UpdatePassword({ userId }: { userId: string }) {
  const [showPassword, setShowPassword] = React.useState(false);

  const { pending } = useFormStatus();

  const [state, formAction] = useFormState(updatePassword, emptyFormState);

  return (
    <form action={formAction}>
      <TextInputWithError
        label="New Password"
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
    result = passwordResetSchema.parse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      userId: formData.get("userId"),
    });

    await updatePasswordAction({
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
