import { readdirSync, readFileSync } from "node:fs"
import { basename, join, relative } from "node:path"
import { visit } from "unist-util-visit"

const trimSlash = (value) => value.replace(/\/$/, "")
const normalizeTarget = (target) => target.replace(/\.md$/i, "").replace(/\\/g, "/")

const frontmatterValue = (source, key) => {
  const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1]
  const value = frontmatter?.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"))?.[1]
  if (!value) return undefined
  return value.replace(
    /^(?:"([\s\S]*)"|'([\s\S]*)')$/,
    (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted,
  )
}

const markdownFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "private" || entry.name === "templates") return []
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return markdownFiles(path)
    return entry.isFile() && entry.name.toLowerCase().endsWith(".md") ? [path] : []
  })

const noteSlugMap = (contentDirectory) => {
  const slugs = new Map()
  if (!contentDirectory) return slugs

  for (const path of markdownFiles(contentDirectory)) {
    const source = readFileSync(path, "utf8")
    const sourcePath = normalizeTarget(relative(contentDirectory, path))
    const sourceName = basename(sourcePath)
    const title = frontmatterValue(source, "title")
    const slug = sourcePath === "index" ? "" : frontmatterValue(source, "slug")
    if (slug === undefined) continue

    slugs.set(sourcePath, slug)
    slugs.set(sourceName, slug)
    if (title) slugs.set(title, slug)
  }

  return slugs
}

export default function remarkObsidianLinks(options = {}) {
  const base = trimSlash(options.base ?? "")

  return (tree) => {
    const slugs = noteSlugMap(options.contentDirectory)

    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === undefined || !node.value.includes("[[")) return

      const pattern = /\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]/g
      const children = []
      let cursor = 0
      let match

      while ((match = pattern.exec(node.value)) !== null) {
        if (match.index > cursor) {
          children.push({ type: "text", value: node.value.slice(cursor, match.index) })
        }

        const target = normalizeTarget(match[1].trim())
        const label = (match[2] ?? match[1]).trim()
        const slug = slugs.get(target)
        const url = slug === "" ? `${base}/` : `${base}/notes/${encodeURI(slug ?? target)}/`

        children.push({
          type: "link",
          url,
          children: [{ type: "text", value: label }],
        })
        cursor = pattern.lastIndex
      }

      if (children.length === 0) return
      if (cursor < node.value.length) {
        children.push({ type: "text", value: node.value.slice(cursor) })
      }
      parent.children.splice(index, 1, ...children)
      return index + children.length
    })
  }
}

export function remarkObsidianCallouts() {
  return (tree) => {
    visit(tree, "blockquote", (node) => {
      const paragraph = node.children?.[0]
      const firstText = paragraph?.type === "paragraph" ? paragraph.children?.[0] : undefined
      if (firstText?.type !== "text") return

      const match = firstText.value.match(/^\[!(\w+)\]\s*([^\n]*)(?:\n([\s\S]*))?/i)
      if (!match) return

      const type = match[1].toLowerCase()
      const title = match[2] || (type === "tip" ? "提示" : "注意")
      const body = match[3]
      paragraph.children.splice(
        0,
        1,
        { type: "strong", children: [{ type: "text", value: title }] },
        ...(body ? [{ type: "break" }, { type: "text", value: body }] : []),
      )
      node.data = {
        ...node.data,
        hName: "aside",
        hProperties: { className: ["callout", `callout-${type}`] },
      }
    })
  }
}
