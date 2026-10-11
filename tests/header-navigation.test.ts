/**
 * Test pour valider la structure Header + Hero + Navigation
 * Ce test vérifie que :
 * 1. AppHeader existe et utilise UHeader
 * 2. AppNavigation est intégré dans le slot center
 * 3. Le modèle de données de navigation est valide
 * 4. Le hero est présent
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

describe('Header with Hero and Navigation Structure', () => {
  // Chemin des fichiers
  const appHeaderPath = resolve(process.cwd(), 'app/components/AppHeader.vue')
  const appNavigationPath = resolve(process.cwd(), 'app/components/AppNavigation.vue')

  describe('AppHeader Component', () => {
    it('should exist', () => {
      expect(existsSync(appHeaderPath)).toBe(true)
    })

    it('should use UHeader component', () => {
      const content = readFileSync(appHeaderPath, 'utf8')
      expect(content).toContain('<UHeader>')
      expect(content).toContain('</UHeader>')
    })

    it('should have a hero/title section in left slot', () => {
      const content = readFileSync(appHeaderPath, 'utf8')
      expect(content).toContain('<template #left>')
      expect(content).toContain('Portfolio')
    })

    it('should integrate AppNavigation in center slot', () => {
      const content = readFileSync(appHeaderPath, 'utf8')
      expect(content).toContain('<template #center>')
      expect(content).toContain('<AppNavigation')
    })

    it('should have optional right slot for actions', () => {
      const content = readFileSync(appHeaderPath, 'utf8')
      expect(content).toContain('<template #right>')
    })
  })

  describe('AppNavigation Component', () => {
    it('should exist', () => {
      expect(existsSync(appNavigationPath)).toBe(true)
    })

    it('should use UNavigationMenu component', () => {
      const content = readFileSync(appNavigationPath, 'utf8')
      expect(content).toContain('<UNavigationMenu')
      expect(content).toContain(':items="navItems"')
      expect(content).toContain('orientation="horizontal"')
    })

    it('should import NavigationMenuItem type from @nuxt/ui', () => {
      const content = readFileSync(appNavigationPath, 'utf8')
      expect(content).toContain("import type { NavigationMenuItem } from '@nuxt/ui'")
    })

    it('should use ref for navItems', () => {
      const content = readFileSync(appNavigationPath, 'utf8')
      expect(content).toContain("import { ref } from 'vue'")
      expect(content).toContain('const navItems = ref<NavigationMenuItem[]>')
    })

    it('should have valid navigation items structure', () => {
      const content = readFileSync(appNavigationPath, 'utf8')
      
      // Extraire la partie script
      const scriptMatch = content.match(/<script setup lang="ts">(.*?)<\/script>/s)
      if (!scriptMatch) {
        throw new Error('Script section not found in AppNavigation.vue')
      }
      
      const scriptContent = scriptMatch[1]
      
      // Vérifier que chaque item a les propriétés requises
      const requiredItems = [
        { label: 'Accueil', to: '/', icon: 'i-heroicons-home' },
        { label: 'Articles', to: '/articles', icon: 'i-heroicons-document-text' },
        { label: 'À propos', to: '/about', icon: 'i-heroicons-information-circle' },
        { label: 'Contact', to: '/contact', icon: 'i-heroicons-envelope' }
      ]
      
      for (const item of requiredItems) {
        expect(scriptContent).toContain(`label: '${item.label}'`)
        expect(scriptContent).toContain(`to: '${item.to}'`)
        expect(scriptContent).toContain(`icon: '${item.icon}'`)
      }
    })

    it('should have exactly 4 navigation items', () => {
      const content = readFileSync(appNavigationPath, 'utf8')
      
      // Compter le nombre d'objets dans le tableau navItems
      const scriptMatch = content.match(/<script setup lang="ts">(.*?)<\/script>/s)
      if (!scriptMatch) {
        throw new Error('Script section not found in AppNavigation.vue')
      }
      
      const scriptContent = scriptMatch[1]
      
      // Trouver le tableau navItems
      const navItemsMatch = scriptContent.match(/const navItems = ref<NavigationMenuItem\[]>\(\[(.*?)\]\)/s)
      if (!navItemsMatch) {
        throw new Error('navItems array not found')
      }
      
      // Compter les objets séparés par des virgules
      const itemsString = navItemsMatch[1]
      const itemCount = (itemsString.match(/\{/g) || []).length
      
      expect(itemCount).toBe(4)
    })
  })

  describe('Data Model Validation', () => {
    it('should have consistent navigation structure', () => {
      const navContent = readFileSync(appNavigationPath, 'utf8')
      
      // Extraire les items
      const scriptMatch = navContent.match(/<script setup lang="ts">(.*?)<\/script>/s)
      expect(scriptMatch).toBeDefined()
      
      const scriptContent = scriptMatch![1]
      
      // Vérifier la structure TypeScript
      expect(scriptContent).toContain('NavigationMenuItem[]')
      
      // Vérifier que chaque item a bien les propriétés
      const items = [
        { label: 'Accueil', to: '/', icon: 'i-heroicons-home' },
        { label: 'Articles', to: '/articles', icon: 'i-heroicons-document-text' },
        { label: 'À propos', to: '/about', icon: 'i-heroicons-information-circle' },
        { label: 'Contact', to: '/contact', icon: 'i-heroicons-envelope' }
      ]
      
      for (const item of items) {
        expect(scriptContent).toContain(`label: '${item.label}'`)
        expect(scriptContent).toContain(`to: '${item.to}'`)
        expect(scriptContent).toContain(`icon: '${item.icon}'`)
      }
    })

    it('should have valid route paths', () => {
      const navContent = readFileSync(appNavigationPath, 'utf8')
      
      // Vérifier que les paths correspondent aux pages existantes
      const validPaths = ['/', '/articles', '/about', '/contact']
      
      for (const path of validPaths) {
        expect(navContent).toContain(`to: '${path}'`)
      }
    })
  })

  describe('Integration Validation', () => {
    it('should be possible to use AppHeader in app.vue', () => {
      // Ce test vérifie que la structure permet une intégration facile
      const headerContent = readFileSync(appHeaderPath, 'utf8')
      const navContent = readFileSync(appNavigationPath, 'utf8')
      
      // Vérifier que AppHeader est un composant Vue valide
      expect(headerContent).toContain('<template>')
      expect(headerContent).toContain('</template>')
      expect(headerContent).toContain('<script setup lang="ts">')
      expect(headerContent).toContain('</script>')
      
      // Vérifier que AppNavigation est un composant Vue valide
      expect(navContent).toContain('<template>')
      expect(navContent).toContain('</template>')
      expect(navContent).toContain('<script setup lang="ts">')
      expect(navContent).toContain('</script>')
    })
  })
})
