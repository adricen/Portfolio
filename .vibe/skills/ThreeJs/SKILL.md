---
name: threejs
description: Patterns Three.js optimisés pour un portfolio — scenes légères, instancing, post-processing minimal.
---

# Three.js — Portfolio Optimisé

## Contraintes
- Max 1 scène active à la fois (pas de multi-scene)
- Polygones : < 50k par scène
- Pas de post-processing lourd (max 1 pass)
- Dispose() systématique sur les composants 3D au unmount

## Pattern recommandé
```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

let renderer: THREE.WebGPURenderer | null = null
let scene: THREE.Scene | null = null

onMounted(async () => {
  const THREE = await import('three')
  // Initialisation WebGPU avec fallback WebGL2
  renderer = new THREE.WebGPURenderer({ antialias: true })
  // ...
})

onBeforeUnmount(() => {
  renderer?.dispose()
  scene?.traverse(obj => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose()
      obj.material.dispose()
    }
  })
})
</script>   
