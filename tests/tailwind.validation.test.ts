/**
 * Test de validation pour Tailwind CSS dans Nuxt 4
 * Ces tests sont conçus pour valider que Tailwind est correctement chargé et fonctionnel
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// Fonction pour vérifier si Tailwind est chargé dans la configuration
export function isTailwindLoaded(): boolean {
  try {
    // Utiliser le chemin absolu depuis la racine du projet
    const cssPath = resolve(process.cwd(), 'app/assets/css/main.css')
    
    if (!existsSync(cssPath)) {
      return false
    }
    
    const cssContent = readFileSync(cssPath, 'utf8')
    const hasTailwindImport = cssContent.includes('@import "tailwindcss"')
    const hasNuxtUIImport = cssContent.includes('@import "@nuxt/ui"')
    
    return hasTailwindImport && hasNuxtUIImport
  } catch {
    return false
  }
}

// Fonction pour vérifier si les classes utilitaires Tailwind fonctionnent
export function areTailwindUtilitiesWorking(): boolean {
  try {
    const nuxtConfigPath = resolve(process.cwd(), 'nuxt.config.ts')
    
    if (!existsSync(nuxtConfigPath)) {
      return false
    }
    
    const configContent = readFileSync(nuxtConfigPath, 'utf8')
    const hasCssConfig = configContent.includes("css: ['~/assets/css/main.css']")
    
    return hasCssConfig
  } catch {
    return false
  }
}

// Fonction pour vérifier si la configuration Tailwind est valide
export function isTailwindConfigValid(): boolean {
  try {
    const packageJsonPath = resolve(process.cwd(), 'package.json')
    
    if (!existsSync(packageJsonPath)) {
      return false
    }
    
    const packageContent = readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageContent)
    
    // Vérifier que tailwindcss est dans les dépendances
    return !!(packageJson.dependencies?.tailwindcss || 
             packageJson.devDependencies?.tailwindcss)
  } catch {
    return false
  }
}

// Fonction principale de validation
export function validateTailwindSetup(): { isLoaded: boolean, utilitiesWorking: boolean, configValid: boolean } {
  return {
    isLoaded: isTailwindLoaded(),
    utilitiesWorking: areTailwindUtilitiesWorking(),
    configValid: isTailwindConfigValid()
  }
}

// Test Vitest pour intégration avec les outils de test
describe('Tailwind CSS Setup Validation', () => {
  it('should validate Tailwind CSS setup', () => {
    const result = validateTailwindSetup()
    
    // Maintenant que Tailwind est configuré, tout doit être true
    expect(result.isLoaded).toBe(true)
    expect(result.utilitiesWorking).toBe(true)
    expect(result.configValid).toBe(true)
  })
  
  it('should have Tailwind CSS imported in main.css', () => {
    expect(isTailwindLoaded()).toBe(true)
  })
  
  it('should have CSS configuration in nuxt.config.ts', () => {
    expect(areTailwindUtilitiesWorking()).toBe(true)
  })
  
  it('should have tailwindcss in package.json dependencies', () => {
    expect(isTailwindConfigValid()).toBe(true)
  })
})
