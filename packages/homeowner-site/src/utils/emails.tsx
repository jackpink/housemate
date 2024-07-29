import { Resend } from "resend";
import { env } from "../../../core/env.mjs";
import { Tailwind, Button } from "@react-email/components";
import { VerificationEmail } from "./email-templates";

export async function sendVerificationEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const resend = new Resend(env.RESEND_API_KEY);

  console.log("Sending verification email to", email);

  const response = await resend.emails.send({
    from: "Housemate <no-reply@accounts.housemate.dev>",
    to: [email],
    subject: "Verification Code",
    react: <VerificationEmail code={code} />,
    headers: {
      "X-Entity-Ref-ID": "123456789",
    },
    tags: [
      {
        name: "category",
        value: "confirm_email",
      },
    ],
  });

  console.log("Email sent", response);
}

export async function sendPasswordResetEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const resend = new Resend(env.RESEND_API_KEY);

  console.log("Sending password reset email to", email);

  const response = await resend.emails.send({
    from: "Housemate <no-reply@accounts.housemate.dev>",
    to: [email],
    subject: "Password Reset",
    react: <VerificationEmail code={code} />,
    headers: {
      "X-Entity-Ref-ID": "123456789",
    },
    tags: [
      {
        name: "category",
        value: "confirm_email",
      },
    ],
  });

  console.log("Email sent", response);
}
