/**
 * Test pour valider que la navigation avec UNavigationMenu est correctement configurée
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Navigation Menu Configuration', () => {
  it('should have UNavigationMenu component in app.vue', () => {
    const appVuePath = resolve(process.cwd(), 'app/app.vue')
    
    if (!existsSync(appVuePath)) {
      throw new Error('app.vue file not found')
    }
    
    const appContent = readFileSync(appVuePath, 'utf8')
    
    // Vérifier que UNavigationMenu est utilisé
    expect(appContent).toContain('<UNavigationMenu')
    expect(appContent).toContain(':items="navItems"')
    expect(appContent).toContain('orientation="horizontal"')
  })

  it('should have navItems defined in app.vue', () => {
    const appVuePath = resolve(process.cwd(), 'app/app.vue')
    const appContent = readFileSync(appVuePath, 'utf8')
    
    // Vérifier que navItems est défini (ref, useState ou constante typée)
    const hasRef = appContent.includes("import { ref } from 'vue'")
    const hasUseState = appContent.includes('useState')
    const hasConstDefinition = appContent.includes('const navItems: NavigationMenuItem[]')
    const hasRefDefinition = appContent.includes('const navItems = ref<NavigationMenuItem[]>')
    const hasUseStateDefinition = appContent.includes('const navItems = useState')
    
    expect(hasRef || hasUseState || hasConstDefinition || hasRefDefinition || hasUseStateDefinition).toBe(true)
  })

  it('should have NavigationMenuItem type imported', () => {
    const appVuePath = resolve(process.cwd(), 'app/app.vue')
    const appContent = readFileSync(appVuePath, 'utf8')
    
    // Vérifier l'import du type
    expect(appContent).toContain("import type { NavigationMenuItem } from '@nuxt/ui'")
  })

  it('should have valid navigation items structure', () => {
    const appVuePath = resolve(process.cwd(), 'app/app.vue')
    const appContent = readFileSync(appVuePath, 'utf8')
    
    // Extraire la partie script
    const scriptMatch = appContent.match(/<script setup lang="ts">(.*?)<\/script>/s)
    if (!scriptMatch) {
      throw new Error('Script section not found in app.vue')
    }
    
    const scriptContent = scriptMatch[1]
    
    // Vérifier que chaque item a les propriétés requises
    expect(scriptContent).toContain("label: 'Accueil'")
    expect(scriptContent).toContain("to: '/'")
    expect(scriptContent).toContain("icon: 'i-heroicons-home'")
    
    expect(scriptContent).toContain("label: 'Articles'")
    expect(scriptContent).toContain("to: '/articles'")
    expect(scriptContent).toContain("icon: 'i-heroicons-document-text'")
    
    expect(scriptContent).toContain("label: 'À propos'")
    expect(scriptContent).toContain("to: '/about'")
    expect(scriptContent).toContain("icon: 'i-heroicons-information-circle'")
    
    expect(scriptContent).toContain("label: 'Contact'")
    expect(scriptContent).toContain("to: '/contact'")
    expect(scriptContent).toContain("icon: 'i-heroicons-envelope'")
  })

  it('should have UNavigationMenu in UHeader', () => {
    const appVuePath = resolve(process.cwd(), 'app/app.vue')
    const appContent = readFileSync(appVuePath, 'utf8')
    
    // Vérifier que UNavigationMenu est dans UHeader (directement ou dans un slot)
    const headerMatch = appContent.match(/<UHeader>(.*?)<\/UHeader>/s)
    if (!headerMatch) {
      throw new Error('UHeader not found in app.vue')
    }
    
    const headerContent = headerMatch[1]
    // UNavigationMenu peut être directement dans UHeader ou dans le slot center
    expect(headerContent).toContain('<UNavigationMenu')
  })

  it('should have all required pages in navigation', () => {
    const appVuePath = resolve(process.cwd(), 'app/app.vue')
    const appContent = readFileSync(appVuePath, 'utf8')
    
    // Vérifier que toutes les pages existantes sont dans la navigation
    const pages = ['/', '/articles', '/about', '/contact']
    
    for (const page of pages) {
      expect(appContent).toContain(`to: '${page}'`)
    }
  })
})
