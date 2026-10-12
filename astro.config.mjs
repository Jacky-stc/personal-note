import { defineConfig } from "astro/config"
import { unified } from "@astrojs/markdown-remark"
import sitemap from "@astrojs/sitemap"
import { fileURLToPath } from "node:url"
import remarkGfm from "remark-gfm"

import remarkObsidianLinks, { remarkObsidianCallouts } from "./src/lib/remark-obsidian-links.mjs"

const base = "/"
const contentDirectory = fileURLToPath(new URL("./content", import.meta.url))

export default defineConfig({
  site: "https://notes.jackysu.dev",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkGfm,
        [remarkObsidianLinks, { base, contentDirectory }],
        remarkObsidianCallouts,
      ],
      shikiConfig: {
        theme: "github-dark-default",
        wrap: true,
      },
    }),
  },
})
