"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CTAButton } from "../../../../ui/Atoms/Button";
import { ErrorMessage } from "../../../../ui/Atoms/Text";
import { TextInputWithError } from "../../../../ui/Atoms/TextInput";
import {
  FormState,
  emptyFormState,
  fromErrorToFormState,
  signUpSchema,
  verifyCodeSchema,
} from "../../../../core/homeowner/forms";
import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  createAndSendVerificationEmailCode,
  signUpAction,
  verifyCodeAction,
} from "../actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageTitle } from "../../../../ui/Atoms/Title";
import { EmailSentIcon, LoadingIcon } from "../../../../ui/Atoms/Icons";
import clsx from "clsx";

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

    const signUpResult = await signUpAction(result);
    if (signUpResult.error) {
      return {
        error: true,
        message: signUpResult.error,
        fieldErrors: {},
      };
    }
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

export function EmailCodeVerificationComponent({ userId }: { userId: string }) {
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

  const [state, formAction] = useFormState(verifyCode, emptyFormState);

  return (
    <>
      <PageTitle>Enter Code Emailed to You</PageTitle>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
        <div className="flex items-center justify-center gap-4">
          {code.map((_, index) => (
            <input
              type="text"
              key={index}
              maxLength={1}
              className="h-10 w-10 rounded-sm border-2 border-slate-500 text-center outline-4 outline-brandSecondary"
              onChange={(e) => handleOTPChange(e.target.value, index)}
              ref={verificationCodeRefs.current[index]}
              autoFocus={index === 0}
            />
          ))}
        </div>
        <form action={formAction}>
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="code" value={code.join("")} />
          <VerifyButton />
        </form>

        <ErrorMessage error={state.error} errorMessage={state.message} />
      </div>
    </>
  );
}

function VerifyButton() {
  const { pending } = useFormStatus();
  return (
    <CTAButton rounded loading={pending}>
      Verify
    </CTAButton>
  );
}

const verifyCode = async (
  state: any,
  formData: FormData,
): Promise<FormState> => {
  let result;

  try {
    result = verifyCodeSchema.parse({
      code: formData.get("code"),
      userId: formData.get("userId"),
    });

    const signUpResult = await verifyCodeAction(result);
    if (signUpResult.error) {
      return {
        error: true,
        message: signUpResult.error,
        fieldErrors: {},
      };
    }
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
export const ResendVerificationEmailButton = ({
  children,
  userId,
  email,
}: {
  children: React.ReactNode;
  userId: string;
  email: string;
}) => {
  const [pending, startTransition] = useTransition();
  const [isSent, setIsSent] = useState(false);
  const onClickResendVerificationEmail = async () => {
    startTransition(async () => {
      await createAndSendVerificationEmailCode({
        userId: userId,
        email: email,
      });
    });
    setIsSent(true);
  };

  useEffect(() => {
    if (isSent) {
      setTimeout(() => setIsSent(false), 10000);
    }
  }, [isSent]);

  return (
    <button
      onClick={onClickResendVerificationEmail}
      className={clsx("pt-4 text-xl font-bold font-bold text-brandSecondary", {
        "cursor-not-allowed": isSent,
      })}
    >
      {pending ? (
        <LoadingIcon width={252} height={30} colour="#c470e7" />
      ) : isSent ? (
        <p className="flex items-center justify-center">
          <EmailSentIcon tickColour="green" width={60} height={60} />
          Email sent. Please Check your Email
        </p>
      ) : (
        children
      )}
    </button>
  );
};
