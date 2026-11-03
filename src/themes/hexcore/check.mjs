#!/usr/bin/env node
/**
 * Acceptance check for the hexcore theme.
 *
 * Usage: node src/themes/hexcore/check.mjs [--out <file>]
 *
 * When build.mjs supports `--theme` and `--out`, this builds the site twice:
 * once with `--theme hexcore` and once with no theme flag, then asserts the
 * default run selects hexcore. Otherwise it renders the theme directly from
 * src/template-engine.js, merging cv.json with theme.json.
 *
 * No network access. Exits non-zero on any failed assertion.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const themeDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(themeDir, "..", "..", "..");

const outArgIndex = process.argv.indexOf("--out");
const outPath =
	outArgIndex !== -1 && process.argv[outArgIndex + 1]
		? resolve(process.argv[outArgIndex + 1])
		: join(tmpdir(), "hexcore-preview.html");

let failures = 0;

function check(name, ok, detail) {
	if (ok) {
		console.log(`PASS ${name}`);
		return;
	}
	failures++;
	console.log(`FAIL ${name}${detail ? `: ${detail}` : ""}`);
}

/** Markers every hexcore page must carry, whatever the render path. */
const MARKERS = [
	['data-hexcore="hexcore"', "hexcore root marker"],
	['id="hexcore-core"', "hexcore core motif"],
	['class="core-facets"', "six facet SVG"],
	['id="theme-toggle"', "masthead theme toggle"],
	["hexcore-theme", "theme bootstrap storage key"],
	["░▒▓", "shade glyphs"],
	["--font-shade", "shade font token"],
	["prefers-reduced-motion", "reduced motion guard"],
	["var(--accent-strong)", "accent-strong token"],
	["var(--link)", "link token"],
];

function assertPage(label, html) {
	const unresolved = [...html.matchAll(/\{\{[^}]+\}\}/g)].map((m) => m[0]);
	check(
		`${label}: no unresolved placeholders`,
		unresolved.length === 0,
		[...new Set(unresolved)].join(", "),
	);
	for (const [needle, name] of MARKERS) {
		check(`${label}: ${name}`, html.includes(needle));
	}
}

function writePreview(html) {
	writeFileSync(outPath, html);
	console.log(`wrote ${outPath}`);
}

const isPlainObject = (value) =>
	value !== null && typeof value === "object" && !Array.isArray(value);

/** Deep merge objects; replace arrays. */
function deepMerge(base, over) {
	if (Array.isArray(over)) return over;
	if (isPlainObject(base) && isPlainObject(over)) {
		const out = { ...base };
		for (const [key, value] of Object.entries(over)) {
			out[key] = key in out ? deepMerge(out[key], value) : value;
		}
		return out;
	}
	return over;
}

function readBuildSource() {
	try {
		return readFileSync(join(root, "build.mjs"), "utf8");
	} catch (error) {
		return "";
	}
}

function runBuild(args) {
	execFileSync(process.execPath, [join(root, "build.mjs"), ...args], {
		cwd: root,
		stdio: "pipe",
	});
}

let checkSupported = false;

const buildSrc = readBuildSource();
const hasFlags = buildSrc.includes("--theme") && buildSrc.includes("--out");

if (hasFlags) {
	checkSupported = true;

	const scratch = mkdtempSync(join(tmpdir(), "hexcore-check-"));
	const themedOut = join(scratch, "hexcore");
	const defaultOut = join(scratch, "default");

	let themedHtml = "";
	let defaultHtml = "";

	try {
		runBuild(["--theme", "hexcore", "--out", themedOut]);
		themedHtml = readFileSync(join(themedOut, "index.html"), "utf8");
	} catch (error) {
		check("build --theme hexcore", false, String(error.message).split("\n")[0]);
	}

	try {
		runBuild(["--out", defaultOut]);
		defaultHtml = readFileSync(join(defaultOut, "index.html"), "utf8");
	} catch (error) {
		check("build with no theme flag", false, String(error.message).split("\n")[0]);
	}

	if (themedHtml) {
		assertPage("hexcore build", themedHtml);
		check(
			"hexcore build: brand token --accent: #3d6756",
			themedHtml.includes("--accent: #3d6756"),
		);
		check(
			"hexcore build: @font-face from fonts.css",
			themedHtml.includes("@font-face") &&
				themedHtml.includes("fonts/atkinson-hyperlegible-next") &&
				themedHtml.includes('font-family: "Atkinson Hyperlegible Next"'),
		);
		check(
			"hexcore build: canonical https://darkmage.dev/",
			themedHtml.includes('rel="canonical"') &&
				themedHtml.includes("https://darkmage.dev/"),
		);
	}

	if (defaultHtml) {
		check(
			"no theme flag defaults to hexcore",
			MARKERS.every(([needle]) => defaultHtml.includes(needle)),
		);
	}

	if (themedHtml) writePreview(themedHtml);
} else {
	console.log(
		"build.mjs has no --theme/--out; rendering the theme directly with src/template-engine.js",
	);

	const engineSrc = readFileSync(join(root, "src", "template-engine.js"), "utf8");
	const { templateEngine, ThemeTemplate } = new Function(
		`${engineSrc}\nreturn { templateEngine, ThemeTemplate };`,
	)();

	const themeSrc = readFileSync(join(themeDir, "template.js"), "utf8");
	new Function("ThemeTemplate", "templateEngine", themeSrc)(
		ThemeTemplate,
		templateEngine,
	);

	check(
		"theme registers as hexcore",
		templateEngine.getThemeNames().includes("hexcore"),
	);

	const readThemeFile = (name, file) =>
		readFileSync(join(root, "src", "themes", name, file), "utf8");
	templateEngine.loadThemeFile = readThemeFile;

	// Inline the vendored design system when it is present so the preview is
	// readable. Never asserted here: tokens belong to the build.
	const vendorDir = join(root, "src", "vendor", "design-system", "v0.3.0");
	const vendorCss = ["tokens.css", "fonts.css"]
		.map((file) => {
			const path = join(vendorDir, file);
			return existsSync(path) ? readFileSync(path, "utf8") : "";
		})
		.join("\n");

	if (vendorCss.trim()) {
		templateEngine.loadThemeFile = (name, file) =>
			file === "style.css"
				? `${vendorCss}\n${readThemeFile(name, file)}`
				: readThemeFile(name, file);
	}

	const data = deepMerge(
		JSON.parse(readFileSync(join(root, "cv.json"), "utf8")),
		JSON.parse(readFileSync(join(themeDir, "theme.json"), "utf8")),
	);
	data.meta = {
		...(data.meta ?? {}),
		real_year: String(new Date().getFullYear()),
	};

	const html = await templateEngine.render("hexcore", data);
	assertPage("direct render", html);
	writePreview(html);
}

if (failures > 0) {
	console.log(`\n${failures} assertion(s) failed`);
	process.exit(1);
}

console.log(`\nall assertions passed${checkSupported ? " (build path)" : " (direct render path)"}`);
