<template>
  <div class="test-page">
    <h1>Test WebGPU Shader Animé</h1>
    <p>Ce test vérifie les performances d'un background avec WebGPU et un shader TSL animé.</p>
    
    <div class="controls">
      <div class="control-group">
        <label>Mode de couleur:</label>
        <select v-model="colorMode">
          <option value="rgb">RGB (Oscillation)</option>
          <option value="hsv">HSV (Rotation de teinte)</option>
          <option value="wave">Wave (Vague de couleur)</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Couleur de base:</label>
        <input type="color" v-model="baseColorHex" @input="updateBaseColor" />
      </div>
      
      <div class="control-group">
        <label>Vitesse: {{ speed }}</label>
        <input type="range" v-model="speed" min="0.1" max="5" step="0.1" />
      </div>
      
      <div class="control-group">
        <label>Amplitude: {{ amplitude }}</label>
        <input type="range" v-model="amplitude" min="0" max="1" step="0.05" />
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="forceWebGL" />
          Forcer WebGL2 (désactiver WebGPU)
        </label>
      </div>
    </div>
    
    <div class="stats">
      <p>Temps d'initialisation: <strong>{{ initTime }}ms</strong></p>
      <p>Renderer: <strong>{{ rendererType }}</strong></p>
      <p>FPS: <strong>{{ fps }}</strong></p>
    </div>
    
    <WebGPUAnimatedBackground
      ref="backgroundRef"
      :color-mode="colorMode"
      :base-color="baseColor"
      :speed="speed"
      :amplitude="amplitude"
      :force-webgl="forceWebGL"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { AnimatedShaderScene } from '../utils/three/shaders'
import WebGPUAnimatedBackground from '../components/three/WebGPUAnimatedBackground.vue'

// State pour les contrôles
const colorMode = ref<'rgb' | 'hsv' | 'wave'>('rgb')
const baseColorHex = ref('#ff0000')
const baseColor = ref(0xff0000)
const speed = ref(1.0)
const amplitude = ref(0.5)
const forceWebGL = ref(false)

// Stats
const initTime = ref(0)
const rendererType = ref('')
const fps = ref(0)

// Référence au composant background
const backgroundRef = ref<InstanceType<typeof WebGPUAnimatedBackground> | null>(null)

// Mettre à jour la couleur de base à partir de l'hex
const updateBaseColor = () => {
  const hex = baseColorHex.value.replace('#', '')
  baseColor.value = parseInt(hex, 16)
}

// Calculer les FPS
let frameCount = 0
let lastFpsUpdate = performance.now()
let currentFps = 0

const updateFps = () => {
  frameCount++
  const now = performance.now()
  const elapsed = now - lastFpsUpdate
  
  if (elapsed >= 1000) {
    currentFps = Math.round((frameCount * 1000) / elapsed)
    fps.value = currentFps
    frameCount = 0
    lastFpsUpdate = now
  }
  
  requestAnimationFrame(updateFps)
}

// Démarrer le calcul des FPS
onMounted(() => {
  updateFps()
  
  // Écouter les événements du composant background
  // On utilise un watcher pour détecter quand la scène est chargée
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
})

onBeforeUnmount(() => {
  // Arrêter le calcul des FPS
  // (pas besoin de cancelAnimationFrame car updateFps est auto-appelant)
})

// Exposer pour le debugging
defineExpose({
  colorMode,
  baseColor,
  speed,
  amplitude,
  forceWebGL,
  initTime,
  rendererType,
  fps
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

.control-group input[type="color"] {
  width: 100%;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.control-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
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
</style>
