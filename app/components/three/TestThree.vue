<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createBaseScene, type ThreeScene } from '../../utils/three/scene'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let threeScene: ThreeScene | null = null

onMounted(async () => {
  if (!canvasRef.value) return

  try {
    // Utiliser createBaseScene avec WebGPU si disponible
    threeScene = await createBaseScene({
      canvas: canvasRef.value,
      backgroundColor: 0x00ff00, // Vert pour le test
      antialias: true,
      powerPreference: 'high-performance',
      maxPixelRatio: 2 // Limiter à 2 pour éviter le sur-rendu
    })
    
    console.log('✅ Test scene initialized with renderer:', 
      threeScene.renderer.constructor.name)
    
  } catch (error) {
    console.error('❌ Failed to initialize test scene:', error)
  }
})

onBeforeUnmount(() => {
  threeScene?.dispose()
  threeScene = null
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="test-canvas"
    aria-hidden="true"
  />
</template>

<style scoped>
.test-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}
</style>
