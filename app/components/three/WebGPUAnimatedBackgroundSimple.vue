<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createWebGPUBackgroundScene, type AnimatedShaderScene } from '../../utils/three/shaders'
import { testWebGPUSupport, testWebGPURendererCreation, isWebGPUAvailable } from '../../utils/three/webgpu-test'
import WebGPUTestResult from './WebGPUTestResult.vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animatedScene: AnimatedShaderScene | null = null

// État du test WebGPU
const webgpuStatus = ref<{
  loading: boolean
  available: boolean
  error: string | null
}>({
  loading: true,
  available: false,
  error: null
})

onMounted(async () => {
  if (!canvasRef.value) return

  try {
    const startTime = performance.now()
    
    // Tester le support WebGPU
    const [supportTest, rendererTest] = await Promise.all([
      testWebGPUSupport(),
      testWebGPURendererCreation()
    ])
    
    const available = await isWebGPUAvailable()
    
    webgpuStatus.value = {
      loading: false,
      available,
      error: supportTest.errorMessage || rendererTest.error || null
    }
    
    // Logs détaillés
    console.log('🎯 WebGPU Test for Simple Background:')
    console.log(`   Available: ${available ? '✅' : '❌'}`)
    console.log(`   Browser supports: ${supportTest.browserSupportsWebGPU ? '✅' : '❌'}`)
    console.log(`   Three.js has renderer: ${supportTest.threeHasWebGPURenderer ? '✅' : '❌'}`)
    console.log(`   Renderer creation: ${rendererTest.success ? '✅' : '❌'}`)
    if (webgpuStatus.value.error) {
      console.log(`   Error: ${webgpuStatus.value.error}`)
    }
    console.log('===================')
    
    // Créer la scène avec fallback automatique
    // Si WebGPU n'est pas disponible, createWebGPUBackgroundScene utilisera WebGL2
    animatedScene = await createWebGPUBackgroundScene({
      canvas: canvasRef.value,
      backgroundColor: 0x000000,
      colorMode: 'hsv',
      baseColor: 0xff0000,
      speed: 0.5,
      amplitude: 0.8,
      forceWebGL: false // Laisser le choix automatique
    })
    
    const initTime = performance.now() - startTime
    console.log(`✅ Simple Background initialized in ${initTime.toFixed(2)}ms`)
    console.log(`   Renderer: ${animatedScene.renderer.constructor.name}`)
    console.log(`   WebGPU used: ${animatedScene.renderer.constructor.name.includes('WebGPU') ? '✅' : '❌ (WebGL2 fallback)'}`)
    
    // Marquer le canvas comme chargé
    canvasRef.value.dataset.loaded = 'true'
    
  } catch (error: any) {
    console.error('❌ Failed to initialize simple background:', error)
    webgpuStatus.value = {
      loading: false,
      available: false,
      error: `Initialization failed: ${error?.message || String(error)}`
    }
  }
})

onBeforeUnmount(() => {
  animatedScene?.dispose()
  animatedScene = null
})

// Exposer pour le debugging
defineExpose({
  animatedScene,
  webgpuStatus
})
</script>

<template>
  <div class="webgpu-container">
    <!-- Affiche le résultat du test WebGPU -->
    <WebGPUTestResult />
    
    <!-- Affiche un message si WebGPU n'est pas disponible -->
    <div v-if="!webgpuStatus.loading && !webgpuStatus.available" class="webgpu-warning">
      <p>⚠️ WebGPU non disponible - Utilisation de WebGL2</p>
      <p v-if="webgpuStatus.error" class="error-message">{{ webgpuStatus.error }}</p>
    </div>
    
    <canvas
      ref="canvasRef"
      class="webgpu-background-canvas"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.webgpu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}

.webgpu-background-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.webgpu-background-canvas[data-loaded="true"] {
  opacity: 1;
}

.webgpu-warning {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 0, 0.8);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  color: #000;
  z-index: 1000;
  pointer-events: auto;
  max-width: 300px;
}

.error-message {
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
  color: #800;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
