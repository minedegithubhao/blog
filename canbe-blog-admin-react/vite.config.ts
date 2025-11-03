import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 路径别名配置 将@映射到src目录下
// 路径别名配置 1、引入path模块
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 路径别名配置 2、配置路径别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // 配置代理
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/public/genImageCaptcha': { // 验证码图片
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/public/upload': { // 文件
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/public/download': { // 文件
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})

