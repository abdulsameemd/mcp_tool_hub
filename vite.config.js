import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [vue(), viteSingleFile()],
  base: '/mcp_tool_hub/',
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  }
})
