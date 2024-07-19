import { Resend } from 'resend';
import { env } from '../../../core/env.mjs';

export async function sendVerificationEmail({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const resend = new Resend(env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Housemate <no-reply@housemate.dev>',
  to: [email],
  subject: 'Verification Code',
  html: 'it works!',
  
  ],
  headers: {
    'X-Entity-Ref-ID': '123456789',
  },
  tags: [
    {
      name: 'category',
      value: 'confirm_email',
    },
  ],
});
}

