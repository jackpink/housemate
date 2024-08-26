import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    TURSO_CONNECTION_URL: z.string(),
    TURSO_AUTH_TOKEN: z.string(),
    COGNITO_CLIENT_ID: z.string(),
    COGNITO_CLIENT_SECRET: z.string(),
    COGNITO_ISSUER: z.string(),
    AUTH_SECRET: z.string(),
    AUTH_TRUST_HOST: z.string(),
    AUTH_URL: z.string(),
    RESEND_API_KEY: z.string(),
    // CLERK_SECRET_KEY: z.string(),
    // UPSTASH_REDIS_REST_URL: z.string(),
    // UPSTASH_REDIS_REST_TOKEN: z.string(),
    // WEBHOOK_SECRET: z.string(),
    GOOGLE_MAPS_API_KEY: z.string(),
    AWS_SSL_CERTIFICATE_ARN: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    // NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    // NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    // NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string(),
    // NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
    COGNITO_ISSUER: process.env.COGNITO_ISSUER,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,
    AUTH_URL: process.env.AUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
    //   process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    // CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    // UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    // UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    // WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    // NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    // NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    // NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
    //   process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    // NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
    //   process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
    // // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    AWS_SSL_CERTIFICATE_ARN: process.env.AWS_SSL_CERTIFICATE_ARN,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
