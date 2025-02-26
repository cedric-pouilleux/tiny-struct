import { test, expect } from '@playwright/test'

test('Home page should load and display content correctly', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://localhost:3000')
  await expect(page).toHaveTitle(/Welcome to Nuxt!/)
})
