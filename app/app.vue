<template>
  <BackgroundCanvas />
  <UApp>
    <UHeader>
      <!-- Hero / Title -->
      <template #left>
        <NuxtLink to="/" class="flex items-center gap-2 text-xl font-bold">
          <span class="text-highlighted">Portfolio</span>
        </NuxtLink>
      </template>

      <!-- Navigation - DIRECTEMENT dans UHeader, pas dans un slot -->
      <UNavigationMenu 
        :items="navItems" 
        orientation="horizontal"
        class="w-full"
      />

      <!-- Right actions -->
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <AppFooter />
  </UApp>
</template>

<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
import BackgroundCanvas from './components/three/BackgroundCanvas.vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const navItems: NavigationMenuItem[] = [
  {
    label: 'Accueil',
    icon: 'i-heroicons-home',
    to: '/'
  },
  {
    label: 'Articles',
    icon: 'i-heroicons-document-text',
    to: '/articles'
  },
  {
    label: 'À propos',
    icon: 'i-heroicons-information-circle',
    to: '/about'
  },
  {
    label: 'Contact',
    icon: 'i-heroicons-envelope',
    to: '/contact'
  }
]
</script>
