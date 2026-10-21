<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { createBackgroundScene, type ThreeScene } from '../../utils/three/scene'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let threeScene: ThreeScene | null = null

onMounted(async () => {
  if (!canvasRef.value) return

  try {
    // Utiliser createBackgroundScene qui est optimisé pour les backgrounds
    // - Force WebGL2 (plus rapide à initialiser)
    // - Pixel ratio limité à 1
    // - Pas d'antialiasing
    threeScene = await createBackgroundScene({
      canvas: canvasRef.value,
      backgroundColor: 0xff0000, // Rouge
      powerPreference: 'high-performance'
    })
    
    console.log('✅ Background scene initialized')
  } catch (error) {
    console.error('❌ Failed to initialize background scene:', error)
  }
})

onBeforeUnmount(() => {
  // Nettoyer la scène
  threeScene?.dispose()
  threeScene = null
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="background-canvas"
    aria-hidden="true"
  />
</template>

<style scoped>
.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  /* Empêcher le rendu pendant le chargement */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.background-canvas[data-loaded="true"] {
  opacity: 1;
}
</style>
