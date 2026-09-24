#!/usr/bin/env bash
# Every URL in tests/baseline-urls.txt must still resolve in public/, either as
# a real page or as an alias redirect (a small HTML file with a refresh/canonical
# pointing at the new location).
set -euo pipefail

public_dir="${1:-public}"
baseline="$(dirname "$0")/baseline-urls.txt"
fail=0

while IFS= read -r url; do
  [ -z "$url" ] && continue
  case "$url" in
  */) file="$public_dir$url"index.html ;;
  *) file="$public_dir$url" ;;
  esac
  if [ ! -f "$file" ]; then
    echo "MISSING: $url ($file)"
    fail=1
  fi
done <"$baseline"

if [ "$fail" -eq 0 ]; then
  echo "check-urls: all $(wc -l <"$baseline" | tr -d ' ') baseline URLs present."
else
  echo "check-urls: FAILED"
fi
exit "$fail"
