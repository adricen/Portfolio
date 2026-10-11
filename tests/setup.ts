// Fichier de setup minimal pour Vitest
// Évite les erreurs de configuration

import { vi } from 'vitest'

// Mock basique pour éviter les erreurs
beforeAll(() => {
  // Ne rien faire pour l'instant
})

afterAll(() => {
  vi.restoreAllMocks()
})
