/**
 * Template Engine for Theme System
 * Renders the theme by replacing placeholders with content data.
 *
 * Syntax:
 *   {{personal.name}}                  resolve a dot path
 *   {{personal.name|upper}}            apply filters
 *   {{@each path}}...{{/each}}         loop an array; inside the body:
 *                                      {{@item}}, {{@item.field}}, {{@index}}
 *   {{value|lookup(map.path)}}         use value as a key into a data map
 *   {{value|or}}                       optional field: collapse missing/empty to ""
 */

class TemplateEngine {
	constructor() {
		this.themes = new Map();
		this.filters = new Map();
		/** Extra tags (meta/OG/JSON-LD) injected into <head> by the host */
		this.extraHead = "";
		this.setupDefaultFilters();
	}

	registerTheme(name, template) {
		this.themes.set(name, template);
	}

	getTheme(name) {
		return this.themes.get(name);
	}

	getThemeNames() {
		return Array.from(this.themes.keys());
	}

	/**
	 * Render a theme with the provided data
	 */
	async render(themeName, data) {
		const theme = this.getTheme(themeName);
		if (!theme) {
			throw new Error(`Theme '${themeName}' not found`);
		}

		let html = this.processTemplate(theme.html, data);

		let css = "";
		let js = "";
		try {
			css = this.processTemplate(
				await this.loadThemeFile(themeName, "style.css"),
				data,
			);
		} catch (error) {
			console.warn(
				`No CSS file found for theme ${themeName}:`,
				error.message,
			);
		}
		try {
			js = this.processTemplate(
				await this.loadThemeFile(themeName, "script.js"),
				data,
			);
		} catch (error) {
			console.warn(
				`No JS file found for theme ${themeName}:`,
				error.message,
			);
		}

		return this.buildFullDocument(
			html,
			css,
			js,
			this.processTemplate(theme.title || "{{personal.name}}", data),
		);
	}

	/**
	 * Load a theme file. Browser implementation fetches relative to the page;
	 * the static build overrides this with filesystem reads.
	 */
	async loadThemeFile(themeName, fileName) {
		const filePath = `src/themes/${themeName}/${fileName}`;
		const response = await fetch(filePath);
		if (!response.ok) {
			throw new Error(`Failed to load ${filePath}: ${response.status}`);
		}
		return await response.text();
	}

	/**
	 * Process a template string: expand @each blocks, then replace
	 * remaining {{...}} placeholders.
	 */
	processTemplate(template, data) {
		if (!template) return "";

		template = this.processEach(template, data);

		return template.replace(/\{\{([^}]+)\}\}/g, (match, expr) => {
			return this.resolveExpression(expr.trim(), data);
		});
	}

	/**
	 * Expand {{@each path}}...{{/each}} blocks over arrays.
	 * The body is re-processed for every item with @item/@index in context.
	 * Blocks nest; the outermost block is expanded first (so nested blocks
	 * see the outer @item/@index context).
	 */
	processEach(template, data) {
		const open = /\{\{@each\s+([^}]+)\}\}/;
		const match = open.exec(template);
		if (!match) return template;

		const start = match.index;
		const bodyStart = start + match[0].length;

		// Find the matching close tag, accounting for nested @each blocks.
		const tokenRe = /\{\{(@each\s+[^}]+|\/each)\}\}/g;
		tokenRe.lastIndex = bodyStart;
		let depth = 1;
		let closeIndex = -1;
		let token;
		while ((token = tokenRe.exec(template))) {
			if (token[1].startsWith("/")) {
				depth--;
				if (depth === 0) {
					closeIndex = token.index;
					break;
				}
			} else {
				depth++;
			}
		}
		if (closeIndex === -1) return template; // unbalanced; leave untouched

		const body = template.slice(bodyStart, closeIndex);
		const after = template.slice(closeIndex + "{{/each}}".length);

		const array = this.resolvePath(match[1].trim(), data);
		const expanded = Array.isArray(array)
			? array
					.map((item, index) =>
						this.processTemplate(body, {
							...data,
							"@item": item,
							"@index": index,
						}),
					)
					.join("")
			: "";

		return (
			template.slice(0, start) + expanded + this.processEach(after, data)
		);
	}

	/**
	 * Resolve "path|filter1|filter2" against the data.
	 */
	resolveExpression(expr, data) {
		const [path, ...filterNames] = expr
			.split("|")
			.map((s) => s.trim());
		let value = this.resolvePath(path, data);
		for (const name of filterNames) {
			value = this.applyFilter(value, name, data);
		}
		return value;
	}

	/**
	 * Apply a filter, optionally with arguments: truncate(10)
	 */
	applyFilter(value, filter, data) {
		const match = filter.match(/^(\w+)(?:\((.*)\))?$/);
		if (!match) return value;

		const [, filterName, rawArgs] = match;
		const filterFunc = this.filters.get(filterName);
		if (!filterFunc) {
			console.warn(`Filter '${filterName}' not found`);
			return value;
		}

		return filterFunc(value, ...parseArgs(rawArgs, this, data));
	}

	/**
	 * Resolve a dot-notation path in the data object.
	 * Missing paths echo the placeholder (the build flags them as warnings).
	 */
	resolvePath(path, data) {
		const parts = path.split(".");
		let value = data;

		for (const part of parts) {
			// Handle array access like sites.0 or projects[1]
			const arrayMatch = part.match(/^([^[\]]+)\[(\d+)\]$/) || [
				null,
				part,
				null,
			];
			const key = arrayMatch[1];
			const index = arrayMatch[2];

			if (value && typeof value === "object") {
				value = value[key];
				if (index !== null && Array.isArray(value)) {
					value = value[parseInt(index)];
				}
			} else {
				return `{{${path}}}`;
			}
		}

		return value !== undefined ? value : `{{${path}}}`;
	}

	setupDefaultFilters() {
		// String filters
		this.filters.set("upper", (value) => String(value).toUpperCase());
		this.filters.set("lower", (value) => String(value).toLowerCase());

		// Collapse missing/empty values (and unresolved placeholder echoes)
		// to a fallback.
		this.filters.set("or", (value, fallback = "") =>
			!value || /^\{\{.*\}\}$/.test(String(value)) ? fallback : value,
		);

		// Join an array with a separator.
		this.filters.set("join", (value, separator = ", ") =>
			Array.isArray(value) ? value.join(separator) : String(value),
		);

		// Use the value as a KEY into a map resolved from a data path:
		//   {{@item|lookup(skills.threat_levels)}}
		this.filters.set("lookup", (value, map) =>
			map && value in map ? map[value] : "",
		);

		// Pad with leading zeroes: pad(3) => "007"; chain after inc for 1-based.
		this.filters.set("pad", (value, length = 3, char = "0") =>
			String(value).padStart(Number(length), char),
		);
		this.filters.set("inc", (value) => Number(value) + 1);

		// HTML escaping
		this.filters.set("escape", (value) =>
			String(value)
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#x27;"),
		);
	}

	buildFullDocument(html, css, js, title) {
		return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${this.extraHead}
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    </script>
</body>
</html>`;
	}
}

/**
 * Parse filter arguments: string literals ("..."), numbers, or data paths.
 * Commas inside string literals are preserved.
 */
function parseArgs(rawArgs, engine, data) {
	if (!rawArgs) return [];
	const args = [];
	let current = "";
	let inString = false;
	for (const char of rawArgs) {
		if (char === '"') {
			inString = !inString;
			current += char;
		} else if (char === "," && !inString) {
			args.push(current.trim());
			current = "";
		} else {
			current += char;
		}
	}
	args.push(current.trim());

	return args.map((arg) => {
		if (arg.startsWith('"') && arg.endsWith('"')) {
			return arg.slice(1, -1); // String literal
		}
		if (!isNaN(arg)) {
			return Number(arg); // Number literal
		}
		return engine.resolvePath(arg, data); // Data path
	});
}

/**
 * Theme Template Class
 */
class ThemeTemplate {
	constructor(name, config) {
		this.name = name;
		this.title = config.title || "";
		this.html = config.html || "";
		this.description = config.description || "";
		this.icon = config.icon || "";
	}
}

/**
 * Global template engine instance
 */
const templateEngine = new TemplateEngine();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
	module.exports = { TemplateEngine, ThemeTemplate, templateEngine };
}