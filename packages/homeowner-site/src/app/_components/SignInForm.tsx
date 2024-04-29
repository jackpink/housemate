"use client";

import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import { useFormState } from "react-dom";
import React from "react";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { signInSchema } from "../../../../core/homeowner/forms";
import Link from "next/link";
import { signInAction } from "../actions";

export function SignInForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, formAction] = useFormState(AttemptSignIn, {
    emailError: false,
    emailErrorMessage: "",
    passwordError: false,
    passwordErrorMessage: "",
  });
  return (
    <form action={formAction}>
      <TextInputWithError
        label="Email"
        name="email"
        type="email"
        error={state.emailError}
        errorMessage={state.emailErrorMessage}
      />
      <TextInputWithError
        label="Password"
        name="password"
        type={showPassword ? "text" : "password"}
        error={state.passwordError}
        errorMessage={state.passwordErrorMessage}
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
      <CTAButton rounded>Sign In</CTAButton>
      <Link href="/sign-up" className="mt-2 block text-center">
        Don't have an account? Sign up
      </Link>
    </form>
  );
}

const AttemptSignIn = async (state: any, formData: FormData) => {
  const result = signInSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!result.success) {
    const emailErrorMessage = result.error.issues.find(
      (issue) => issue.path[0] === "email",
    )?.message;
    const passwordErrorMessage = result.error.issues.find(
      (issue) => issue.path[0] === "password",
    )?.message;

    return {
      emailError: !!emailErrorMessage,
      emailErrorMessage: emailErrorMessage ?? "",
      passwordError: !!passwordErrorMessage,
      passwordErrorMessage: passwordErrorMessage ?? "",
    };
  } else {
    console.log("Try to sign in ", result.data.email, result.data.password);
    await signInAction(result.data.email, result.data.password);

    return {
      emailError: false,
      emailErrorMessage: "",
      passwordError: false,
      passwordErrorMessage: "",
    };
  }
};
