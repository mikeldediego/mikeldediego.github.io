#!/bin/sh
# Builds the two pages (/ and /about/) from template.html.
# Both pages are the same file: they render the content from /content.js,
# so the text is edited in ONE place (content.js). Run: sh build.sh
set -e
cd "$(dirname "$0")"
cp template.html index.html
mkdir -p about
cp template.html about/index.html
echo "Built index.html and about/index.html"
