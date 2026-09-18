<script setup>
const { data: articles } = await useAsyncData('home-articles', () =>
  queryCollection('articles')
    .select('title', 'description', 'path', 'image')
    .order('date', 'DESC')
    .limit(3)
    .all()
)
</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <NuxtLink v-for="article in articles" :key="article.path" :to="article.path" class="card">
      <img v-if="article.image" :src="article.image" :alt="article.title" />
      <h3>{{ article.title }}</h3>
      <p>{{ article.description }}</p>
    </NuxtLink>
  </div>
</template>   