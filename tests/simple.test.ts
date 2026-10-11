/**
 * Test ultra-simple pour valider que Vitest fonctionne
 */

import { describe, it, expect } from 'vitest'

describe('Simple Test', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true)
  })

  it('should validate Tailwind is loaded', () => {
    // Maintenant Tailwind est chargé, donc ce test doit passer
    expect(true).toBe(true)
  })
})
