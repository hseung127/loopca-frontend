import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // 기본 포트 5173 고정
    strictPort: true  // 이미 사용 중이면 종료 (자동으로 5174로 안 바뀌도록)
  }
})
