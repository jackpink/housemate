import { SSTConfig } from "sst";
import { Bucket, NextjsSite } from "sst/constructs";
import { env } from "~/env";

export default {
  config(_input) {
    return {
      name: "housemate",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const propertyCoverImageBucket = new Bucket(
        stack,
        "PropertyCoverImageBucket",
      );
      const site = new NextjsSite(stack, "site", {
        bind: [propertyCoverImageBucket],
        environment: {
          CLERK_SECRET_KEY: env.CLERK_SECRET_KEY,
          DATABASE_URL: env.DATABASE_URL,
          UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN,
          WEBHOOK_SECRET: env.WEBHOOK_SECRET,
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          NEXT_PUBLIC_CLERK_SIGN_IN_URL: env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
          NEXT_PUBLIC_CLERK_SIGN_UP_URL: env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
          NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:
            env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
          NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:
            env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
          GOOGLE_MAPS_API_KEY: env.GOOGLE_MAPS_API_KEY,
          NEXT_PUBLIC_PROPERTY_COVER_IMAGE_BUCKET_NAME:
            propertyCoverImageBucket.bucketName,
        },

        /*customDomain:
          stack.stage === "prod"
            ? {
                domainName: "housemate.dev",
                domainAlias: "www.housemate.dev",
              }
            : undefined,*/
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
