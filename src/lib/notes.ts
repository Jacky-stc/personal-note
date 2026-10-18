import type { CollectionEntry } from "astro:content"

const preferredCategoryOrder = new Map([
  ["React", 0],
  ["AI", 1],
  ["LeetCode", 2],
])
const categoryCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" })
const titleCollator = new Intl.Collator("zh-Hant", { numeric: true, sensitivity: "base" })
const numberedLeetCodeSlug = /^leetcode-\d+-/

export const noteSlug = (note: CollectionEntry<"notes">) => note.data.slug

export const noteHref = (note: CollectionEntry<"notes">, base: string) => {
  const slug = noteSlug(note)
  return slug === "home" ? `${base}/` : `${base}/notes/${encodeURI(slug)}/`
}

const compareCategories = (a?: string, b?: string) => {
  const categoryA = a?.trim()
  const categoryB = b?.trim()

  if (categoryA === categoryB) return 0
  if (!categoryA) return 1
  if (!categoryB) return -1

  const rankA = preferredCategoryOrder.get(categoryA) ?? Number.MAX_SAFE_INTEGER
  const rankB = preferredCategoryOrder.get(categoryB) ?? Number.MAX_SAFE_INTEGER

  return rankA - rankB || categoryCollator.compare(categoryA, categoryB)
}

const compareLeetCodeNotes = (a: CollectionEntry<"notes">, b: CollectionEntry<"notes">) => {
  if (a.data.category?.trim() !== "LeetCode" || b.data.category?.trim() !== "LeetCode") return 0

  return (
    Number(numberedLeetCodeSlug.test(noteSlug(a))) - Number(numberedLeetCodeSlug.test(noteSlug(b)))
  )
}

export const visibleNotes = (notes: CollectionEntry<"notes">[]) =>
  notes
    .filter((note) => !note.data.draft)
    .sort(
      (a, b) =>
        compareCategories(a.data.category, b.data.category) ||
        compareLeetCodeNotes(a, b) ||
        titleCollator.compare(a.data.title, b.data.title),
    )
