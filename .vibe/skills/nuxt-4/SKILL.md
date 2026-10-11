---
name: nuxt4
description: Expertise Nuxt 4 — optimisation, SSR/SSG, configuration, modules. Utiliser pour toute tâche Nuxt.
---

# Nuxt 4 — Optimisation & Patterns

## Règle n°1 : Toujours consulter le MCP Nuxt
Avant toute décision d'architecture ou API, appeler le prompt MCP `find-documentation-for-topic` avec le sujet concerné. Ne jamais deviner une API.

## Optimisations clés
- **Code splitting** : `defineAsyncComponent` + `lazy: true` sur les routes 3D
- **SSR vs SSG** : SSG pour les pages statiques (hero, about), SSR pour les pages dynamiques
- **Data fetching** : `useAsyncData` avec `server: false` pour les données client-only (WebGPU)
- **Bundle** : `build.transpile` pour Three.js, externaliser les gros modules
- **Image** : `@nuxt/image` avec format AVIF/WebP

## SIMD-ready patterns
- Utiliser `Float32Array` / `Uint8Array` pour les buffers GPU
- Batcher les uploads avec `DataTransfer` quand disponible
- Éviter les allocations dans les boucles de rendu

## Anti-patterns
- ❌ `import * as THREE from 'three'` → ✅ `import { Scene, PerspectiveCamera } from 'three'`
- ❌ Créer le renderer dans `setup()` → ✅ dans `onMounted` avec `defineAsyncComponent`
- ❌ SSG pour une page qui utilise WebGPU (pas de GPU côté serveur)   
