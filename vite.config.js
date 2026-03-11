import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Garantir que as variáveis de ambiente sejam carregadas
  define: {
    'process.env': {}
  }
})