import { SSTConfig } from "sst";
import { Default } from "./stacks/Default";

export default {
  config(_input) {
    return {
      name: "my-sst-app",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app.stack(Default);
  },
} satisfies SSTConfig;
