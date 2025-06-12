import { defineConfig } from 'vite'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/static/',
    resolve: {
        alias: {
            '@': resolve('./src'),
        }
    },
    build: {
        manifest: 'manifest.json',
        outDir: resolve('../static'),
        rollupOptions: {
            input: {
                index: resolve('./src/index.jsx')
            }
        }
    },
    plugins: [
        tailwindcss(),
        react(),
    ],
})
