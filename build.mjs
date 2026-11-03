#!/usr/bin/env node
/**
 * Static site builder.
 *
 * Renders index.html from the selected theme and cv.html from the resume theme:
 *   - cv.json                                     (real content, theme-agnostic)
 *   - src/vendor/design-system/<version>/*.css    (inlined ahead of theme CSS)
 *   - src/themes/<theme>/template.js              (theme HTML template)
 *   - src/themes/<theme>/style.css                (theme styles)
 *   - src/themes/<theme>/script.js                (theme client-side behaviour)
 *   - src/themes/<theme>/theme.json               (theme-specific flavour data)
 *
 * Usage: node build.mjs [--theme <name>] [--out <dir>]
 *
 *   --theme  theme under src/themes. Default: hexcore when
 *            src/themes/hexcore/template.js exists, otherwise cypherpunk.
 *   --out    output directory. Default: dist.
 *
 * The output is fully static (CSS/JS inlined) and is not committed.
 */

import {
	copyFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

function die(message) {
	console.error(`error: ${message}`);
	process.exit(1);
}

// ---------------------------------------------------------------------------
// Arguments
// ---------------------------------------------------------------------------

function parseArgs(argv) {
	const opts = {};
	for (let i = 0; i < argv.length; i += 1) {
		const match = /^--(theme|out)(?:=(.*))?$/.exec(argv[i]);
		if (!match) die(`unknown argument: ${argv[i]}`);
		const value = match[2] ?? argv[++i];
		if (!value || value.startsWith("--")) die(`--${match[1]} needs a value`);
		opts[match[1]] = value;
	}
	return opts;
}

const args = parseArgs(process.argv.slice(2));

const themeDirFor = (name) => join(root, "src", "themes", name);

const themeExists = (name) =>
	existsSync(join(themeDirFor(name), "template.js"));

const THEME = args.theme ?? (themeExists("hexcore") ? "hexcore" : "cypherpunk");
const OUT = resolve(root, args.out ?? "dist");

if (!themeExists(THEME)) {
	die(
		`no theme '${THEME}' at ${themeDirFor(THEME)}/template.js ` +
			`(have: ${readdirSync(join(root, "src", "themes")).join(", ")})`,
	);
}

const themeDir = themeDirFor(THEME);

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

// Theme flavour data is optional; a theme may ship a template alone.
const flavourPath = join(themeDir, "theme.json");
const flavour = existsSync(flavourPath)
	? JSON.parse(readFileSync(flavourPath, "utf8"))
	: {};

const data = deepMerge(cv, flavour);
data.meta = {
	...(data.meta ?? {}),
	real_year: String(new Date().getFullYear()),
};

// ---------------------------------------------------------------------------
// Vendored design system: tokens, font faces, and the font files themselves.
// The CSS is inlined into the selected theme's page, in this order:
// tokens.css, fonts.css, the theme's own style.css.
// ---------------------------------------------------------------------------

const DESIGN_SYSTEM_VERSION = "v0.3.0";
const designSystemDir = join(
	root,
	"src",
	"vendor",
	"design-system",
	DESIGN_SYSTEM_VERSION,
);

const designSystemCss = ["tokens.css", "fonts.css"]
	.map((file) => {
		const path = join(designSystemDir, file);
		if (!existsSync(path)) {
			die(`missing vendored design system file: ${path}`);
		}
		return readFileSync(path, "utf8");
	})
	.join("\n");

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
	die(`theme '${THEME}' did not register itself`);
}

// The engine fetches css/js relative to the page; in the build we read from disk.
// Only the selected theme gets the design system; the plain CV keeps its own
// self-contained light stylesheet.
const readThemeFile = (name, fileName) =>
	readFileSync(join(root, "src", "themes", name, fileName), "utf8");

templateEngine.loadThemeFile = (name, fileName) =>
	name === THEME && fileName === "style.css"
		? `${designSystemCss}\n${readThemeFile(name, fileName)}`
		: readThemeFile(name, fileName);

// ---------------------------------------------------------------------------
// Machine-readable head tags: meta description, Open Graph, JSON-LD
// ---------------------------------------------------------------------------

const SITE_URL = "https://darkmage.dev/";

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

// A theme advertises a favicon or a social card by shipping one of these files.
const FAVICON_CANDIDATES = ["favicon.svg", "favicon.ico", "favicon.png"];
const OG_IMAGE_CANDIDATES = [
	"og-image.png",
	"og-image.jpg",
	"og-image.svg",
	"og.png",
];

function findThemeFile(name, candidates) {
	return candidates.find((file) => existsSync(join(themeDirFor(name), file)));
}

function headTags(description, canonical) {
	const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
	const favicon = findThemeFile(THEME, FAVICON_CANDIDATES);
	const ogImage = findThemeFile(THEME, OG_IMAGE_CANDIDATES);
	const tags = [
		`<meta name="description" content="${esc(description)}">`,
		`<meta property="og:title" content="${esc(cv.personal.name)} - ${esc(cv.personal.title)}">`,
		`<meta property="og:description" content="${esc(description)}">`,
		`<meta property="og:type" content="profile">`,
		`<meta property="og:url" content="${canonical}">`,
		`<link rel="canonical" href="${canonical}">`,
		`<link rel="alternate" type="application/json" href="cv.json" title="CV as JSON (machine-readable)">`,
	];
	if (favicon) {
		tags.push(`<link rel="icon" href="${favicon}">`);
	}
	if (ogImage) {
		tags.push(`<meta property="og:image" content="${SITE_URL}${ogImage}">`);
		tags.push(`<meta name="twitter:card" content="summary_large_image">`);
	}
	tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
	return tags.join("\n    ");
}

// ---------------------------------------------------------------------------
// Static files: content, discovery files, fonts, theme assets, portrait.
// ---------------------------------------------------------------------------

function copyFile(from, to) {
	mkdirSync(dirname(to), { recursive: true });
	copyFileSync(from, to);
}

function copyTree(from, to) {
	for (const entry of readdirSync(from, { withFileTypes: true })) {
		const src = join(from, entry.name);
		const dest = join(to, entry.name);
		if (statSync(src).isDirectory()) {
			copyTree(src, dest);
		} else {
			copyFile(src, dest);
		}
	}
}

const STATIC_FILES = ["cv.json", "llms.txt", ".nojekyll", "CNAME"];
const STATIC_DIRS = [".well-known"];
const copied = [];

for (const file of STATIC_FILES) {
	const from = join(root, file);
	if (!existsSync(from)) continue;
	copyFile(from, join(OUT, file));
	copied.push(file);
}

for (const dir of STATIC_DIRS) {
	const from = join(root, dir);
	if (!existsSync(from)) continue;
	copyTree(from, join(OUT, dir));
	copied.push(`${dir}/`);
}

// fonts.css points at fonts/*.woff2 and the OFL licences travel with them.
const vendorFonts = join(designSystemDir, "fonts");
copyTree(vendorFonts, join(OUT, "fonts"));
copied.push(`fonts/ (${readdirSync(vendorFonts).length} files from design-system ${DESIGN_SYSTEM_VERSION})`);

// Theme extras referenced from the head, when the theme ships them.
for (const file of [findThemeFile(THEME, FAVICON_CANDIDATES), findThemeFile(THEME, OG_IMAGE_CANDIDATES)]) {
	if (!file) continue;
	copyFile(join(themeDir, file), join(OUT, file));
	copied.push(file);
}

// The theme renders the portrait as a page-relative path; keep that path in out.
const portrait = cv.personal?.portrait;
if (portrait && existsSync(join(root, portrait))) {
	copyFile(join(root, portrait), join(OUT, portrait));
	copied.push(portrait);
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

templateEngine.extraHead = headTags(cv.bio[0], SITE_URL);

const html = await templateEngine.render(THEME, data);
warnUnresolved(html, "index.html");
writeFileSync(join(OUT, "index.html"), html);
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
writeFileSync(join(OUT, "cv.html"), resumeHtml);
console.log(
	`built cv.html (plain resume) (${(resumeHtml.length / 1024).toFixed(1)} KiB)`,
);

console.log(`out: ${OUT}`);
console.log(`copied: ${copied.join(", ")}`);
