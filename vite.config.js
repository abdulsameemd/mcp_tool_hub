import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/mcp_tool_hub/',
  // Deployed at: https://sheer2714.github.io/mcp_tool_hub/
})
