import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ 
    pattern: '**/*.md', 
    base: './articles'
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.number().transform((val) => {
      const s = String(val);
      return new Date(`${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6, 8)}`);
    }),
  }),
});

export const collections = { blog };
