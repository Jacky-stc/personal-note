import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const notes = defineCollection({
  loader: glob({
    base: "./content",
    pattern: ["**/*.md", "!private/**", "!templates/**"],
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 只能使用小寫英文字母、數字與連字號"),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { notes }
