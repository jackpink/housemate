import clsx from "clsx";
import { PropsWithChildren } from "react";

type PageTitleProps = {
  className?: string;
};

export function PageTitle({
  className,
  children,
}: PropsWithChildren<PageTitleProps>) {
  return (
    <h1
      className={clsx(
        "text-dark py-8 text-center font-sans text-4xl font-extrabold",
        className,
      )}
    >
      {children}
    </h1>
  );
}
