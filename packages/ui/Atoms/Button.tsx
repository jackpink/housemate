import clsx from "clsx";
import { ReactNode } from "react";
import { Text } from "./Text";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  className?: string;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  secondary?: boolean;
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
}) => {
  return (
    <button
      value={value ? value : "value"}
      onClick={onClick}
      className={clsx(
        "rounded border border-dark p-2 text-xl font-extrabold text-dark hover:bg-brand/70",
        className,
        disabled && "cursor-not-allowed opacity-50",
        loading && "animate-pulse cursor-wait",
        rounded && "rounded-full border-0 p-6",
        secondary ? "bg-altSecondary" : "bg-brand",
      )}
    >
      {children}
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
      className="flex max-w-xs flex-col gap-4 rounded-xl bg-brand p-4  hover:bg-brand/70"
    >
      {children}
    </button>
  );
};

export const LargeButtonTitle: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Text className="font-sans text-2xl font-bold text-dark">{children} →</Text>
  );
};

export const LargeButtonContent: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <Text className="font-sans text-lg text-dark">{children}</Text>;
};
