<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWebGPUStatus, testWebGPUSupport, testWebGPURendererCreation } from '../../utils/three/webgpu-test'

/**
 * État du test WebGPU
 */
interface WebGPUStatusState {
  loading: boolean
  error: string | null
  browserSupportsWebGPU: boolean | null
  threeHasWebGPURenderer: boolean | null
  canUseWebGPU: boolean | null
  rendererType: 'webgpu' | 'webgl' | null
  rendererCreationSuccess: boolean | null
  rendererCreationError: string | null
  fallbackAvailable: boolean | null
}

const status = ref<WebGPUStatusState>({
  loading: true,
  error: null,
  browserSupportsWebGPU: null,
  threeHasWebGPURenderer: null,
  canUseWebGPU: null,
  rendererType: null,
  rendererCreationSuccess: null,
  rendererCreationError: null,
  fallbackAvailable: null
})

/**
 * Exécute tous les tests WebGPU
 */
async function runTests() {
  status.value = {
    loading: true,
    error: null,
    browserSupportsWebGPU: null,
    threeHasWebGPURenderer: null,
    canUseWebGPU: null,
    rendererType: null,
    rendererCreationSuccess: null,
    rendererCreationError: null,
    fallbackAvailable: null
  }

  try {
    // Test 1 : Support du navigateur
    const supportTest = await testWebGPUSupport()
    status.value.browserSupportsWebGPU = supportTest.browserSupportsWebGPU
    status.value.threeHasWebGPURenderer = supportTest.threeHasWebGPURenderer
    status.value.canUseWebGPU = supportTest.canUseWebGPU
    status.value.rendererType = supportTest.rendererType
    status.value.error = supportTest.errorMessage || null

    // Test 2 : Création du renderer
    const rendererTest = await testWebGPURendererCreation()
    status.value.rendererCreationSuccess = rendererTest.success
    status.value.rendererCreationError = rendererTest.error || null
    status.value.fallbackAvailable = !!rendererTest.fallbackRenderer

  } catch (error) {
    status.value.error = `Test failed: ${error}`
  } finally {
    status.value.loading = false
  }
}

// Exécuter les tests au montage
onMounted(() => {
  runTests()
})

// Fonction pour relancer les tests
defineExpose({ runTests })
</script>

<template>
  <div class="webgpu-status">
    <h2>WebGPU Status</h2>
    
    <div v-if="status.loading" class="status-loading">
      <p>⏳ Testing WebGPU support...</p>
    </div>
    
    <div v-else class="status-results">
      <!-- Erreur globale -->
      <div v-if="status.error" class="status-error">
        <p>❌ Error: {{ status.error }}</p>
      </div>
      
      <!-- Résultats -->
      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">Browser Support:</span>
          <span class="status-value" :class="status.browserSupportsWebGPU ? 'success' : 'failed'">
            {{ status.browserSupportsWebGPU ? '✅ Yes' : '❌ No' }}
          </span>
        </div>
        
        <div class="status-item">
          <span class="status-label">Three.js WebGPURenderer:</span>
          <span class="status-value" :class="status.threeHasWebGPURenderer ? 'success' : 'failed'">
            {{ status.threeHasWebGPURenderer ? '✅ Available' : '❌ Not available' }}
          </span>
        </div>
        
        <div class="status-item">
          <span class="status-label">Can Use WebGPU:</span>
          <span class="status-value" :class="status.canUseWebGPU ? 'success' : 'failed'">
            {{ status.canUseWebGPU ? '✅ Yes' : '❌ No' }}
          </span>
        </div>
        
        <div class="status-item">
          <span class="status-label">Renderer Type:</span>
          <span class="status-value">
            {{ status.rendererType || 'Unknown' }}
          </span>
        </div>
        
        <div class="status-item">
          <span class="status-label">WebGPURenderer Creation:</span>
          <span class="status-value" :class="status.rendererCreationSuccess ? 'success' : 'failed'">
            {{ status.rendererCreationSuccess ? '✅ Success' : '❌ Failed' }}
          </span>
        </div>
        
        <div class="status-item">
          <span class="status-label">WebGL Fallback:</span>
          <span class="status-value" :class="status.fallbackAvailable ? 'success' : 'failed'">
            {{ status.fallbackAvailable ? '✅ Available' : '❌ Not available' }}
          </span>
        </div>
      </div>
      
      <!-- Détails des erreurs -->
      <div v-if="status.rendererCreationError" class="status-error-details">
        <p><strong>Renderer Creation Error:</strong></p>
        <p class="error-message">{{ status.rendererCreationError }}</p>
      </div>
      
      <!-- Résumé -->
      <div class="status-summary">
        <h3>Summary</h3>
        <p v-if="status.canUseWebGPU && status.rendererCreationSuccess">
          ✅ WebGPU is fully supported and working! You can use WebGPURenderer.
        </p>
        <p v-else-if="status.canUseWebGPU && !status.rendererCreationSuccess">
          ⚠️ WebGPU is supported but renderer creation failed. Fallback to WebGL2 will be used.
        </p>
        <p v-else-if="!status.canUseWebGPU && status.fallbackAvailable">
          ⚠️ WebGPU is not available. WebGL2 fallback is working.
        </p>
        <p v-else>
          ❌ WebGPU is not available and fallback failed. Check console for details.
        </p>
      </div>
      
      <button @click="runTests" class="refresh-button">
        🔄 Refresh Tests
      </button>
    </div>
  </div>
</template>

<style scoped>
.webgpu-status {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 1.5rem;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 1rem auto;
}

.webgpu-status h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #00ff00;
}

.status-loading {
  text-align: center;
  padding: 2rem;
  color: #ffff00;
}

.status-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-label {
  font-size: 0.85rem;
  color: #aaaaaa;
  font-weight: 500;
}

.status-value {
  font-size: 1rem;
  font-weight: 600;
}

.status-value.success {
  color: #00ff00;
}

.status-value.failed {
  color: #ff0000;
}

.status-error {
  background: rgba(255, 0, 0, 0.2);
  border: 1px solid #ff0000;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.status-error-details {
  background: rgba(255, 255, 0, 0.1);
  border: 1px solid #ffff00;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
}

.error-message {
  font-family: monospace;
  font-size: 0.85rem;
  color: #ffaa00;
  white-space: pre-wrap;
  word-break: break-all;
}

.status-summary {
  background: rgba(0, 0, 255, 0.1);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
}

.status-summary h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #00ffff;
}

.status-summary p {
  margin: 0;
  font-size: 0.9rem;
}

.refresh-button {
  background: #00aa00;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
  align-self: flex-start;
}

.refresh-button:hover {
  background: #00cc00;
}

.refresh-button:active {
  background: #008800;
}
</style>
