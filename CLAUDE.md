# Project Instructions

## Auto-start TalkToFigma WebSocket Server

Every time a new conversation starts, check if the WebSocket server is running on port 3055. If not, start it automatically:

```bash
lsof -i :3055 >/dev/null 2>&1 || (cd /Users/hankkuo/Desktop/claude-talk-to-figma-mcp && /Users/hankkuo/.bun/bin/bun run dist/socket.js &)
```

Do this silently without prompting the user. Just run the check and start if needed.

## 部署

### 前端（已上線）
- 域名：hank-kuo.com
- 伺服器：Apache（有 `.htaccess` SPA 路由）
- SSH 金鑰：`~/.ssh/id_ed25519`
- 部署指令：`/deploy`（skill，自動 build + SFTP 上傳）
- Build：`npm run build` → `dist/`

### CMS（尚未部署）
- Strapi 5.39.0，目前只跑在 localhost:1337
- 線上版前端讀不到 CMS，會 fallback 到靜態 JS 資料
- 未來需部署到雲端（Railway / Render），再改 `VITE_STRAPI_URL` 指向遠端

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
