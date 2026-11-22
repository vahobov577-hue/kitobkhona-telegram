#!/usr/bin/env bash
# Sandbox-only wrapper: Remotion forces "--proxy-server=direct://", but in this cloud
# container all HTTPS must go through $HTTPS_PROXY (needed for Google Fonts).
BIN=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
args=()
for a in "$@"; do
  case "$a" in
    --no-proxy-server|--proxy-server=*|--proxy-bypass-list=*) ;;
    *) args+=("$a") ;;
  esac
done
if [ -n "$HTTPS_PROXY" ]; then args+=("--proxy-server=$HTTPS_PROXY"); fi
exec "$BIN" "${args[@]}"
