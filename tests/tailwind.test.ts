/**
 * Test pour valider que Tailwind CSS est correctement chargé dans le projet Nuxt 4
 */

import { describe, it, expect } from 'vitest'

describe('Tailwind CSS Integration', () => {
  it('should have Tailwind CSS properly loaded', () => {
    // Vérifier que le fichier CSS principal existe et contient les imports Tailwind
    const fs = require('fs')
    const cssPath = './app/assets/css/main.css'
    
    // Vérifier que le fichier existe
    const cssExists = fs.existsSync(cssPath)
    expect(cssExists).toBe(true)
    
    // Vérifier que le fichier contient l'import Tailwind
    if (cssExists) {
      const cssContent = fs.readFileSync(cssPath, 'utf8')
      const hasTailwindImport = cssContent.includes('@import "tailwindcss"')
      const hasNuxtUIImport = cssContent.includes('@import "@nuxt/ui"')
      
      expect(hasTailwindImport).toBe(true)
      expect(hasNuxtUIImport).toBe(true)
    }
  })

  it('should have Tailwind utility classes available', () => {
    // Vérifier que la configuration Nuxt inclut le CSS
    const fs = require('fs')
    const nuxtConfigPath = './nuxt.config.ts'
    
    const configExists = fs.existsSync(nuxtConfigPath)
    expect(configExists).toBe(true)
    
    if (configExists) {
      const configContent = fs.readFileSync(nuxtConfigPath, 'utf8')
      const hasCssConfig = configContent.includes("css: ['~/assets/css/main.css']")
      expect(hasCssConfig).toBe(true)
    }
  })
})
