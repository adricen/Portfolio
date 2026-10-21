<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { createWebGPUBackgroundScene, type AnimatedShaderScene } from '../../utils/three/shaders'
import { testWebGPUSupport, testWebGPURendererCreation } from '../../utils/three/webgpu-test'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animatedScene: AnimatedShaderScene | null = null

// Props pour la personnalisation
const props = defineProps({
  /**
   * Mode de couleur du shader
   * @default 'rgb'
   */
  colorMode: {
    type: String as () => 'hsv' | 'rgb' | 'wave',
    default: 'rgb',
    validator: (value: string) => ['hsv', 'rgb', 'wave'].includes(value)
  },
  /**
   * Couleur de base
   * @default 0xff0000 (rouge)
   */
  baseColor: {
    type: Number,
    default: 0xff0000
  },
  /**
   * Vitesse de l'animation
   * @default 1.0
   */
  speed: {
    type: Number,
    default: 1.0
  },
  /**
   * Amplitude de l'oscillation
   * @default 0.5
   */
  amplitude: {
    type: Number,
    default: 0.5
  },
  /**
   * Forcer WebGL2 (désactive WebGPU)
   * @default false
   */
  forceWebGL: {
    type: Boolean,
    default: false
  }
})

// État du test WebGPU
const webgpuStatus = ref<{
  available: boolean
  browserSupports: boolean
  threeHasRenderer: boolean
  rendererWorks: boolean
  error: string | null
} | null>(null)

// Temps d'initialisation
const initTime = ref(0)

onMounted(async () => {
  if (!canvasRef.value) return

  try {
    const startTime = performance.now()
    
    // Tester le support WebGPU
    const supportTest = await testWebGPUSupport()
    const rendererTest = await testWebGPURendererCreation()
    
    // Typage explicite pour éviter les erreurs TypeScript
    const rendererSuccess = rendererTest.success as boolean | undefined
    const rendererError = rendererTest.error as string | undefined
    
    webgpuStatus.value = {
      available: supportTest.browserSupportsWebGPU && supportTest.threeHasWebGPURenderer && (rendererSuccess ?? false),
      browserSupports: supportTest.browserSupportsWebGPU,
      threeHasRenderer: supportTest.threeHasWebGPURenderer,
      rendererWorks: rendererSuccess ?? false,
      error: supportTest.errorMessage || rendererError || null
    }
    
    // Logs détaillés
    console.log('🔍 WebGPU Status:')
    console.log(`   Browser supports: ${supportTest.browserSupportsWebGPU ? '✅' : '❌'}`)
    console.log(`   Three.js has WebGPURenderer: ${supportTest.threeHasWebGPURenderer ? '✅' : '❌'}`)
    console.log(`   Renderer creation: ${rendererTest.success ? '✅' : '❌'}`)
    if (webgpuStatus.value.error) {
      console.log(`   Error: ${webgpuStatus.value.error}`)
    }
    
    // Créer la scène
    const useWebGPU = webgpuStatus.value.available && !props.forceWebGL
    
    if (useWebGPU) {
      console.log('✅ Using WebGPU renderer')
    } else {
      console.log('ℹ️ Using WebGL2 renderer (fallback)')
      if (webgpuStatus.value.error) {
        console.log(`   Reason: ${webgpuStatus.value.error}`)
      }
    }
    
    animatedScene = await createWebGPUBackgroundScene({
      canvas: canvasRef.value,
      backgroundColor: 0x000000,
      colorMode: props.colorMode,
      baseColor: props.baseColor,
      speed: props.speed,
      amplitude: props.amplitude,
      forceWebGL: props.forceWebGL
    })
    
    initTime.value = performance.now() - startTime
    console.log(`✅ Scene initialized in ${initTime.value.toFixed(2)}ms`)
    console.log(`   Renderer: ${animatedScene.renderer.constructor.name}`)
    console.log(`   Color mode: ${props.colorMode}`)
    
    // Marquer le canvas comme chargé
    canvasRef.value.dataset.loaded = 'true'
    
  } catch (error) {
    console.error('❌ Failed to initialize WebGPU animated background:', error)
    webgpuStatus.value = {
      available: false,
      browserSupports: false,
      threeHasRenderer: false,
      rendererWorks: false,
      error: `Initialization failed: ${error}`
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
  webgpuStatus,
  initTime
})
</script>

<template>
  <div class="webgpu-container">
    <!-- Affiche un message si WebGPU n'est pas disponible -->
    <div v-if="webgpuStatus && !webgpuStatus.available && !props.forceWebGL" class="webgpu-warning">
      <p>⚠️ WebGPU non disponible</p>
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
}

.error-message {
  font-size: 0.8rem;
  margin: 0.25rem 0 0;
  color: #800;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
