import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import dotenv from "dotenv";

export default {
  config(_input) {
    return {
      name: "housemate",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      // get stage
      const { stage } = stack;
      // get path to .env file for given stage
      const path = envPathMap.get(stage);
      // use dotenv to get the env file
      const { parsed: environment } = dotenv.config({ path });
      const site = new NextjsSite(stack, "site", {
        environment,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

const envPathMap = new Map();
envPathMap.set("dev", ".env.dev");
envPathMap.set("staging", ".env.staging");
envPathMap.set("prod", ".env.prod");
