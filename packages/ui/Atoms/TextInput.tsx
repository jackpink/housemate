import clsx from "clsx";
import { ErrorMessage, TextSpan } from "./Text";

export function TextInputWithError({
  label,
  name,
  value,
  onChange,
  error,
  errorMessage,
  disabled,
  type = "text",
}: {
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorMessage?: string;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "tel";
}) {
  return (
    <>
      <TextInput
        label={label}
        name={name}
        value={value}
        error={error}
        onChange={onChange}
        disabled={disabled}
        type={type}
      />
      <ErrorMessage error={error} errorMessage={errorMessage} />
    </>
  );
}

export function TextInput({
  label,
  name,
  value,
  error,
  onChange,
  disabled,
  type = "text",
}: {
  label?: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "tel";
}) {
  // types are numeric, text, date, email, password, tel, url, search, color, datetime-local, month, number, range, time, week
  // inputmodes are none, text, decimal, numeric, tel, search, email, url
  // autocomplete is
  let inputMode: "text" | "email" | "tel" = "text";
  let autoComplete = "off";
  // switch (type) {
  //   case "email":
  //     inputMode = "email";
  //     autoComplete = "email";
  //     break;
  //   case "password":
  //     inputMode = "text";
  //     autoComplete = "current-password";
  //     break;
  //   case "tel":
  //     inputMode = "tel";
  //     autoComplete = "tel";
  //     break;
  // }
  return (
    <>
      <label htmlFor={name} className="text-slate-700">
        <TextSpan>{label}</TextSpan>
      </label>

      <input
        type={type}
        value={value}
        name={name}
        placeholder={`Enter ${label}`}
        onChange={onChange ? (e) => onChange(e) : undefined}
        disabled={disabled}
        className={clsx(
          " focus:border-brandSecondary w-full rounded-full border-2 p-6 focus:outline-none",
          error ? "border-red-500" : "border-slate-300",
        )}
        inputMode={inputMode}
        autoComplete={autoComplete}
      />
    </>
  );
}
