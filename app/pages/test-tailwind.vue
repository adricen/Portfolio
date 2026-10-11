<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <h1 class="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-6">
      Test Tailwind CSS
    </h1>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md">
      <p class="text-gray-700 dark:text-gray-300 mb-4">
        Cette page teste si Tailwind CSS est correctement intégré.
      </p>
      
      <!-- Test des classes utilitaires de base -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-red-500 rounded-full"></div>
          <span class="text-sm">Couleur rouge (bg-red-500)</span>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-green-500 rounded-full"></div>
          <span class="text-sm">Couleur verte (bg-green-500)</span>
        </div>
        
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span class="text-sm">Couleur bleue (bg-blue-500)</span>
        </div>
      </div>
      
      <!-- Test des classes de typographie -->
      <div class="mt-6 space-y-2">
        <h2 class="text-2xl font-semibold">Titre H2</h2>
        <h3 class="text-xl font-medium">Titre H3</h3>
        <p class="text-sm text-gray-500">Texte petit et gris</p>
        <p class="text-lg font-bold">Texte grand et gras</p>
      </div>
      
      <!-- Test des classes de layout -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <div class="bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
          <span class="text-xs">Colonne 1</span>
        </div>
        <div class="bg-purple-100 dark:bg-purple-900 p-4 rounded">
          <span class="text-xs">Colonne 2</span>
        </div>
      </div>
      
      <!-- Test des classes de padding et margin -->
      <div class="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="text-center text-gray-500 dark:text-gray-400">
          Test des bordures et espacements
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page de test pour vérifier que Tailwind CSS fonctionne
useHead({
  title: 'Test Tailwind CSS'
})
</script>
