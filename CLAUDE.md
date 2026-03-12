# Project Instructions

## 回覆語言
所有回覆使用繁體中文。

## 專案架構
- **前端**：Vue 3 + Vite（本 repo）
- **後台 CMS**：Strapi 5.39.0（獨立 repo：`hankMINI/hank-portfolio-cms`）
- **GitHub 帳號**：`hankMINI`
- **GitHub 驗證**：GitHub CLI (`gh`)，已儲存在 keyring

### Git Repositories
| 專案 | GitHub URL | 可見性 |
|------|------------|--------|
| 前端 | https://github.com/hankMINI/hankkuo-portfolio | private |
| CMS | https://github.com/hankMINI/hank-portfolio-cms | private |

### .gitignore 重點
- `node_modules/` — 用 `npm install` 還原
- `.env` — 含密碼，不能上傳
- `dist/`, `.strapi/`, `.tmp/` — 建置產出與暫存

### 檔案路徑規劃
- 前端：使用者指定的位置（預設 `~/Desktop/作品網站/hank-portfolio/`）
- CMS：一律放 `~/dev/hank-portfolio-cms/`（**不可放 iCloud 同步資料夾**，node_modules 會被蒸發）

## 本地開發
- 前端：`npm run dev` → http://localhost:8080
- CMS：`cd ~/dev/hank-portfolio-cms && npm run develop` → http://localhost:1337/admin
- CMS 管理員信箱：mini998839@gmail.com
- 前端透過 API 即時讀取 CMS 資料，CMS 離線時 fallback 到靜態 JS 檔

### 啟動後台提醒
當使用者請你啟動 CMS 後台時，結尾要提醒：
> 編輯完內容確認沒問題後，跟我說「部署」或執行 `npm run deploy` 就能更新到線上網站。

## 部署工作流程
1. 使用者在本地 CMS 編輯資料（工作經歷、作品等）
2. 前台本地即時顯示 CMS 最新內容
3. 使用者確認後，執行 `npm run deploy`
4. 自動：從 CMS 匯出資料 → build 前端 → 上傳到 hank-kuo.com

### 部署指令
- `npm run deploy` — 一鍵完成（匯出 + build + 上傳）
- `npm run export-cms` — 只匯出 CMS 資料（不 build 不上傳）

### 遠端伺服器（A2 Hosting）
- **域名**：hank-kuo.com
- **IP**：200.69.22.7
- **主機商**：A2 Hosting（cPanel）
- **cPanel 帳號**：hankkuoc
- **SSH**：`ssh -p 7822 hankkuoc@hank-kuo.com`（密碼：Mini781230）
- **Apache**：有 `.htaccess` SPA 路由
- **線上不跑 CMS**（共享主機記憶體不夠），純靜態前端

### 遠端目錄結構
```
~/public_html/          ← 前端網站（Vite build 輸出）
  ├── index.html
  ├── assets/           ← JS/CSS/圖片（Vite hash 檔名）
  ├── .htaccess         ← SPA 路由（所有路徑 → index.html）
  └── favicon.ico
```

## 換電腦自動安裝
當使用者在新電腦說「幫我下載 git」或「幫我安裝」時，**自動判斷環境並全部搞定，不要一步步問**：

### 步驟
1. 偵測環境：CPU 架構（M/Intel）、Homebrew、Node.js 版本
2. Clone 前端到使用者當前位置：
   ```bash
   git clone https://github.com/hankMINI/hankkuo-portfolio.git
   cd hankkuo-portfolio && bash setup.sh
   ```
3. Clone CMS 到 `~/dev/`（避開 iCloud）：
   ```bash
   mkdir -p ~/dev
   git clone https://github.com/hankMINI/hank-portfolio-cms.git ~/dev/hank-portfolio-cms
   cd ~/dev/hank-portfolio-cms && bash setup.sh
   ```
4. setup.sh 自動安裝：Xcode tools、Homebrew、Node.js v20、npm 套件
5. 提醒使用者：
   - CMS 需手動補 `.env`（含密鑰，不在 git）
   - CMS 首次需跑 seed：`STRAPI_ADMIN_EMAIL=mini998839@gmail.com STRAPI_ADMIN_PASSWORD=密碼 node scripts/seed.js`

### iCloud 注意事項
- Desktop/Documents 有 iCloud 同步，node_modules 會被「最佳化儲存空間」蒸發
- 症狀：ECANCELED errno -89
- **CMS 一律放 `~/dev/`**，前端放哪都可以

## CMS Schema 結構
### Collection Type: experiences（工作經歷）
欄位：slug, company, role, dateRange, logo, highlights(json), responsibilities(json), works(text), sortOrder

### Collection Type: projects（作品集）
欄位：slug, tag, title, subtitle, coverImage, images(多張), meta(component), detail(component), sortOrder

### Single Type: resume（履歷）
欄位：name, nameEn, intro(json), skills(component repeatable), education(json), featuredWorks(component repeatable), workExperience(component repeatable), avatar(media), resumePdf(media)
