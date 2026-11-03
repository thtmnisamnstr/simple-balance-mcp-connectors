#!/usr/bin/env bash
# Needs Inkscape. assets/logo.svg is simple-balance-web's public/favicon.svg;
# copy it again when the site's mark changes.
set -euo pipefail
cd "$(dirname "$0")/.."

for size in 400 512; do
  inkscape assets/logo.svg --export-type=png --export-filename="assets/logo-${size}.png" -w "$size" -h "$size"
done

cp assets/logo.svg plugin/assets/logo.svg
cp assets/logo-512.png plugin/assets/logo.png
cp assets/logo-400.png submissions/cline/icon.png
