#!/bin/bash
# Artifact build = site build without the review/comment layer (that layer is for Vercel only)
cd "$(dirname "$0")"; rm -rf site_art; mkdir -p site_art
for f in site/*.html; do python3 -c "import sys,re;t=open(sys.argv[1]).read();t=re.sub(r'<script src=\"review/config\.js[^\"]*\"></script>(<script>[^<]*rv-on[^<]*</script>)?<script src=\"review/review\.js[^\"]*\" defer></script>','',t);open(sys.argv[2],'w').write(t)" "$f" "site_art/$(basename "$f")"; done
cp site/*.svg site_art/ 2>/dev/null; grep -l 'review/review.js' site_art/*.html | wc -l
