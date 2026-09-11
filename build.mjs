#!/usr/bin/env node
/**
 * Static site builder.
 *
 * Renders index.html from:
 *   - cv.json                              (real content, theme-agnostic)
 *   - src/themes/cypherpunk/template.js    (theme HTML template)
 *   - src/themes/cypherpunk/style.css      (theme styles)
 *   - src/themes/cypherpunk/script.js      (theme client-side behaviour)
 *   - src/themes/cypherpunk/theme.json     (theme-specific flavour data)
 *
 * Usage: node build.mjs
 *
 * The output is fully static (CSS/JS inlined); commit it alongside the source.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const THEME = "cypherpunk";
const themeDir = join(root, "src", "themes", THEME);

// ---------------------------------------------------------------------------
// Merge helper: theme flavour data is deep-merged over the real content.
// Arrays merge index-wise (so the theme can override e.g. projects[0]
// without repeating the whole array); scalars replace.
// ---------------------------------------------------------------------------

const isPlainObject = (v) =>
	v !== null && typeof v === "object" && !Array.isArray(v);

function deepMerge(base, flavour) {
	if (Array.isArray(base) && Array.isArray(flavour)) {
		// Flavour entries carrying a "$match" string merge into the base item
		// whose "name" field equals it (order-independent); the rest merge
		// index-wise as before.
		const byMatch = new Map();
		const indexed = [];
		for (const [i, f] of flavour.entries()) {
			if (isPlainObject(f) && typeof f.$match === "string") {
				byMatch.set(f.$match, f);
			} else {
				indexed[i] = f;
			}
		}
		if (byMatch.size > 0) {
			return base.map((item, i) => {
				if (isPlainObject(item) && byMatch.has(item.name)) {
					const { $match, ...rest } = byMatch.get(item.name);
					item = deepMerge(item, rest);
				}
				return indexed[i] !== undefined
					? deepMerge(item, indexed[i])
					: item;
			});
		}
		return base.map((item, i) =>
			flavour[i] !== undefined ? deepMerge(item, flavour[i]) : item,
		);
	}
	if (isPlainObject(base) && isPlainObject(flavour)) {
		const out = { ...base };
		for (const [key, value] of Object.entries(flavour)) {
			out[key] = key in out ? deepMerge(out[key], value) : value;
		}
		return out;
	}
	return flavour;
}

// ---------------------------------------------------------------------------
// Load data
// ---------------------------------------------------------------------------

const cv = JSON.parse(readFileSync(join(root, "cv.json"), "utf8"));
const flavour = JSON.parse(
	readFileSync(join(themeDir, "theme.json"), "utf8"),
);

const data = deepMerge(cv, flavour);
data.meta = {
	...(data.meta ?? {}),
	real_year: String(new Date().getFullYear()),
};

// ---------------------------------------------------------------------------
// Load the template engine + theme template.
// Both are browser-targeted plain scripts; evaluate them in a function scope
// and hand back the instances we need.
// ---------------------------------------------------------------------------

const engineSrc = readFileSync(join(root, "src/template-engine.js"), "utf8");
const { templateEngine, ThemeTemplate } = new Function(
	`${engineSrc}\nreturn { templateEngine, TemplateEngine, ThemeTemplate };`,
)();

const templateSrc = readFileSync(join(themeDir, "template.js"), "utf8");
new Function("ThemeTemplate", "templateEngine", templateSrc)(
	ThemeTemplate,
	templateEngine,
);

const theme = templateEngine.getTheme(THEME);
if (!theme) {
	console.error("error: theme template did not register itself");
	process.exit(1);
}

// The engine fetches css/js relative to the page; in the build we read from disk.
templateEngine.loadThemeFile = (name, fileName) =>
	readFileSync(join(root, "src", "themes", name, fileName), "utf8");

// ---------------------------------------------------------------------------
// Machine-readable head tags: meta description, Open Graph, JSON-LD
// ---------------------------------------------------------------------------

const SITE_URL = "https://ladydascalie.github.io/";

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: cv.personal.name,
	jobTitle: cv.personal.title,
	worksFor: { "@type": "Organization", name: cv.personal.company, url: cv.personal.companyUrl },
	url: SITE_URL,
	sameAs: [cv.contact.github, cv.contact.linkedin].filter(Boolean),
	description: cv.bio[0],
	knowsAbout: cv.skills?.expertise ?? [],
};

function headTags(description, canonical) {
	const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	return [
		`<meta name="description" content="${esc(description)}">`,
		`<meta property="og:title" content="${esc(cv.personal.name)} - ${esc(cv.personal.title)}">`,
		`<meta property="og:description" content="${esc(description)}">`,
		`<meta property="og:type" content="profile">`,
		`<meta property="og:url" content="${canonical}">`,
		`<link rel="canonical" href="${canonical}">`,
		`<link rel="alternate" type="application/json" href="cv.json" title="CV as JSON (machine-readable)">`,
		`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
	].join("\n    ");
}

// ---------------------------------------------------------------------------
// Render + write
// ---------------------------------------------------------------------------

function warnUnresolved(html, page) {
	const unresolved = [...html.matchAll(/\{\{[^}]+\}\}/g)].map((m) => m[0]);
	if (unresolved.length > 0) {
		console.warn(
			`warn: ${page}: ${unresolved.length} unresolved placeholder(s): ` +
				[...new Set(unresolved)].join(", "),
			);
	}
}

templateEngine.extraHead = headTags(
	cv.bio[0],
	SITE_URL,
);

const html = await templateEngine.render(THEME, data);
warnUnresolved(html, "index.html");
writeFileSync(join(root, "index.html"), html);
console.log(
	`built index.html from theme '${THEME}' ` +
		`(${(html.length / 1024).toFixed(1)} KiB)`,
);

// Plain, recruiter/LLM-readable CV page from the same cv.json (no theme flavour).
const resumeData = { ...cv, meta: { real_year: String(new Date().getFullYear()) } };
const resumeSrc = readFileSync(
	join(root, "src", "themes", "resume", "template.js"),
	"utf8",
);
new Function("ThemeTemplate", "templateEngine", resumeSrc)(
	ThemeTemplate,
	templateEngine,
);
templateEngine.extraHead = headTags(
	`${cv.personal.title} - CV`,
	SITE_URL.replace(/\/$/, "") + "/cv.html",
);

const resumeHtml = await templateEngine.render("resume", resumeData);
warnUnresolved(resumeHtml, "cv.html");
writeFileSync(join(root, "cv.html"), resumeHtml);
console.log(
	`built cv.html (plain resume) (${(resumeHtml.length / 1024).toFixed(1)} KiB)`,
);