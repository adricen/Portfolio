import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
        source: 'articles/*.md',
        type: 'page',
        schema: z.object({
            title: z.string(),
            description: z.string(),
            date: z.date(),
            image: z.string().optional(),
            tags: z.array(z.string()).default([]),
        }),
    })
  }
})