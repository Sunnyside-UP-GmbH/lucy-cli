import { defineConfig } from "vitest/config";
import { sharedConfig, uiConfig } from "@lucy/vitest-config";

export default defineConfig({
  ...sharedConfig,
  ...uiConfig,
  test: {
    projects: [
      {
        root: "./packages",
        test: {
          ...sharedConfig.test,
          // Project-specific configuration for packages
          // ...
        },
      },
      {
        root: "./apps",
        test: {
          ...sharedConfig.test,
          // Project-specific configuration for apps
          environment: "jsdom",
        },
      },
    ],
  },
});
