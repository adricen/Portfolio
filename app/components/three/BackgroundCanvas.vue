<script setup lang="ts">
    const canvas = useTemplateRef<HTMLCanvasElement>('canvasRef')
    const ctx = ref<CanvasRenderingContext2D | null>(null);
    onMounted(() => {
        if (canvas.value) {
            ctx.value = canvas.value.getContext('2d');
            if (ctx.value) {
                // Dessiner un fond rouge pour tester
                ctx.value.fillStyle = '#142020';
                ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
                window.requestAnimationFrame(() => {
                    canvas.value?.setAttribute('data-loaded', 'true');
                });
                console.log('✅ Background canvas initialized');
            }
        }
    });
</script>

<template>
  <canvas
    ref="canvasRef"
    class="background-canvas"
    aria-hidden="true"
  />
</template>

<style scoped>
.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  /* Empêcher le rendu pendant le chargement */
  opacity: 0;
  transition: opacity 0.3s ease;
}

.background-canvas[data-loaded="true"] {
  opacity: 1;
}
</style>