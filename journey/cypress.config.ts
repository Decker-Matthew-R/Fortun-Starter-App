import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  chromeWebSecurity: false,
  e2e: {
    viewportWidth: 2000,
    viewportHeight: 2000,
    experimentalRunAllSpecs: true,
    baseUrl: "http://localhost:8080",
    supportFile: "cypress/support/e2e.ts"
  },
});
