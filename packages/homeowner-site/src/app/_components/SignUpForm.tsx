"use client";

import { useFormState } from "react-dom";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import { signUpSchema } from "../../../../core/homeowner/forms";
import React from "react";
import { signUp } from "../actions";
import Link from "next/link";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, formAction] = useFormState(createUser, {
    firstNameError: false,
    firstNameErrorMessage: "",
    lastNameError: false,
    lastNameErrorMessage: "",
    emailError: false,
    emailErrorMessage: "",
    passwordError: false,
    passwordErrorMessage: "",
    confirmPasswordError: false,
    confirmPasswordErrorMessage: "",
  });

  return (
    <>
      <form action={formAction} className="flex w-96 flex-col items-center">
        <TextInputWithError
          label="First Name"
          name="firstName"
          error={state.firstNameError}
          errorMessage={state.firstNameErrorMessage}
        />
        <TextInputWithError
          label="Last Name"
          name="lastName"
          error={state.lastNameError}
          errorMessage={state.lastNameErrorMessage}
        />
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
        <TextInputWithError
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          error={state.confirmPasswordError}
          errorMessage={state.confirmPasswordErrorMessage}
        />

        <CTAButton rounded>Create Account</CTAButton>
      </form>

      {/* <ErrorMessage
        error={completeSignUpError.status}
        errorMessage={completeSignUpError.message}
      /> */}
      <Link href="/sign-in" className="mt-2 block text-center">
        Already have an account? Sign in
      </Link>
    </>
  );
}

const createUser = async (state: any, formData: FormData) => {
  const result = signUpSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  console.log(result);
  if (!result.success) {
    const firstNameErrorMessage = result.error.issues.find(
      (issue) => issue.path[0] === "firstName",
    )?.message;
    const lastNameErrorMessage = result.error.issues.find(
      (issue) => issue.path[0] === "lastName",
    )?.message;
    const emailErrorMessage = result.error.issues.find(
      (issue) => issue.path[0] === "email",
    )?.message;
    const passwordErrorMessage = result.error.issues.find(
      (issue) => issue.path[0] === "password",
    )?.message;
    const confirmPasswordErrorMessage = result.error.issues.find(
      (issue) => issue.path[0] === "confirmPassword",
    )?.message;

    return {
      firstNameError: !!firstNameErrorMessage,
      firstNameErrorMessage: firstNameErrorMessage,
      lastNameError: !!lastNameErrorMessage,
      lastNameErrorMessage: lastNameErrorMessage,
      emailError: !!emailErrorMessage,
      emailErrorMessage: emailErrorMessage,
      passwordError: !!passwordErrorMessage,
      passwordErrorMessage: passwordErrorMessage,
      confirmPasswordError: !!confirmPasswordErrorMessage,
      confirmPasswordErrorMessage: confirmPasswordErrorMessage,
    };
  } else {
    console.log("new user", result.data.firstName);
    // Create user with clerk
    //await createClerkUser(result.data);

    await signUp(result.data);

    //void createUserInClerk(result.data);
    // Create Company with Clerk
    // Create Trade in DB

    return {
      firstNameError: false,
      firstNameErrorMessage: "",
      lastNameError: false,
      lastNameErrorMessage: "",
      emailError: false,
      emailErrorMessage: "",
      passwordError: false,
      passwordErrorMessage: "",
      confirmPasswordError: false,
      confirmPasswordErrorMessage: "",
    };
  }
};
