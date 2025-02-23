import { test, expect } from "@playwright/test";

test("Home page should load and display content correctly", async ({
  page,
}) => {
  const response = await page.goto("http://localhost:3200", { timeout: 5000 });

  if (!response || response.status() !== 200) {
    throw new Error("🚨 Page non accessible ! Le serveur est peut-être OFF.");
  }

  console.log("DEBUG PAGE CONTENT:", await page.content());

  await expect(page).toHaveTitle(/Welcome to Fuck!/);
});
