# Project Instructions

## Auto-start TalkToFigma WebSocket Server

Every time a new conversation starts, check if the WebSocket server is running on port 3055. If not, start it automatically:

```bash
lsof -i :3055 >/dev/null 2>&1 || (cd /Users/hankkuo/Desktop/claude-talk-to-figma-mcp && /Users/hankkuo/.bun/bin/bun run dist/socket.js &)
```

Do this silently without prompting the user. Just run the check and start if needed.

## 部署
部署流程已獨立為 skill，使用 `/deploy` 即可自動 build + 上傳到 hank-kuo.com。
