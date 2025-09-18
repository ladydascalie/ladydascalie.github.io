/**
 * Template Engine for Theme System
 * Renders themes by replacing placeholders with content data
 */

class TemplateEngine {
        constructor() {
                this.themes = new Map();
                this.helpers = new Map();
                this.filters = new Map();
                this.setupDefaultHelpers();
                this.setupDefaultFilters();
        }

        /**
         * Register a new theme template
         */
        registerTheme(name, template) {
                this.themes.set(name, template);
        }

        /**
         * Get a registered theme
         */
        getTheme(name) {
                return this.themes.get(name);
        }

        /**
         * Get all registered theme names
         */
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

                // Process the HTML template
                let html = this.processTemplate(theme.html, data);

                // Load and process external CSS and JS files
                let css = "";
                let js = "";

                try {
                        css = await this.loadThemeFile(themeName, "style.css");
                        css = this.processTemplate(css, data);
                } catch (error) {
                        console.warn(
                                `No CSS file found for theme ${themeName}:`,
                                error.message,
                        );
                }

                try {
                        js = await this.loadThemeFile(themeName, "script.js");
                        js = this.processTemplate(js, data);
                } catch (error) {
                        console.warn(
                                `No JS file found for theme ${themeName}:`,
                                error.message,
                        );
                }

                // Combine into full HTML document
                return this.buildFullDocument(
                        html,
                        css,
                        js,
                        this.processTemplate(
                                theme.title || "{{personal.name}}",
                                data,
                        ),
                );
        }

        /**
         * Load a theme file from the file system
         */
        async loadThemeFile(themeName, fileName) {
                const filePath = `src/themes/${themeName}/${fileName}`;
                const response = await fetch(filePath);

                if (!response.ok) {
                        throw new Error(
                                `Failed to load ${filePath}: ${response.status}`,
                        );
                }

                return await response.text();
        }

        /**
         * Process template string by replacing placeholders
         */
        processTemplate(template, data) {
                if (!template) return "";

                // Replace {{placeholder}} with actual values
                return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
                        return this.resolvePathWithFilters(path.trim(), data);
                });
        }

        /**
         * Resolve path and apply any pipe filters
         */
        resolvePathWithFilters(pathWithFilters, data) {
                // Check if there are pipe filters
                const parts = pathWithFilters.split("|");
                const path = parts[0].trim();
                const filters = parts.slice(1).map((f) => f.trim());

                // Get the initial value
                let value = this.resolvePath(path, data);

                // Apply filters in sequence
                for (const filter of filters) {
                        value = this.applyFilter(value, filter, data);
                }

                return value;
        }

        /**
         * Apply a filter to a value
         */
        applyFilter(value, filter, data) {
                // Handle parameterized filters like truncate(10)
                const match = filter.match(/^(\w+)(?:\(([^)]*)\))?$/);
                if (!match) return value;

                const [, filterName, args] = match;
                const filterFunc = this.filters.get(filterName);

                if (!filterFunc) {
                        console.warn(`Filter '${filterName}' not found`);
                        return value;
                }

                // Parse arguments if any
                const parsedArgs = args
                        ? args.split(",").map((arg) => {
                                  arg = arg.trim();
                                  if (
                                          arg.startsWith('"') &&
                                          arg.endsWith('"')
                                  ) {
                                          return arg.slice(1, -1); // String literal
                                  } else if (!isNaN(arg)) {
                                          return Number(arg); // Number literal
                                  } else {
                                          return this.resolvePath(arg, data); // Data path
                                  }
                          })
                        : [];

                return filterFunc(value, ...parsedArgs);
        }

        /**
         * Resolve a dot-notation path in the data object
         */
        resolvePath(path, data) {
                // Handle helper functions
                if (path.startsWith("@")) {
                        return this.callHelper(path, data);
                }

                // Split path and traverse object
                const parts = path.split(".");
                let value = data;

                for (const part of parts) {
                        // Handle array access like bio.0 or projects[1]
                        const arrayMatch = part.match(
                                /^([^[\]]+)\[(\d+)\]$/,
                        ) || [null, part, null];
                        const key = arrayMatch[1];
                        const index = arrayMatch[2];

                        if (value && typeof value === "object") {
                                value = value[key];

                                // If we have an array index, use it
                                if (index !== null && Array.isArray(value)) {
                                        value = value[parseInt(index)];
                                }
                        } else {
                                return `{{${path}}}`; // Return placeholder if path not found
                        }
                }

                return value !== undefined ? value : `{{${path}}}`;
        }

        /**
         * Call a helper function
         */
        callHelper(helperCall, data) {
                const match = helperCall.match(/^@(\w+)(?:\(([^)]*)\))?$/);
                if (!match) return helperCall;

                const [, helperName, args] = match;
                const helper = this.helpers.get(helperName);

                if (!helper) return helperCall;

                // Parse arguments
                const parsedArgs = args
                        ? args.split(",").map((arg) => {
                                  arg = arg.trim();
                                  // If it's a path, resolve it
                                  if (
                                          arg.startsWith('"') &&
                                          arg.endsWith('"')
                                  ) {
                                          return arg.slice(1, -1); // String literal
                                  } else if (!isNaN(arg)) {
                                          return Number(arg); // Number literal
                                  } else {
                                          return this.resolvePath(arg, data); // Data path
                                  }
                          })
                        : [];

                return helper(data, ...parsedArgs);
        }

        /**
         * Setup default helper functions
         */
        setupDefaultHelpers() {
                // Loop helper for arrays
                this.helpers.set("each", (data, arrayPath, template) => {
                        const array = this.resolvePath(arrayPath, data);
                        if (!Array.isArray(array)) return "";

                        return array
                                .map((item, index) => {
                                        // Create context with item data and index
                                        const itemContext = {
                                                ...data,
                                                "@item": item,
                                                "@index": index,
                                                "@first": index === 0,
                                                "@last":
                                                        index ===
                                                        array.length - 1,
                                        };
                                        return this.processTemplate(
                                                template,
                                                itemContext,
                                        );
                                })
                                .join("");
                });

                // Join array helper
                this.helpers.set(
                        "join",
                        (data, arrayPath, separator = ", ") => {
                                const array = this.resolvePath(arrayPath, data);
                                return Array.isArray(array)
                                        ? array.join(separator)
                                        : "";
                        },
                );

                // Conditional helper
                this.helpers.set(
                        "if",
                        (data, condition, trueTemplate, falseTemplate = "") => {
                                const value = this.resolvePath(condition, data);
                                return value
                                        ? this.processTemplate(
                                                  trueTemplate,
                                                  data,
                                          )
                                        : this.processTemplate(
                                                  falseTemplate,
                                                  data,
                                          );
                        },
                );

                // Current time helper
                this.helpers.set("now", () => {
                        return new Date().toLocaleTimeString();
                });

                // Random helper
                this.helpers.set("random", (data, min = 0, max = 100) => {
                        return (
                                Math.floor(Math.random() * (max - min + 1)) +
                                min
                        );
                });
        }

        /**
         * Setup default filter functions
         */
        setupDefaultFilters() {
                // String filters
                this.filters.set("upper", (value) => {
                        return String(value).toUpperCase();
                });

                this.filters.set("lower", (value) => {
                        return String(value).toLowerCase();
                });

                this.filters.set("capitalize", (value) => {
                        return (
                                String(value).charAt(0).toUpperCase() +
                                String(value).slice(1).toLowerCase()
                        );
                });

                this.filters.set("title", (value) => {
                        return String(value).replace(
                                /\w\S*/g,
                                (txt) =>
                                        txt.charAt(0).toUpperCase() +
                                        txt.substr(1).toLowerCase(),
                        );
                });

                this.filters.set(
                        "truncate",
                        (value, length = 50, suffix = "...") => {
                                const str = String(value);
                                return str.length > length
                                        ? str.substring(0, length) + suffix
                                        : str;
                        },
                );

                // Number filters
                this.filters.set("round", (value, precision = 0) => {
                        return Number(value).toFixed(precision);
                });

                // Array filters
                this.filters.set("length", (value) => {
                        return Array.isArray(value)
                                ? value.length
                                : String(value).length;
                });

                this.filters.set("first", (value) => {
                        return Array.isArray(value) ? value[0] : value;
                });

                this.filters.set("last", (value) => {
                        return Array.isArray(value)
                                ? value[value.length - 1]
                                : value;
                });

                // Date filters
                this.filters.set("date", (value, format = "default") => {
                        const date = new Date(value);
                        switch (format) {
                                case "short":
                                        return date.toLocaleDateString();
                                case "long":
                                        return date.toLocaleDateString(
                                                "en-US",
                                                {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                },
                                        );
                                case "time":
                                        return date.toLocaleTimeString();
                                default:
                                        return date.toString();
                        }
                });

                // HTML filters
                this.filters.set("escape", (value) => {
                        return String(value)
                                .replace(/&/g, "&amp;")
                                .replace(/</g, "&lt;")
                                .replace(/>/g, "&gt;")
                                .replace(/"/g, "&quot;")
                                .replace(/'/g, "&#x27;");
                });
        }

        /**
         * Build complete HTML document
         */
        buildFullDocument(html, css, js, title) {
                return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
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
 * Theme Template Class
 */
class ThemeTemplate {
        constructor(name, config) {
                this.name = name;
                this.title = config.title || "";
                this.html = config.html || "";
                this.description = config.description || "";
                this.icon = config.icon || "";
                // CSS and JS are now loaded from separate files
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
