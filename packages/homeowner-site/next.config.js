/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("../core/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname:
          "prod-my-sst-app-default-itemuploadsbucket713f469a-b7dxb0spvs67.s3.us-east-1.amazonaws.com",
      },
      {
        hostname:
          "prod-my-sst-app-default-itemuploadsbucket713f469a-jdqhgx9z2wyn.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default config;
