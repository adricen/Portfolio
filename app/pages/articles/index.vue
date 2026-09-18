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
    <ArticlesTiles :articles="articles" />
  </div>
</template>   