<script setup lang="ts">
// Ce composant est un exemple pour intégrer un canvas WebGL/Three.js en fond
// Tu pourras l'utiliser plus tard en l'ajoutant dans app.vue

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    // Ici tu initialiseras ton canvas Three.js/WebGPU
    // Exemple de base :
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Simple animation d'exemple
      let animationId: number
      let time = 0
      
      const animate = () => {
        time += 0.01
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Simple gradient animation
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, `hsl(${Math.sin(time) * 60 + 200}, 70%, 10%)`)
        gradient.addColorStop(1, `hsl(${Math.sin(time + 1) * 60 + 260}, 70%, 20%)`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        // Draw some particles
        for (let i = 0; i < 50; i++) {
          const x = (Math.sin(time + i * 0.1) * 0.4 + 0.5) * canvas.width
          const y = (Math.cos(time + i * 0.1) * 0.4 + 0.5) * canvas.height
          const size = Math.sin(time + i * 0.2) * 2 + 2
          
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.sin(time + i * 0.3) * 0.3 + 0.2})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
        
        animationId = requestAnimationFrame(animate)
      }
      
      animate()
      
      // Cleanup
      onBeforeUnmount(() => {
        cancelAnimationFrame(animationId)
      })
    }
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full -z-10"
    aria-hidden="true"
  />
</template>
