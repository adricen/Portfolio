<template>
  <UNavigationMenu 
    :items="navItems" 
    orientation="horizontal"
    class="w-full"
  />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { ref } from 'vue'

const navItems = ref<NavigationMenuItem[]>([
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
])
</script>
