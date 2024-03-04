import { SSTConfig } from "sst";
import { Config, NextjsSite } from "sst/constructs";
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
      const CLERK_SECRET_KEY = new Config.Secret(stack, "CLERK_SECRET_KEY");
      const site = new NextjsSite(stack, "site", {
        environment: {
          CLERK_SECRET_KEY: env.CLERK_SECRET_KEY,
          DATABASE_URL: env.DATABASE_URL,
          UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
