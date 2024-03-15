import clsx from "clsx";

type TextProps = {
  className?: string;
  colour?: string;
};

export function Text({
  className,
  children,
  colour,
}: React.PropsWithChildren<TextProps>) {
  return (
    <p
      className={clsx(
        " text-center font-sans text-lg",
        className,
        "text-dark" && !colour,
        colour && colour,
      )}
    >
      {children}
    </p>
  );
}

export function ErrorMessage({
  error,
  errorMessage,
}: {
  error: boolean;
  errorMessage: string | null;
}) {
  return (
    <>{error ? <p className="text-red-500">⚠️ {errorMessage}</p> : <></>}</>
  );
}
