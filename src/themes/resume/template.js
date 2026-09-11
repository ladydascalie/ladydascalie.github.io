/**
 * Plain Resume Template
 * Semantic, recruiter-readable, print-to-PDF friendly. No terminal cosmetics.
 */

const ResumeTheme = new ThemeTemplate("resume", {
	title: "{{personal.name}} - CV",
	description: "CV for {{personal.name}}, {{personal.title}}",
	icon: "📄",

	html: `
        <header class="cv-header">
            <h1>{{personal.name}}</h1>
            <p class="cv-role">{{personal.title}} · {{personal.company}}</p>
            <p class="cv-contact">
                <a href="mailto:{{contact.email}}">{{contact.email}}</a> ·
                <a href="{{contact.github}}">github.com/ladydascalie</a> ·
                <a href="{{contact.linkedin}}">LinkedIn</a> ·
                <a href="cv.json">cv.json</a>
            </p>
        </header>

        <section class="cv-section">
            <h2>About</h2>
{{@each bio}}            <p>{{@item}}</p>
{{/each}}        </section>

        <section class="cv-section">
            <h2>Experience</h2>
{{@each experience}}            <article class="cv-job">
                <h3>{{@item.company}}</h3>
{{@each @item.roles}}                <div class="cv-subrole">
                    <h4>{{@item.role}}</h4>
                    <p class="cv-meta">{{@item.period}} · {{@item.location}}</p>
                    <p class="cv-summary">{{@item.summary|or}}</p>
                    <ul class="cv-points">{{@each @item.highlights}}<li>{{@item}}</li>{{/each}}</ul>
                </div>
{{/each}}            </article>
{{/each}}        </section>

        <section class="cv-section">
            <h2>Skills</h2>
            <p><strong>Languages:</strong> {{skills.languages|join(", ")}}</p>
            <p><strong>Systems:</strong> {{skills.systems|join(", ")}}</p>
            <p><strong>Expertise:</strong> {{skills.expertise|join(", ")}}</p>
        </section>

        <section class="cv-section">
            <h2>Open Source &amp; Projects</h2>
            <ul>
{{@each projects}}                <li><a href="{{@item.url}}">{{@item.name}}</a> - {{@item.description}}{{@item.note|or}}</li>
{{/each}}            </ul>
        </section>

        <section class="cv-section">
            <h2>Community</h2>
            <p>Co-organiser of <a href="{{meetup.url}}">{{meetup.shortName}}</a>, {{meetup.frequency|lower}} meetups. {{meetup.description}}</p>
        </section>
    `,
});

// Register the theme with the template engine
templateEngine.registerTheme("resume", ResumeTheme);