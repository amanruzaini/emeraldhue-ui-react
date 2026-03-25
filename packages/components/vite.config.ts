import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  ...(command === 'serve'
    ? {
        root: resolve(__dirname),
        server: {
          open: '/src/dev/index.html',
        },
      }
    : {
        build: {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', '@eh/tokens'],
          },
        },
      }),
}))
