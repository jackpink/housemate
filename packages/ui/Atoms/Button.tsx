"use client";

import clsx from "clsx";
import { ReactNode, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Text } from "./Text";
import { CrossIcon, DeleteIcon, LoadingIcon } from "./Icons";
import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
  useDialog,
  useDialogContext,
} from "./Dialog";

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

export function PopoverButton({
  onClick,
  Icon,
  IconSecondary,
  title,
  iconPadding,
}: {
  onClick: () => void;
  Icon: React.ReactNode;
  IconSecondary: React.ReactNode;
  title: string;
  iconPadding: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <button onClick={onClick} className="group/nav flex items-center p-2">
      <div className=" group-hover/nav:hidden group-focus/nav:hidden">
        {Icon}
      </div>
      <div className="hidden group-hover/nav:flex group-focus/nav:flex group-focus/nav:animate-pulse">
        {IconSecondary}
      </div>
      <p
        className={clsx(
          "group-hover/nav:text-brandSecondary group-focus/nav:text-brandSecondary group-focus/nav:animate-pulse",
          iconPadding === 1 && "pl-1",
          iconPadding === 2 && "pl-2",
          iconPadding === 3 && "pl-3",
          iconPadding === 4 && "pl-4",
          iconPadding === 5 && "pl-5",
        )}
      >
        {title}
      </p>
    </button>
  );
}

export function PopoverFormButton({
  onClick,
  Icon,
  IconSecondary,
  title,
  iconPadding,
}: {
  onClick: () => void;
  Icon: React.ReactNode;
  IconSecondary: React.ReactNode;
  title: string;
  iconPadding: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <form action={onClick} className="group/nav">
      <button onClick={onClick} className=" flex items-center p-2">
        <div className=" group-hover/nav:hidden group-focus/nav:hidden">
          {Icon}
        </div>
        <div className="hidden group-hover/nav:flex group-focus/nav:flex group-focus/nav:animate-pulse">
          {IconSecondary}
        </div>
        <p
          className={clsx(
            "group-hover/nav:text-brandSecondary group-focus/nav:text-brandSecondary group-focus/nav:animate-pulse",
            iconPadding === 1 && "pl-1",
            iconPadding === 2 && "pl-2",
            iconPadding === 3 && "pl-3",
            iconPadding === 4 && "pl-4",
            iconPadding === 5 && "pl-5",
          )}
        >
          {title}
        </p>
      </button>
    </form>
  );
}

export function PopoverLinkButton({
  href,
  Icon,
  IconSecondary,
  title,
  iconPadding,
}: {
  href: string;
  Icon: React.ReactNode;
  IconSecondary: React.ReactNode;
  title: string;
  iconPadding: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <Link href={href} className="group/nav flex items-center p-2">
      <div className=" group-hover/nav:hidden group-focus/nav:hidden">
        {Icon}
      </div>
      <div className="hidden group-hover/nav:flex group-focus/nav:flex group-focus/nav:animate-pulse">
        {IconSecondary}
      </div>
      <p
        className={clsx(
          "group-hover/nav:text-brandSecondary group-focus/nav:text-brandSecondary group-focus/nav:animate-pulse",
          iconPadding === 1 && "pl-1",
          iconPadding === 2 && "pl-2",
          iconPadding === 3 && "pl-3",
          iconPadding === 4 && "pl-4",
          iconPadding === 5 && "pl-5",
        )}
      >
        {title}
      </p>
    </Link>
  );
}

function DeleteDialogCancelButton() {
  const { setOpen } = useDialogContext();

  return (
    <button
      onClick={() => setOpen(false)}
      className="flex rounded-md bg-slate-300 p-2 shadow-sm shadow-black"
    >
      <CrossIcon />
      Cancel
    </button>
  );
}

function DeleteDialogConfirmButton({
  onDelete,
  disabled,
}: {
  onDelete: () => void;
  disabled?: boolean;
}) {
  const { setOpen } = useDialogContext();
  const onClickDelete = async () => {
    await onDelete();
    setOpen(false);
  };
  return (
    <button
      onClick={onClickDelete}
      className={clsx(
        "flex rounded-md bg-red-400 p-2 shadow-sm shadow-black",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <DeleteIcon />
      Delete
    </button>
  );
}

export function DeleteButtonWithDialog({
  label,
  onDelete,
  children,
}: {
  label: string;
  onDelete: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="Dialog">
        <DialogDescription className="flex  flex-col items-center gap-4 p-2 pt-14">
          <div className="max-w-96">
            <p className="pb-4">
              Are you sure you want to delete this {label}?
            </p>
            <div className="flex w-full justify-between gap-4">
              <DeleteDialogCancelButton />
              <DeleteDialogConfirmButton onDelete={onDelete} />
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteButtonWithDialogAndTextConfirmation({
  label,
  onDelete,
  children,
}: {
  label: string;
  onDelete: () => void;
  children: ReactNode;
}) {
  const [confirmation, setConfirmation] = React.useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="Dialog">
        <DialogDescription className="flex  flex-col items-center gap-4 p-2 pt-14">
          <div className="max-w-96">
            <p className="pb-4">
              Are you sure you want to delete this {label}? Type{" "}
              <strong className="uppercase"> delete {label}</strong> to confirm.
            </p>
            <input
              type="text"
              className="w-full p-2 "
              value={confirmation}
              onChange={(e) => setConfirmation(e.currentTarget.value)}
            />
            <div className="flex w-full justify-between gap-4 pt-4">
              <DeleteDialogCancelButton />
              <DeleteDialogConfirmButton
                onDelete={onDelete}
                disabled={confirmation !== "DELETE ACCOUNT"}
              />
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
