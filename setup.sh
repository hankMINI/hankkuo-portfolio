#!/bin/bash
# Hank Portfolio Frontend - 新電腦一鍵設定
# 用法：bash setup.sh

set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
info() { echo -e "   $1"; }

echo ""
echo "🚀 Hank Portfolio 環境自動偵測中..."
echo ""

# ── 1. 偵測 CPU 架構（Apple Silicon / Intel）─────────────────
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
  BREW_PREFIX="/opt/homebrew"
  info "晶片：Apple Silicon (M系列)"
else
  BREW_PREFIX="/usr/local"
  info "晶片：Intel"
fi
echo ""

# ── 2. Xcode Command Line Tools ───────────────────────────────
if ! xcode-select -p &>/dev/null; then
  warn "未安裝 Xcode Command Line Tools，安裝中..."
  xcode-select --install
  echo "安裝完後重新執行 bash setup.sh"
  exit 1
else
  ok "Xcode Command Line Tools"
fi

# ── 3. Homebrew ───────────────────────────────────────────────
if ! command -v brew &>/dev/null; then
  warn "未安裝 Homebrew，安裝中..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$($BREW_PREFIX/bin/brew shellenv)"
  echo "eval \"\$(${BREW_PREFIX}/bin/brew shellenv)\"" >> ~/.zshrc
else
  ok "Homebrew $(brew --version | head -1)"
fi

# ── 4. Node.js ────────────────────────────────────────────────
NEED_NODE=false
if ! command -v node &>/dev/null; then
  NEED_NODE=true
  warn "未安裝 Node.js"
else
  NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d 'v')
  if [ "$NODE_MAJOR" -lt 18 ]; then
    NEED_NODE=true
    warn "Node.js 版本太舊（$(node -v)），需要 v20+"
  else
    ok "Node.js $(node -v)"
  fi
fi

if [ "$NEED_NODE" = true ]; then
  info "安裝 Node.js v20..."
  brew install node@20
  echo "export PATH=\"${BREW_PREFIX}/opt/node@20/bin:\$PATH\"" >> ~/.zshrc
  export PATH="${BREW_PREFIX}/opt/node@20/bin:$PATH"
  ok "Node.js $(node -v) 安裝完成"
fi

# ── 5. npm install ────────────────────────────────────────────
echo ""
info "安裝專案套件..."
npm install
ok "套件安裝完成"

# ── 完成 ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}🎉 設定完成！${NC}"
echo ""
echo "啟動前端："
echo "  npm run dev  →  http://localhost:8080"
echo ""
