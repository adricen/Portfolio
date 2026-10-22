<script setup lang="ts">
// Ce composant est un exemple pour intégrer un canvas WebGL/Three.js en fond
// Tu pourras l'utiliser plus tard en l'ajoutant dans app.vue

const canvasRef = ref<HTMLCanvasElement | null>(null)
console.log('hello ?')
onMounted(() => {
  window.requestAnimationFrame(() => {
    console.log("canvasis:", canvasRef)
    if (canvasRef.value) {
      // Ici tu initialiseras ton canvas Three.js/WebGPU
      // Exemple de base :
      const canvas = canvasRef.value
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
        console.log("rect fill done!")
      }
    }
  })
})
</script>

<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full -z-10" aria-hidden="true" />
</template>
