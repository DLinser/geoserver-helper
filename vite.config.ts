/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: './lib/main.ts',
      name: 'geoserver-rest',
      fileName: 'geoserver-rest'
    }
  },
  test: {
    // environment: 'jsdom',
  },
})
