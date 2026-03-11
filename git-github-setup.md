# Git / GitHub 設定記錄

## GitHub 帳號
- 帳號：`hankMINI`
- 驗證方式：GitHub CLI (`gh`)，已儲存在 keyring

## Repositories

| 專案 | 本地路徑 | GitHub URL | 可見性 |
|------|----------|------------|--------|
| 前端 (Vue 3 + Vite) | `~/Desktop/作品網站/hank-portfolio/` | https://github.com/hankMINI/hankkuo-portfolio | private |
| 後台 (Strapi CMS) | `~/dev/hank-portfolio-cms/` | https://github.com/hankMINI/hank-portfolio-cms | private |

## .gitignore 重點規則

兩個專案都已有 `.gitignore`，以下不會被追蹤：
- `node_modules/` — 用 `npm install` 還原
- `.env` — 含密碼，不能上傳
- `dist/`, `.strapi/`, `.tmp/` — 建置產出與暫存

## 工作流程

```bash
# 改完程式碼後（在對應專案目錄）
git add .
git commit -m "說明這次改了什麼"
git push
```

或直接用 `/commit` 讓 Claude 幫你處理。

## 換電腦 / 還原環境

```bash
# 前端
git clone https://github.com/hankMINI/hankkuo-portfolio.git
cd hankkuo-portfolio && npm install

# 後台
git clone https://github.com/hankMINI/hank-portfolio-cms.git
cd hank-portfolio-cms && npm install
# 複製 .env 檔（需自行備份 .env 內容）
npm run develop
```

## 注意事項
- `node_modules` 不要放在 iCloud 路徑下（會被蒸發），後台已移到 `~/dev/` 避免此問題
- `.env` 含密碼，不上傳 git，需自行另外備份（例如存在密碼管理器）
- 資料庫 `.tmp/data.db` 不在 git 內，換電腦後需重新在 Strapi 後台輸入資料
