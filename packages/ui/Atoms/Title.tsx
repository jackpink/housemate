import clsx from "clsx";
import Link from "next/link";
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
        "py-8 text-center font-sans text-4xl font-extrabold text-dark",
        className,
      )}
    >
      {children}
    </h1>
  );
}

// Not being used in the project, will try to avoid this UI
export function PageMiniSubHeading({
  title,
  href,
  selected,
}: {
  title: string;
  href: string;
  selected: boolean;
}) {
  return (
    <Link href={href}>
      <p
        className={clsx(
          "rounded-lg border pl-10 text-2xl hover:bg-altSecondary",
          selected && "bg-altSecondary text-altPrimary",
          !selected && "text-dark",
        )}
      >
        {title}
      </p>
    </Link>
  );
}

type PageSubTitleProps = {
  className?: string;
};

export function PageSubTitle({
  children,
  className,
}: PropsWithChildren<PageSubTitleProps>) {
  return (
    <h2
      className={clsx(
        "pb-4 text-center font-sans text-3xl font-extrabold text-dark",
        className,
      )}
    >
      {children}
    </h2>
  );
}
