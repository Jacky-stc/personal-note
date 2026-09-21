import type { CollectionEntry } from "astro:content"

export const noteSlug = (note: CollectionEntry<"notes">) => note.data.slug

export const noteHref = (note: CollectionEntry<"notes">, base: string) => {
  const slug = noteSlug(note)
  return slug === "home" ? `${base}/` : `${base}/notes/${encodeURI(slug)}/`
}

export const visibleNotes = (notes: CollectionEntry<"notes">[]) =>
  notes
    .filter((note) => !note.data.draft)
    .sort((a, b) => a.data.title.localeCompare(b.data.title, "zh-Hant"))
