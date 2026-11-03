/**
 * Hexcore theme behaviour: light/dark toggle.
 * The dark palette is the default from tokens.css; this only persists a
 * choice the reader makes. The theme bootstrap in the page head sets the
 * attribute before the rest parses.
 */

(function () {
	var KEY = "hexcore-theme";
	var root = document.documentElement;
	var button = document.getElementById("theme-toggle");

	if (!button) return;

	function current() {
		return root.dataset.theme === "light" ? "light" : "dark";
	}

	function render() {
		var mode = current();
		var next = mode === "light" ? "dark" : "light";
		button.textContent = "[ " + next + " ]";
		button.setAttribute("aria-label", "Switch to " + next + " theme");
		button.setAttribute("aria-pressed", mode === "light" ? "true" : "false");
	}

	function persist(mode) {
		try {
			localStorage.setItem(KEY, mode);
		} catch (error) {
			/* storage blocked; the choice still applies to this page */
		}
	}

	button.hidden = false;
	render();

	button.addEventListener("click", function () {
		var next = current() === "light" ? "dark" : "light";
		root.dataset.theme = next;
		persist(next);
		render();
	});
})();
