# ladydascalie.github.io

Personal website, built from data.

## Structure

| Path | Purpose |
| --- | --- |
| `cv.json` | **All real content** (theme-agnostic): bio, experience, skills, projects, contact, meetup, webring |
| `src/themes/cypherpunk/template.js` | Theme HTML template (`{{placeholders}}`, `{{@each path}}…{{/each}}` loops) |
| `src/themes/cypherpunk/style.css` | Theme styles |
| `src/themes/cypherpunk/script.js` | Theme client-side behaviour |
| `src/themes/cypherpunk/theme.json` | Theme-only **flavour** data (cyberdeck specs, threat levels) |
| `build.mjs` | Static site generator |
| `index.html` | **Generated** - themed cypherpunk terminal page |
| `cv.html` | **Generated** - plain recruiter/ATS-friendly CV, print-to-PDF ready |
| `cv.json` | **Served** at `/cv.json` - machine-readable CV, source of truth |
| `llms.txt` | Points LLMs/scrapers at `cv.json` and `cv.html` |

## Building

```sh
node build.mjs
```

The build deep-merges `cv.json` with the theme's `theme.json`
(array items merge index-wise; a flavour entry with a `"$match": "<name>"`
key merges into the content item whose `name` field matches, independent of
position) and inlines the theme's CSS/JS into a fully static `index.html`.
It also generates `cv.html` - a plain semantic resume rendered from raw
`cv.json` (no theme flavour) - and injects meta/OG tags plus schema:Person
JSON-LD into both pages. Print `cv.html` to PDF for an ATS-friendly CV.
Arrays render with `{{@each}}` loops, so adding/removing entries in `cv.json`
just works - no template edits needed. A failed build warns about any
unresolved `{{placeholder}}`.
