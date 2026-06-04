import { defineConfig, configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: './', // GitHub Pages: 상대경로 — 리포명 무관, Pages/로컬 양쪽 안전
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // 격리 워크트리(.claude/worktrees/*) 사본이 테스트 수를 부풀리지 않도록 제외
    exclude: [...configDefaults.exclude, '**/.claude/**'],
  },
})
