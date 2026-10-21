<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { testWebGPUSupport, testWebGPURendererCreation, isWebGPUAvailable } from '../../utils/three/webgpu-test'

/**
 * Résultat du test WebGPU
 */
interface TestResult {
  loading: boolean
  available: boolean
  browserSupports: boolean
  threeHasRenderer: boolean
  rendererWorks: boolean
  error: string | null
  initTime: number
}

const result = ref<TestResult>({
  loading: true,
  available: false,
  browserSupports: false,
  threeHasRenderer: false,
  rendererWorks: false,
  error: null,
  initTime: 0
})

onMounted(async () => {
  const startTime = performance.now()
  
  try {
    // Exécuter tous les tests
    const [supportTest, rendererTest] = await Promise.all([
      testWebGPUSupport(),
      testWebGPURendererCreation()
    ])
    
    const available = await isWebGPUAvailable()
    
    result.value = {
      loading: false,
      available,
      browserSupports: supportTest.browserSupportsWebGPU,
      threeHasRenderer: supportTest.threeHasWebGPURenderer,
      rendererWorks: rendererTest.success ?? false,
      error: supportTest.errorMessage || rendererTest.error || null,
      initTime: performance.now() - startTime
    }
    
    // Logs
    console.log('🎯 WebGPU Test Result:')
    console.log(`   Available: ${result.value.available ? '✅' : '❌'}`)
    console.log(`   Browser supports: ${result.value.browserSupports ? '✅' : '❌'}`)
    console.log(`   Three.js has renderer: ${result.value.threeHasRenderer ? '✅' : '❌'}`)
    console.log(`   Renderer works: ${result.value.rendererWorks ? '✅' : '❌'}`)
    console.log(`   Init time: ${result.value.initTime.toFixed(2)}ms`)
    if (result.value.error) {
      console.log(`   Error: ${result.value.error}`)
    }
    console.log('===================')
    
  } catch (error: any) {
    result.value = {
      loading: false,
      available: false,
      browserSupports: false,
      threeHasRenderer: false,
      rendererWorks: false,
      error: `Test failed: ${error?.message || String(error)}`,
      initTime: performance.now() - startTime
    }
    console.error('❌ WebGPU test failed:', error)
  }
})
</script>

<template>
  <div class="webgpu-test-result" :class="{ loading: result.loading, available: result.available }">
    <div v-if="result.loading" class="status loading">
      <span class="icon">⏳</span>
      <span class="text">Testing WebGPU...</span>
    </div>
    
    <div v-else-if="result.available" class="status success">
      <span class="icon">✅</span>
      <span class="text">WebGPU Available</span>
      <span class="time">({{ result.initTime.toFixed(0) }}ms)</span>
    </div>
    
    <div v-else class="status failed">
      <span class="icon">❌</span>
      <span class="text">WebGPU Not Available</span>
      <span v-if="result.error" class="error-tooltip">
        ?
        <span class="tooltip-content">{{ result.error }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.webgpu-test-result {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 10000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 0.85rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.status.loading {
  background: rgba(255, 255, 0, 0.8);
  color: #000;
}

.status.success {
  background: rgba(0, 255, 0, 0.8);
  color: #000;
}

.status.failed {
  background: rgba(255, 0, 0, 0.8);
  color: #fff;
}

.icon {
  font-size: 1rem;
}

.text {
  font-weight: 500;
}

.time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.error-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: help;
  font-size: 0.75rem;
}

.error-tooltip:hover .tooltip-content {
  display: block;
}

.tooltip-content {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  max-width: 300px;
  text-align: center;
  margin-bottom: 0.5rem;
  z-index: 10001;
}
</style>
