# Personal Note

以 Astro 建立的個人 Obsidian 筆記網站。

## 撰寫筆記

使用 Obsidian 開啟 `content/` 資料夾。網站會發布其中所有沒有設定 `draft: true` 的 Markdown。

## 本機開發

```powershell
npm install
npm run dev
```

## 發布

將專案推送至 GitHub 的 `main` 分支後，GitHub Actions 會自動建置並部署至 GitHub Pages。第一次發布前，請將 `astro.config.mjs` 中的 `your-github-username` 改成 GitHub 帳號，並在 repository 的 Settings → Pages 將 Source 設為 GitHub Actions。
