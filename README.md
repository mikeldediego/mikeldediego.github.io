# mikeldediego.github.io

Personal CV site, served by GitHub Pages at:
- https://mikeldediego.github.io/
- https://mikeldediego.github.io/about/  (same content, shareable URL)

## How to edit the content

Everything (texts, jobs, skills, certifications, in English and Spanish)
lives in ONE file: **content.js**. Edit it, commit and push; both pages
update at once. No build step needed for content changes.

- `window.CV.en` = English content, `window.CV.es` = contenido en español.
- `window.CV.name` and `window.CV.linkedin` = personal data shown on the page.

## Structure

- `template.html` - the single page shell (both pages are copies of it).
- `build.sh` - regenerates `index.html` and `about/index.html` from the
  template. Run `sh build.sh` only if you change `template.html`.
- `content.js` - all site text (edit this one).
- `assets/app.js` - rendering and interactions (language, theme, sections).
- `assets/styles.css` - styles (light/dark, mobile, cards).
- `assets/og.png`, `assets/favicon.svg` - share preview image and icon.

## Notes

- English/Spanish button, light/dark theme (follows the device by default),
  collapsible sections. Preferences are stored in the visitor's browser
  (localStorage); there are no cookies and no analytics.
