<template>
  <UHeader>
    <!-- Hero / Title section -->
    <template #left>
      <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold">
        <span class="text-highlighted">Portfolio</span>
      </NuxtLink>
    </template>

    <!-- Navigation section -->
    <template #center>
      <AppNavigation />
    </template>

    <!-- Right section (optional actions) -->
    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
// No script needed for now, AppNavigation handles its own data
</script>
