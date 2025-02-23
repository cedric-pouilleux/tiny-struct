import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "istanbul",
      reporter: ["default", "html"],
    },
  },
});
