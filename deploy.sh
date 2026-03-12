#!/bin/bash
# Hank Portfolio - Deploy Script
# Usage: bash deploy.sh [sit|prd]

set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "   $1"; }

# ── Parse argument ─────────────────────────────────────────
ENV="${1:-sit}"

if [ "$ENV" != "sit" ] && [ "$ENV" != "prd" ]; then
  err "Usage: bash deploy.sh [sit|prd]"
fi

echo ""
echo "🚀 Deploying hank-portfolio [$ENV]"
echo "──────────────────────────────────"

# ── Paths ──────────────────────────────────────────────────
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$PROJECT_DIR/dist"

# ── Remote server config (PRD) ─────────────────────────────
REMOTE_HOST="hank-kuo.com"
REMOTE_PORT=7822
REMOTE_USER="hankkuoc"
REMOTE_PATH="/home/hankkuoc/public_html"

# ─────────────────────────────────────────────────────────────
# SIT: Build + Local Preview
# ─────────────────────────────────────────────────────────────
if [ "$ENV" = "sit" ]; then
  echo ""
  info "Environment: SIT (Local)"
  info "Mode: sit → .env.sit"
  echo ""

  # Check CMS status
  if curl -s http://localhost:1337/_health > /dev/null 2>&1; then
    ok "Strapi CMS is running on localhost:1337"
  else
    warn "Strapi CMS is NOT running — frontend will use static fallback data"
  fi

  # Build
  echo ""
  info "Building for SIT..."
  cd "$PROJECT_DIR"
  npm run build:sit
  ok "Build complete → $DIST_DIR"

  # Preview
  echo ""
  info "Starting preview server..."
  echo -e "${GREEN}🌐 http://localhost:4173${NC}"
  echo ""
  npx vite preview
fi

# ─────────────────────────────────────────────────────────────
# PRD: Build + SFTP Upload to A2 Hosting
# ─────────────────────────────────────────────────────────────
if [ "$ENV" = "prd" ]; then
  echo ""
  info "Environment: PRD (hank-kuo.com)"
  info "Mode: production → .env.production"
  info "Target: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
  echo ""

  # Confirm
  echo -e "${YELLOW}⚠️  This will upload to PRODUCTION (hank-kuo.com).${NC}"
  read -p "   Continue? [y/N] " confirm
  if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Cancelled."
    exit 0
  fi

  # Build
  echo ""
  info "Building for PRD..."
  cd "$PROJECT_DIR"
  npm run build:prd
  ok "Build complete → $DIST_DIR"

  # Check SSH key or password
  SSH_KEY="$HOME/.ssh/id_ed25519"
  if [ -f "$SSH_KEY" ]; then
    SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -P $REMOTE_PORT"
    SCP_CMD="scp -i $SSH_KEY -o StrictHostKeyChecking=no -P $REMOTE_PORT"
    SSH_CMD="ssh -i $SSH_KEY -o StrictHostKeyChecking=no -p $REMOTE_PORT"
  else
    warn "SSH key not found at $SSH_KEY, will prompt for password"
    SSH_OPTS="-o StrictHostKeyChecking=no -P $REMOTE_PORT"
    SCP_CMD="scp -o StrictHostKeyChecking=no -P $REMOTE_PORT"
    SSH_CMD="ssh -o StrictHostKeyChecking=no -p $REMOTE_PORT"
  fi

  # Upload via rsync (preferred) or scp
  echo ""
  info "Uploading to server..."

  if command -v rsync &>/dev/null; then
    # rsync: fast incremental upload
    RSYNC_SSH="ssh -p $REMOTE_PORT"
    if [ -f "$SSH_KEY" ]; then
      RSYNC_SSH="ssh -i $SSH_KEY -p $REMOTE_PORT"
    fi
    rsync -avz --delete --chmod=D755,F644 \
      -e "$RSYNC_SSH" \
      "$DIST_DIR/" \
      "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
    ok "rsync upload complete"
  else
    # Fallback: scp
    warn "rsync not found, using scp (slower)"
    $SCP_CMD -r "$DIST_DIR/"* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
    ok "scp upload complete"
  fi

  # Fix permissions (Apache needs read access)
  echo ""
  info "Fixing file permissions..."
  $SSH_CMD "$REMOTE_USER@$REMOTE_HOST" "chmod 750 ~/public_html && find ~/public_html -type d -exec chmod 755 {} \; && find ~/public_html -type f -exec chmod 644 {} \;" 2>/dev/null || true
  ok "Permissions fixed"

  # Verify
  echo ""
  info "Verifying deployment..."
  HTTP_CODE=$($SSH_CMD "$REMOTE_USER@$REMOTE_HOST" "curl -s -o /dev/null -w '%{http_code}' http://hank-kuo.com/" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    ok "Server responding (HTTP 200)"
  else
    warn "Could not verify server response (HTTP $HTTP_CODE)"
  fi

  echo ""
  ok "Deployed to production!"
  echo -e "${GREEN}🌐 https://hank-kuo.com${NC}"
fi

echo ""
