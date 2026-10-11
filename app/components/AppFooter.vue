<template>
  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} — Portfolio Technique
      </p>
    </template>

    <template #center>
      <div class="flex items-center gap-6">
        <UButton
          v-for="(link, index) in socialLinks"
          :key="index"
          :to="link.to"
          :icon="link.icon"
          variant="ghost"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="link.label"
          class="text-muted hover:text-default transition-colors"
        />
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-4 text-sm text-muted">
        <NuxtLink
          to="/about"
          class="hover:text-default transition-colors"
        >
          À propos
        </NuxtLink>
        <span class="text-muted">|</span>
        <NuxtLink
          to="/contact"
          class="hover:text-default transition-colors"
        >
          Contact
        </NuxtLink>
        <span class="text-muted">|</span>
        <span>WebGPU / Three.js</span>
      </div>
    </template>
  </UFooter>
</template>

<script setup lang="ts">
interface SocialLink {
  label: string
  icon: string
  to: string
}

const socialLinks: SocialLink[] = [
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    to: 'https://github.com/acentonze'
  },
  {
    label: 'LinkedIn',
    icon: 'i-simple-icons-linkedin',
    to: 'https://linkedin.com/in/acentonze'
  },
  {
    label: 'Email',
    icon: 'i-heroicons-envelope',
    to: 'mailto:contact@acentonze.dev'
  },
  {
    label: 'CV',
    icon: 'i-heroicons-document-text',
    to: '/cv.pdf'
  }
]
</script>
