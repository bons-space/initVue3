import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'; // 打包分析

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
      port: 8081,
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
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        directoryAsNamespace: true,
        dirs: ['src/components'],
        resolvers: [ElementPlusResolver()],
      }),
      visualizer(),
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
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: { // 输出文件拆分
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/static/[name]-[hash].[ext]',
          manualChunks(id: any) {
            if (id.includes('node_modules')) { // 
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: process.env.NODE_ENV !== 'production',
          drop_debugger: process.env.NODE_ENV !== 'production',
        },
      },
    },
  }
})
