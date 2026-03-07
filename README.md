# CBSE Smart Portal — Static Site

Static export of the CBSE Class 7 Smart Portal, deployable on **GitHub Pages**.  
Works on Android Chrome, iPhone Safari, and any modern browser. Supports offline use (PWA).

## Generate the site

Run this **on the Ubuntu server** (where PostgreSQL is running):

```bash
cd ~/Smart_Portal2

# Install dependencies if needed
pip install markdown psycopg2-binary Pillow

# Generate into static_site/
python tools/generate_static_site.py

# Optional: custom output path
python tools/generate_static_site.py --output ./static_site --chapters-dir ./data/chapters
```

The script reads from:
- **PostgreSQL** `ai.llm_cache` — summaries, notes, keywords, exercises, questions
- **`data/chapters/`** — full chapter Markdown text

## Deploy to GitHub Pages

```bash
cd static_site

git init
git add .
git commit -m "Initial static site export"

# Create a new repo on GitHub first, then:
git remote add origin https://github.com/<YOUR_USERNAME>/cbse-smart-portal-static.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: `main` branch, `/ (root)`** → Save.

Your site will be live at:  
`https://<YOUR_USERNAME>.github.io/cbse-smart-portal-static/`

## Re-generate after adding new content

```bash
cd ~/Smart_Portal2
python tools/generate_static_site.py
cd static_site
git add . && git commit -m "Update content" && git push
```

## Features

| Feature | Detail |
|---------|--------|
| 📱 Mobile responsive | Works on Android Chrome & iPhone Safari |
| 📴 Offline support | PWA with service worker — works without internet |
| 🔍 Chapter search | Filter chapters instantly on the index page |
| 📐 MathJax | LaTeX auto-loads on Maths chapters |
| 📥 No server needed | 100% static HTML/CSS/JS |
| 🎨 Matching theme | Same red/white colour palette as the Streamlit app |
