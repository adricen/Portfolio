// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
  ],
  tailwindcss: {
    // Options - Todo dark mode for exemple
  },
  css: ['~/assets/css/main.css'],
})

// Todo - install content for markdown support, and color-mode for day / night template