import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Utiliser jsdom pour simuler le DOM du navigateur
    environment: 'jsdom',
    
    // Dossier contenant les tests
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    
    // Options globales
    globals: true,
    
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    
    // Éviter les erreurs avec les modules Nuxt
    exclude: ['node_modules', '.nuxt', '.output'],
    
    // Désactiver le cache pour éviter les problèmes
    cache: {
      dir: '.vitest'
    }
  },
  
  // Résolution des modules
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './')
    }
  }
})
