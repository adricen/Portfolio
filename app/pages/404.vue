<script setup lang="ts">
useHead({
  title: '404 - Page non trouvée',
  meta: [
    { name: 'description', content: 'La page que vous cherchez n\'existe pas.' }
  ]
})

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <UCard class="text-center max-w-md">
      <template #header>
        <div class="flex justify-center">
          <UIcon name="i-heroicons-outline-exclamation-circle" class="w-16 h-16 text-red-500" />
        </div>
      </template>
      
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-6">
        Page non trouvée
      </p>
      
      <p class="text-gray-500 dark:text-gray-400 mb-8">
        La page que vous cherchez n'existe pas ou a été supprimée.
      </p>
      
      <div class="flex justify-center gap-4">
        <UButton 
          to="/" 
          color="primary" 
          variant="solid" 
          icon="i-heroicons-outline-home"
          @click="handleError"
        >
          Retour à l'accueil
        </UButton>
        
        <UButton 
          to="/articles" 
          color="primary" 
          variant="outline" 
          icon="i-heroicons-outline-document-text"
          @click="handleError"
        >
          Voir les articles
        </UButton>
      </div>
    </UCard>
  </div>
</template>
