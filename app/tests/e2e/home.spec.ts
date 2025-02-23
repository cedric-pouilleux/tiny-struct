import { test, expect } from '@playwright/test'

test('Home page should load correctly', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'http://localhost:3000')
})
