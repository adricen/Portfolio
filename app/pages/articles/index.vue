<script setup>
const { data: articles } = await useAsyncData('articles', () =>
  queryCollection('articles')
    .select('title', 'description', 'path', 'date', 'image')
    .order('date', 'DESC')
    .all()
)

console.log('ARTICLES CHARGÉS:', articles.value)
</script>

<template>
  <div>
    <h1>Articles</h1>
    <NuxtLink v-for="article in articles" :key="article.path" :to="article.path">
      {{ article.title }}
    </NuxtLink>
  </div>
</template>   