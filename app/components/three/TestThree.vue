<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)
let renderer: any = null
let scene: any = null
let camera: any = null

onMounted(async () => {
  if (!canvasRef.value) return

  try {
    // Import dynamique de THREE
    const THREE = await import('three')
    
    console.log('✅ Three.js loaded successfully:', THREE)
    console.log('✅ WebGLRenderer available:', !!THREE.WebGLRenderer)
    
    // Créer une scène simple
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    
    // Créer le renderer avec fallback WebGPU -> WebGL2
    const WebGPURenderer = (THREE as any).WebGPURenderer
    
    if (WebGPURenderer) {
      try {
        renderer = new WebGPURenderer({ antialias: true, canvas: canvasRef.value })
        console.log('✅ WebGPU renderer created')
      } catch (e) {
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.value })
        console.log('✅ WebGL renderer created (fallback)')
      }
    } else {
      renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.value })
      console.log('✅ WebGL renderer created (WebGPU not available)')
    }
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x00ff00) // Vert pour le test
    
    // Animation simple
    const animate = () => {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
    
    console.log('✅ Three.js scene initialized successfully!')
    
  } catch (error) {
    console.error('❌ Failed to initialize Three.js:', error)
  }
})

onBeforeUnmount(() => {
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.traverse((obj: any) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose()
    })
  }
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
