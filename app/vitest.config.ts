import vuePlugin from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vuePlugin()],
  test: {
    environment: 'jsdom',
    exclude: ['tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'istanbul',
      reporter: ['default', 'html']
    }
  }
})
