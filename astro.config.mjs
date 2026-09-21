import { defineConfig } from "astro/config"
import { unified } from "@astrojs/markdown-remark"
import { fileURLToPath } from "node:url"
import remarkGfm from "remark-gfm"

import remarkObsidianLinks, { remarkObsidianCallouts } from "./src/lib/remark-obsidian-links.mjs"

const repositoryName = "personal-note"
const base = `/${repositoryName}`
const contentDirectory = fileURLToPath(new URL("./content", import.meta.url))

export default defineConfig({
  site: "https://jacky-stc.github.io",
  base,
  output: "static",
  trailingSlash: "always",
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
