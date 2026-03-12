# Project Instructions

## Auto-start TalkToFigma WebSocket Server

Every time a new conversation starts, check if the WebSocket server is running on port 3055. If not, start it automatically:

```bash
lsof -i :3055 >/dev/null 2>&1 || (cd /Users/hankkuo/Desktop/claude-talk-to-figma-mcp && /Users/hankkuo/.bun/bin/bun run dist/socket.js &)
```

Do this silently without prompting the user. Just run the check and start if needed.

## 部署

### 遠端伺服器（A2 Hosting）
- **域名**：hank-kuo.com
- **IP**：200.69.22.7
- **主機商**：A2 Hosting（cPanel）
- **cPanel 帳號**：hankkuoc
- **SSH**：`ssh -p 7822 hankkuoc@hank-kuo.com`（密碼：Mini781230）
- **PHP**：8.2.30
- **Node.js**：v16.20.2（伺服器內建）
- **Apache**：有 `.htaccess` SPA 路由

### 遠端目錄結構
```
~/public_html/          ← 前端網站（Vite build 輸出）
  ├── index.html
  ├── assets/           ← JS/CSS/圖片（Vite hash 檔名）
  ├── .htaccess         ← SPA 路由（所有路徑 → index.html）
  └── favicon.ico

~/cms/                  ← Strapi CMS（已部署到伺服器）
  ├── dist/             ← Strapi build 輸出
  ├── node_modules/
  ├── src/
  ├── config/
  ├── public/uploads/   ← 媒體檔案
  └── .env

~/nodevenv/cms/         ← CMS 用的 Node.js 虛擬環境
```

### 前端部署
- 部署指令：`/deploy`（skill，自動 build + SFTP 上傳）
- Build：`npm run build` → `dist/`
- 上傳目標：`~/public_html/`

### CMS 狀態
- Strapi 5.39.0
- 本地開發：localhost:1337
- 遠端已部署到 `~/cms/`，但尚未正式啟用
- 線上版前端目前讀不到 CMS，會 fallback 到靜態 JS 資料
- 未來需啟用遠端 CMS，再改 `VITE_STRAPI_URL` 指向遠端

### 本地開發
- 前端：`npm run dev` → http://localhost:8080
- CMS：`cd ~/dev/hank-portfolio-cms && npm run develop` → http://localhost:1337/admin
- CMS 管理員：mini998839@gmail.com

### 換電腦
```bash
git clone https://github.com/hankMINI/hankkuo-portfolio.git
git clone https://github.com/hankMINI/hank-portfolio-cms.git
cd hankkuo-portfolio && bash setup.sh
cd ../hank-portfolio-cms && bash setup.sh
```
setup.sh 自動偵測並安裝：Xcode tools、Homebrew、Node.js v20。
CMS 需手動補 `.env` + 跑 `node scripts/seed.js` 匯入資料。
