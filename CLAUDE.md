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
- **Apache**：有 `.htaccess` SPA 路由

### 遠端目錄結構
```
~/public_html/          ← 前端網站（Vite build 輸出）
  ├── index.html
  ├── assets/           ← JS/CSS/圖片（Vite hash 檔名）
  ├── .htaccess         ← SPA 路由（所有路徑 → index.html）
  └── favicon.ico
```

### 前端部署
- 部署指令：`bash deploy.sh prd`
- Build：`npm run build:prd` → `dist/`
- 上傳目標：`~/public_html/`（透過 rsync + expect）

### 本地開發
- 前端：`npm run dev` → http://localhost:8080

### 換電腦
```bash
git clone https://github.com/hankMINI/hankkuo-portfolio.git
cd hankkuo-portfolio && bash setup.sh
```
setup.sh 自動偵測並安裝：Xcode tools、Homebrew、Node.js v20。
