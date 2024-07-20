"use client";

import clsx from "clsx";
import { ReactNode, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Text } from "./Text";
import { LoadingIcon } from "./Icons";
import React from "react";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  secondary?: boolean;
  error?: boolean;
};

export const CTAButton: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  value,
  disabled,
  loading,
  rounded,
  secondary,
  error = false,
}) => {
  const [buttonError, setButtonError] = React.useState(error);
  console.log("error", error);
  const { pending } = useFormStatus();

  useEffect(() => {
    console.log("error", error);
    if (error) {
      setButtonError(true);
      setTimeout(() => {
        setButtonError(false);
      }, 3000);
    }
  }, [error]);
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "border-dark text-dark hover:bg-brand/70 flex items-center justify-center rounded border p-2 text-xl font-extrabold",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading || (pending && "bg-brand/50 cursor-wait"),
        rounded && "rounded-full border-0 p-6",
        secondary ? "bg-altSecondary" : "bg-brand",
        buttonError ? "border-4 border-red-500" : "border-0",
      )}
    >
      {loading || pending ? <LoadingIcon /> : <>{children}</>}
    </button>
  );
};

type LargeButtonProps = {
  onClick?: () => void;
};

export const LargeButton: React.FC<
  React.PropsWithChildren<LargeButtonProps>
> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-brand hover:bg-brand/70 flex max-w-xs flex-col gap-4 rounded-xl  p-4"
    >
      {children}
    </button>
  );
};

export const LargeButtonTitle: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Text className="text-dark font-sans text-2xl font-bold">{children} →</Text>
  );
};

export const LargeButtonContent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <Text className="text-dark font-sans text-lg">{children}</Text>;
};
