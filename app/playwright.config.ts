import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.ts'],
  use: {
    trace: 'on',
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    headless: true
  }
})
