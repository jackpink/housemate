/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("../core/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  outputFileTracingIncludes: {
    "/auth": [
      `./node_modules/argon2/prebuilds/${process.env.ARGON2_PREBUILDS_GLOB || "**"}`,
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
  images: {
    remotePatterns: [
      {
        hostname:
          "dev-my-sst-app-default-itemuploadsbucket713f469a-yqlxlhugoane.s3.ap-southeast-2.amazonaws.com",
      },
      {
        hostname:
          "prod-my-sst-app-default-itemuploadsbucket713f469a-jdqhgx9z2wyn.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default config;
