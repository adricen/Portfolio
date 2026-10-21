<template>
  <div class="test-page">
    <h1>Test WebGPU Complet</h1>
    <p>Cette page teste le support WebGPU et affiche un background animé si disponible.</p>
    
    <!-- Composant de statut WebGPU -->
    <WebGPUStatus ref="statusRef" />
    
    <!-- Contrôles -->
    <div class="controls">
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="showBackground" />
          Afficher le background animé
        </label>
      </div>
      
      <div class="control-group" v-if="showBackground">
        <label>Mode de couleur:</label>
        <select v-model="colorMode" :disabled="!canUseWebGPU">
          <option value="hsv">HSV (Arc-en-ciel)</option>
          <option value="rgb">RGB (Oscillation)</option>
          <option value="wave">Wave (Vague)</option>
        </select>
      </div>
      
      <div class="control-group" v-if="showBackground">
        <label>Vitesse: {{ speed }}</label>
        <input type="range" v-model="speed" min="0.1" max="5" step="0.1" :disabled="!canUseWebGPU" />
      </div>
    </div>
    
    <!-- Statistiques -->
    <div class="stats">
      <p>Temps d'initialisation: <strong>{{ initTime }}ms</strong></p>
      <p>Renderer: <strong>{{ rendererType }}</strong></p>
      <p>FPS: <strong>{{ fps }}</strong></p>
      <p>WebGPU disponible: <strong :class="canUseWebGPU ? 'available' : 'unavailable'">{{ canUseWebGPU ? '✅ Oui' : '❌ Non' }}</strong></p>
    </div>
    
    <!-- Background animé (conditionnel) -->
    <WebGPUAnimatedBackground
      v-if="showBackground && canUseWebGPU"
      ref="backgroundRef"
      :color-mode="colorMode"
      :speed="speed"
      :amplitude="0.8"
      :force-webgl="forceWebGL"
    />
    
    <!-- Message si WebGPU n'est pas disponible -->
    <div v-else-if="showBackground && !canUseWebGPU" class="webgpu-warning">
      <p>⚠️ WebGPU n'est pas disponible. Utilisez WebGL2 à la place.</p>
      <p>Activez le fallback WebGL2 pour voir le background.</p>
      <button @click="forceWebGL = true" class="enable-fallback">
        Activer WebGL2 Fallback
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { AnimatedShaderScene } from '../utils/three/shaders'
import WebGPUStatus from '../components/three/WebGPUStatus.vue'
import WebGPUAnimatedBackground from '../components/three/WebGPUAnimatedBackground.vue'
import { isWebGPUAvailable } from '../utils/three/webgpu-test'

// State
const showBackground = ref(true)
const colorMode = ref<'hsv' | 'rgb' | 'wave'>('hsv')
const speed = ref(1.0)
const forceWebGL = ref(false)
const canUseWebGPU = ref(false)

// Stats
const initTime = ref(0)
const rendererType = ref('')
const fps = ref(0)

// Références
const statusRef = ref<InstanceType<typeof WebGPUStatus> | null>(null)
const backgroundRef = ref<InstanceType<typeof WebGPUAnimatedBackground> | null>(null)

// Vérifier le support WebGPU au montage
onMounted(async () => {
  canUseWebGPU.value = await isWebGPUAvailable()
  
  // Mettre à jour les stats quand le background est chargé
  const unwatch = watch(
    () => backgroundRef.value?.animatedScene,
    (scene: AnimatedShaderScene | null | undefined) => {
      if (scene) {
        initTime.value = performance.now()
        rendererType.value = scene.renderer.constructor.name
      }
    },
    { immediate: true }
  )
  
  onBeforeUnmount(() => {
    unwatch()
  })
  
  // Calculer les FPS
  startFpsCounter()
})

// Compteur de FPS
let frameCount = 0
let lastFpsUpdate = performance.now()

const startFpsCounter = () => {
  const updateFps = () => {
    frameCount++
    const now = performance.now()
    const elapsed = now - lastFpsUpdate
    
    if (elapsed >= 1000) {
      fps.value = Math.round((frameCount * 1000) / elapsed)
      frameCount = 0
      lastFpsUpdate = now
    }
    
    requestAnimationFrame(updateFps)
  }
  
  updateFps()
}

// Exposer pour le debugging
defineExpose({
  showBackground,
  colorMode,
  speed,
  forceWebGL,
  canUseWebGPU,
  initTime,
  rendererType,
  fps,
  statusRef,
  backgroundRef
})
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  padding: 2rem;
  position: relative;
  z-index: 1;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.test-page h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.test-page p {
  margin-bottom: 2rem;
  max-width: 600px;
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 1.5rem;
  border-radius: 8px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group select,
.control-group input[type="range"] {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #444;
  background: #222;
  color: white;
}

.control-group input[type="range"]:disabled,
.control-group select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.9rem;
}

.stats p {
  margin: 0.25rem 0;
}

.stats strong {
  color: #00ff00;
}

.stats .available {
  color: #00ff00;
}

.stats .unavailable {
  color: #ff0000;
}

.webgpu-warning {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  z-index: 1000;
}

.webgpu-warning p {
  margin: 0 0 1rem;
  font-size: 1.1rem;
}

.enable-fallback {
  background: #00aa00;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.enable-fallback:hover {
  background: #00cc00;
}
</style>
