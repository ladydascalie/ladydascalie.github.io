/**
 * Hexcore Theme Template
 * An arcane hexagonal core over the mage's ledger.
 */

const HexcoreTheme = new ThemeTemplate("hexcore", {
	title: "{{personal.name}} - Hexcore",
	description:
		"An arcane hexcore ledger: rune paths, guild ledger and sending stones.",
	icon: "⬡",

	html: `
<script>
	(function () {
		try {
			var saved = localStorage.getItem("hexcore-theme");
			if (saved === "light" || saved === "dark") {
				document.documentElement.dataset.theme = saved;
			}
		} catch (error) {
			/* storage blocked; stay on the dark default */
		}
	})();
</script>

<div class="hexcore" data-hexcore="hexcore">
	<div class="shell">
		<header class="masthead">
			<div class="masthead-bar">
				<span class="wordmark">
					<span class="wordmark-mark" aria-hidden="true">░▓</span>
					<span>dark<span class="wordmark-accent">mage</span></span>
				</span>
				<span class="masthead-rune" aria-hidden="true">┌── hexcore ──┐</span>
				<button class="theme-toggle" id="theme-toggle" type="button" hidden>[ light ]</button>
			</div>

			<div class="masthead-core" aria-labelledby="mage-name">
				<div class="core-stage">
				<div class="core" id="hexcore-core">
					<svg class="core-facets" viewBox="0 0 200 224" aria-hidden="true" focusable="false">
						<polygon class="core-outline" points="100,16 183.1,64 183.1,160 100,208 16.9,160 16.9,64"></polygon>
						<polygon class="core-inner" points="100,52.5 151.5,82.3 151.5,141.8 100,171.5 48.5,141.8 48.5,82.3"></polygon>
						<polygon class="facet facet-1" points="100,112 100,16 183.1,64"></polygon>
						<polygon class="facet facet-2" points="100,112 183.1,64 183.1,160"></polygon>
						<polygon class="facet facet-3" points="100,112 183.1,160 100,208"></polygon>
						<polygon class="facet facet-4" points="100,112 100,208 16.9,160"></polygon>
						<polygon class="facet facet-5" points="100,112 16.9,160 16.9,64"></polygon>
						<polygon class="facet facet-6" points="100,112 16.9,64 100,16"></polygon>
					</svg>
					<div class="core-portrait">
						<img src="{{personal.portrait}}" alt="{{personal.name}}" width="320" height="320">
					</div>
					<span class="core-rune rune-1" aria-hidden="true">░</span>
					<span class="core-rune rune-2" aria-hidden="true">▒</span>
					<span class="core-rune rune-3" aria-hidden="true">▓</span>
					<span class="core-rune rune-4" aria-hidden="true">░</span>
					<span class="core-rune rune-5" aria-hidden="true">▒</span>
					<span class="core-rune rune-6" aria-hidden="true">▓</span>
				</div>
			</div>

			<div class="identity">
				<p class="identity-eyebrow" aria-hidden="true">┌ the mage ┐</p>
				<h1 id="mage-name">{{personal.name}}</h1>
				<p class="identity-title">{{personal.title}} at <a href="{{personal.companyUrl}}">{{personal.company}}</a></p>
				<p class="identity-badges">
					<span class="badge">[ {{mage.class}} ]</span>
					<span class="badge">[ circle: {{mage.circle}} ]</span>
					<span class="badge">[ focus: {{mage.focus}} ]</span>
				</p>
			</div>
			</div>
		</header>

		<div class="rule" aria-hidden="true">▓▒░────────────────────────────────────────────────────────────░▒▓</div>

		<section class="panel" aria-labelledby="account-head">
			<h2 class="section-head" id="account-head">
				<span class="section-glyph" aria-hidden="true">▒</span>
				<span>The mage's account</span>
				<span class="section-note" aria-hidden="true">bio</span>
			</h2>
			<div class="prose">
{{@each bio}}				<p>{{@item}}</p>
{{/each}}			</div>
		</section>

		<section class="panel" aria-labelledby="runes-head">
			<h2 class="section-head" id="runes-head">
				<span class="section-glyph" aria-hidden="true">▓</span>
				<span>Rune paths</span>
				<span class="section-note" aria-hidden="true">skills</span>
			</h2>

			<ul class="rune-paths">
{{@each skills.languages}}				<li class="rune-path">
					<span class="rune-mark" aria-hidden="true">░</span>
					<span class="rune-name">{{@item}}</span>
					<span class="badge badge-rune">[ {{@item|lookup(runes)|or("Unbound")}} ]</span>
				</li>
{{/each}}			</ul>

			<h3 class="sub-head">Named facets: systems</h3>
			<ul class="facets">
{{@each skills.systems}}				<li class="facet-card"><span class="facet-index" aria-hidden="true">{{@index|inc|pad(2)}}</span><span>{{@item}}</span></li>
{{/each}}			</ul>

			<h3 class="sub-head">Named facets: expertise</h3>
			<ul class="facets">
{{@each skills.expertise}}				<li class="facet-card"><span class="facet-index" aria-hidden="true">{{@index|inc|pad(2)}}</span><span>{{@item}}</span></li>
{{/each}}			</ul>
		</section>

		<section class="panel" aria-labelledby="ledger-head">
			<h2 class="section-head" id="ledger-head">
				<span class="section-glyph" aria-hidden="true">░</span>
				<span>Guild ledger</span>
				<span class="section-note" aria-hidden="true">experience</span>
			</h2>

			<ol class="ledger">
{{@each experience}}				<li class="guild">
					<p class="guild-name">{{@item.company}}</p>
{{@each @item.roles}}					<div class="role">
						<div class="role-line">
							<span class="role-title">{{@item.role}}</span>
							<span class="badge badge-period">[ {{@item.period}} ]</span>
							<span class="role-location">{{@item.location}}</span>
						</div>
						<p class="role-summary">{{@item.summary|or}}</p>
						<ul class="highlights">
{{@each @item.highlights}}							<li>{{@item}}</li>
{{/each}}						</ul>
					</div>
{{/each}}				</li>
{{/each}}			</ol>
		</section>

		<section class="panel" aria-labelledby="artefacts-head">
			<h2 class="section-head" id="artefacts-head">
				<span class="section-glyph" aria-hidden="true">▒</span>
				<span>Artefacts</span>
				<span class="section-note" aria-hidden="true">projects</span>
			</h2>

			<ul class="artefacts">
{{@each projects}}				<li class="artefact">
					<a class="artefact-name" href="{{@item.url}}">{{@item.name}}</a>
					<p class="artefact-desc">{{@item.description}}</p>
					<p class="artefact-note">{{@item.note|or}}</p>
				</li>
{{/each}}			</ul>
		</section>

		<section class="panel" aria-labelledby="conclave-head">
			<h2 class="section-head" id="conclave-head">
				<span class="section-glyph" aria-hidden="true">▓</span>
				<span>Conclave</span>
				<span class="section-note" aria-hidden="true">meetup</span>
			</h2>

			<p class="conclave-name"><a href="{{meetup.url}}">{{meetup.name}}</a></p>
			<p class="role-summary">{{meetup.description}}</p>
			<p class="conclave-meta">
				<span class="badge">[ {{meetup.frequency}} ]</span>
				<span class="badge">[ {{meetup.shortName}} ]</span>
			</p>
			<ul class="activities">
{{@each meetup.activities}}				<li>{{@item}}</li>
{{/each}}			</ul>
		</section>

		<section class="panel" aria-labelledby="stones-head">
			<h2 class="section-head" id="stones-head">
				<span class="section-glyph" aria-hidden="true">░</span>
				<span>Sending stones</span>
				<span class="section-note" aria-hidden="true">contact</span>
			</h2>

			<ul class="stones">
				<li><span class="stone-label">[ email ]</span><a href="mailto:{{contact.email}}">{{contact.email}}</a></li>
				<li><span class="stone-label">[ signal ]</span><a href="{{contact.signal}}">signal.me</a></li>
				<li><span class="stone-label">[ linkedin ]</span><a href="{{contact.linkedin}}">linkedin.com</a></li>
				<li><span class="stone-label">[ github ]</span><a href="{{contact.github}}">github.com</a></li>
				<li><span class="stone-label">[ pgp ]</span><a href="{{contact.pgp}}">public key</a></li>
			</ul>

			<h3 class="sub-head">Open channels</h3>
			<ul class="stones">
{{@each contact.channels}}				<li><span class="stone-label">[ {{@item.name}} ]</span><a href="{{@item.url}}">{{@item.url}}</a></li>
{{/each}}			</ul>
		</section>

		<section class="panel" aria-labelledby="circles-head">
			<h2 class="section-head" id="circles-head">
				<span class="section-glyph" aria-hidden="true">▒</span>
				<span>Allied circles</span>
				<span class="section-note" aria-hidden="true">webring</span>
			</h2>

			<ol class="circles">
{{@each webring.sites}}				<li>
					<span class="circle-index" aria-hidden="true">{{@index|inc|pad(2)}}</span>
					<a href="{{@item.url}}">{{@item.url}}</a>
				</li>
{{/each}}			</ol>
		</section>

		<footer class="footer">
			<p class="footer-line">
				<span class="footer-rune" aria-hidden="true">░▒▓</span>
				<span>{{footer.flavour}}</span>
			</p>
			<p class="footer-line">
				<a href="cv.html">[ cv.html ]</a>
				<a href="cv.json">[ cv.json ]</a>
				<span class="footer-year">[ {{meta.real_year}} ]</span>
			</p>
		</footer>
	</div>
</div>
`,
});

templateEngine.registerTheme("hexcore", HexcoreTheme);
