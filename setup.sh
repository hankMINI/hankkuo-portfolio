#!/bin/bash
# Hank Portfolio - 新電腦一鍵環境設定
# 用法：bash setup.sh

set -e
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "🚀 Hank Portfolio 環境設定開始..."
echo ""

# ── Homebrew ──────────────────────────────────────────────────
if ! command -v brew &>/dev/null; then
  echo "📦 安裝 Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo -e "${GREEN}✅ Homebrew 已安裝，略過${NC}"
fi

# ── Node.js v20 ───────────────────────────────────────────────
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 20 ]]; then
  echo "📦 安裝 Node.js v20..."
  brew install node@20
  echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
  export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
else
  echo -e "${GREEN}✅ Node.js $(node -v) 已安裝，略過${NC}"
fi

# ── npm install ───────────────────────────────────────────────
echo "📦 安裝前端套件..."
npm install

echo ""
echo -e "${GREEN}🎉 設定完成！${NC}"
echo ""
echo "啟動前端："
echo "  npm run dev"
echo ""
