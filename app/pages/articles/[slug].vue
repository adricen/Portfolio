<script setup>
const route = useRoute()
const { data: article } = await useAsyncData(route.path, () =>
  queryCollection('articles').path(route.path).first()
)
</script>

<template>
  <article v-if="article">
    <h1>{{ article.title }}</h1>
    <ContentRenderer :value="article" />
  </article>
</template>   