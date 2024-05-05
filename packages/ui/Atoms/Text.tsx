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
  errorMessage: string | null | undefined;
}) {
  return (
    <p className="text-red-500">
      {error && errorMessage ? "⚠️ " + errorMessage : null}
    </p>
  );
}
type TextSpanProps = {
  className?: string;
};

export function TextSpan({
  className,
  children,
}: React.PropsWithChildren<TextSpanProps>) {
  return (
    <span
      className={clsx("text-dark text-center font-sans text-lg", className)}
    >
      {children}
    </span>
  );
}

type ParagraphTextProps = {
  className?: string;
};

export const ParagraphText: React.FC<
  React.PropsWithChildren<ParagraphTextProps>
> = ({ className, children }) => {
  return (
    <div className={clsx("whitespace-pre-line px-4 text-base", className)}>
      {children}
    </div>
  );
};
