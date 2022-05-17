import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// @ts-ignore
import fs from 'fs'
// @ts-ignore
import dotenv from 'dotenv'

const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig(({ mode }: UserConfig): UserConfig => {
  // 根据环境变量加载环境变量文件
  const DAP_ENV = dotenv.parse(fs.readFileSync(`.env.${mode}`))
  return {
    base: DAP_ENV.VITE_PUBLIC_PATH,
    server: {
      host: 'localhost',
      port: 8091,
      proxy: {
        [DAP_ENV.VITE_BASE_API]: {
          target: `${DAP_ENV.VITE_TARGET_HOST}`,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      vue(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
        },
      },
    },
    build: {
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用esbuild
      // reportCompressedSize: true,
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      chunkSizeWarningLimit: 1500,
    },
  }
})
