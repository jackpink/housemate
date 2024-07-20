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
import React, { useEffect, useRef, useState } from "react";
import { signUp } from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageTitle } from "../../../../ui/Atoms/Title";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [state, formAction] = useFormState(createUser, emptyFormState);

  return (
    <div>
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

        <CTAButton rounded className="w-full" error={state.error}>
          Create Account
        </CTAButton>
      </form>

      <ErrorMessage error={state.error} errorMessage={state.message} />
    </div>
  );
}

const createUser = async (
  state: any,
  formData: FormData,
): Promise<FormState> => {
  let result;

  try {
    result = signUpSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    console.log("new user");
    await signUp(result);
    result.firstName;
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

export function EmailCodeVerificationComponent() {
  const [code, setCode] = useState(Array<string>(6).fill(""));

  const verificationCodeRefs = useRef(
    Array.from({ length: 6 }, (a) => React.createRef<HTMLInputElement>()),
  );

  const handleOTPChange = (value: string, index: number) => {
    setCode((prev) => {
      const newCode = [...prev];
      newCode[index] = value;
      return newCode;
    });
    if (value && index < 5) {
      const ref = verificationCodeRefs.current[index + 1];
      if (!!ref && ref.current) ref.current?.focus();
    }
  };

  return (
    <>
      <PageTitle>Enter Code Emailed to You</PageTitle>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-altSecondary p-6">
        <div className="flex items-center justify-center gap-4">
          {code.map((_, index) => (
            <input
              type="text"
              key={index}
              maxLength={1}
              className="h-10 w-10 text-center"
              onChange={(e) => handleOTPChange(e.target.value, index)}
              ref={verificationCodeRefs.current[index]}
              autoFocus={index === 0}
            />
          ))}
        </div>
        <CTAButton onClick={() => console.log("verify", code)} rounded>
          Verify
        </CTAButton>
      </div>
    </>
  );
}
