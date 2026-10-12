# Personal Note

以 Astro 建立的個人 Obsidian 筆記網站。

## 撰寫筆記

使用 Obsidian 開啟 `content/` 資料夾。網站會發布其中所有沒有設定 `draft: true` 的 Markdown。

## 本機開發

```powershell
pnpm install
pnpm dev
```

## 發布

將專案推送至 GitHub 的 `main` 分支後，GitHub Actions 會自動建置並部署至 [notes.jackysu.dev](https://notes.jackysu.dev/)。

GitHub Pages 的 Source 設為 GitHub Actions，Custom domain 設為 `notes.jackysu.dev`；DNS 中 `notes` 的 CNAME 記錄指向 `jacky-stc.github.io`，不包含儲存庫名稱。網站地圖位於 [sitemap-index.xml](https://notes.jackysu.dev/sitemap-index.xml)。
