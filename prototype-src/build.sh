#!/bin/bash
# Build the static prototype from pages/*.dc.html + loader.html and publish it to ../prototype (served by Vercel).
set -e
cd "$(dirname "$0")"
rm -rf build && mkdir -p build/site
python3 convert.py pages build/site          # injects loader.html + search.js into every page
cp assets/*.svg build/site/
cp -r review build/site/                      # Supabase comment layer (Vercel only)
python3 publish.py                            # clean URLs -> ../prototype, redirects -> ../vercel.json
