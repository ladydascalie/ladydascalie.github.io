/**
 * Retro 90s Theme Template
 * Nostalgic 90s website with neon colors and cosmic backgrounds
 */

const Retro90sTheme = new ThemeTemplate("retro-90s", {
        title: "★ ☆ {{personal.name}}'s Cyber Space ☆ ★",
        description:
                "Nostalgic 90s website with neon colors and cosmic backgrounds",
        icon: "🌟",

        html: `
        <!-- Main Container -->
        <div class="container">
            <!-- Header -->
            <header class="header">
                <h1 class="title">★ ☆ {{personal.name|upper}}'S CYBER SPACE ☆ ★</h1>
                <div class="subtitle">{{personal.title}} @ {{personal.company}}</div>
                <div class="status">STATUS: {{personal.status|upper}} ✨</div>
                <div class="marquee">
                    <div class="marquee-content">Welcome to my homepage! • Check out my cool projects! • Email me! • Sign my guestbook! • </div>
                </div>
            </header>

            <!-- Navigation -->
            <nav class="nav">
                <div class="nav-item active" data-section="home">🏠 HOME</div>
                <div class="nav-item" data-section="about">👤 ABOUT</div>
                <div class="nav-item" data-section="projects">💻 PROJECTS</div>
                <div class="nav-item" data-section="skills">🛠️ SKILLS</div>
                <div class="nav-item" data-section="contact">📧 CONTACT</div>
                <div class="nav-item" data-section="guestbook">📝 GUESTBOOK</div>
            </nav>

            <!-- Main Content -->
            <main class="main">
                <!-- Home Section -->
                <section id="home" class="section active">
                    <div class="welcome-box">
                        <h2>🎉 WELCOME TO MY HOMEPAGE! 🎉</h2>
                        <div class="profile-showcase">
                            <img src="{{personal.portrait}}" alt="{{personal.name}}" class="profile-image bouncing">
                            <div class="speech-bubble">
                                <p>"Hey, I'm {{personal.short_name}}, a software engineer specializing in Go development and building scalable applications."</p>
                            </div>
                        </div>
                        <div class="visitor-counter">
                            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=" alt="Visitor Counter">
                            You are visitor number: <span class="counter">{{meta.visitor_count}}</span>!
                        </div>
                    </div>
                </section>

                <!-- About Section -->
                <section id="about" class="section">
                    <div class="content-box">
                        <h2>◄ ABOUT ME ►</h2>
                        <div class="profile-card">
                            <div class="profile-header">
                                <img src="{{personal.portrait}}" alt="{{personal.name}}" class="profile-pic">
                                <div class="profile-info">
                                    <h3>{{personal.name}}</h3>
                                    <p class="job-title">{{personal.title}}</p>
                                    <p class="company">@ <a href="{{personal.companyUrl}}" target="_blank" class="rainbow-link">{{personal.company}}</a></p>
                                    <p class="location">📍 {{personal.location}}</p>
                                </div>
                            </div>
                            <div class="bio">
                                <div class="bio-paragraph">{{bio.0}}</div>
                                <div class="bio-paragraph">{{bio.1}}</div>
                                <div class="bio-paragraph">{{bio.2}}</div>
                                <div class="bio-paragraph">{{bio.3}}</div>
                                <div class="bio-paragraph">{{bio.4}}</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Projects Section -->
                <section id="projects" class="section">
                    <div class="content-box">
                        <h2>◄ MY COOL PROJECTS ►</h2>
                        <div class="projects-grid">
                            <div class="project-card">
                                <h4><a href="{{projects.0.url}}" target="_blank" class="project-link">{{projects.0.name}}</a></h4>
                                <p class="project-desc">{{projects.0.description}}</p>
                                <div class="project-status new">NEW!</div>
                            </div>
                            <div class="project-card">
                                <h4><a href="{{projects.1.url}}" target="_blank" class="project-link">{{projects.1.name}}</a></h4>
                                <p class="project-desc">{{projects.1.description}}</p>
                                <div class="project-status cool">COOL!</div>
                            </div>
                            <div class="project-card">
                                <h4><a href="{{projects.2.url}}" target="_blank" class="project-link">{{projects.2.name}}</a></h4>
                                <p class="project-desc">{{projects.2.description}}</p>
                                <div class="project-status hot">HOT!</div>
                            </div>
                            <div class="project-card">
                                <h4><a href="{{projects.3.url}}" target="_blank" class="project-link">{{projects.3.name}}</a></h4>
                                <p class="project-desc">{{projects.3.description}}</p>
                                <div class="project-status awesome">AWESOME!</div>
                            </div>
                            <div class="project-card">
                                <h4><a href="{{projects.4.url}}" target="_blank" class="project-link">{{projects.4.name}}</a></h4>
                                <p class="project-desc">{{projects.4.description}}</p>
                                <div class="project-status rad">RAD!</div>
                            </div>
                            <div class="project-card">
                                <h4><a href="{{projects.5.url}}" target="_blank" class="project-link">{{projects.5.name}}</a></h4>
                                <p class="project-desc">{{projects.5.description}}</p>
                                <div class="project-status tubular">TUBULAR!</div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Skills Section -->
                <section id="skills" class="section">
                    <div class="content-box">
                        <h2>◄ MY TECHNICAL SKILLS ►</h2>
                        <div class="skills-container">
                            <div class="skill-category">
                                <h3>💻 Programming Languages</h3>
                                <div class="skill-bars">
                                    <div class="skill-bar">
                                        <span class="skill-name">{{skills.languages.0}}</span>
                                        <div class="bar"><div class="progress" data-progress="95"></div></div>
                                    </div>
                                    <div class="skill-bar">
                                        <span class="skill-name">{{skills.languages.1}}</span>
                                        <div class="bar"><div class="progress" data-progress="85"></div></div>
                                    </div>
                                    <div class="skill-bar">
                                        <span class="skill-name">{{skills.languages.2}}</span>
                                        <div class="bar"><div class="progress" data-progress="75"></div></div>
                                    </div>
                                    <div class="skill-bar">
                                        <span class="skill-name">{{skills.languages.3}}</span>
                                        <div class="bar"><div class="progress" data-progress="70"></div></div>
                                    </div>
                                </div>
                            </div>
                            <div class="skill-category">
                                <h3>🌐 Systems & Tools</h3>
                                <div class="skill-tags">
                                    <span class="skill-tag">{{skills.systems.0}}</span>
                                    <span class="skill-tag">{{skills.systems.1}}</span>
                                    <span class="skill-tag">{{skills.systems.2}}</span>
                                </div>
                            </div>
                            <div class="skill-category">
                                <h3>🚀 Expertise Areas</h3>
                                <div class="expertise-list">
                                    <div class="expertise-item">✨ {{skills.expertise.0}}</div>
                                    <div class="expertise-item">⚡ {{skills.expertise.1}}</div>
                                    <div class="expertise-item">👥 {{skills.expertise.2}}</div>
                                    <div class="expertise-item">🔧 {{skills.expertise.3}}</div>
                                    <div class="expertise-item">🛠️ {{skills.expertise.4}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section id="contact" class="section">
                    <div class="content-box">
                        <h2>◄ GET IN TOUCH! ►</h2>
                        <div class="contact-grid">
                            <a href="mailto:{{contact.email}}" class="contact-btn email">
                                <div class="contact-icon">📧</div>
                                <div class="contact-label">EMAIL ME!</div>
                                <div class="contact-detail">{{contact.email}}</div>
                            </a>
                            <a href="{{contact.github}}" target="_blank" class="contact-btn github">
                                <div class="contact-icon">🐱</div>
                                <div class="contact-label">GITHUB</div>
                                <div class="contact-detail">Check out my code!</div>
                            </a>
                            <a href="{{contact.linkedin}}" target="_blank" class="contact-btn linkedin">
                                <div class="contact-icon">💼</div>
                                <div class="contact-label">LINKEDIN</div>
                                <div class="contact-detail">Professional stuff</div>
                            </a>
                            <a href="{{contact.signal}}" target="_blank" class="contact-btn signal">
                                <div class="contact-icon">🔒</div>
                                <div class="contact-label">SIGNAL</div>
                                <div class="contact-detail">Secure messaging</div>
                            </a>
                        </div>

                        <!-- Meetup Section -->
                        <div class="meetup-section">
                            <h3>🐹 Join Our Meetup! 🐹</h3>
                            <div class="meetup-card">
                                <h4><a href="{{meetup.url}}" target="_blank" class="meetup-link">{{meetup.name}}</a></h4>
                                <p>{{meetup.description}}</p>
                                <p><strong>When:</strong> {{meetup.frequency}}</p>
                                <div class="meetup-activities">
                                    <span class="activity-badge">{{meetup.activities.0}}</span>
                                    <span class="activity-badge">{{meetup.activities.1}}</span>
                                    <span class="activity-badge">{{meetup.activities.2}}</span>
                                    <span class="activity-badge">{{meetup.activities.3}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Guestbook Section -->
                <section id="guestbook" class="section">
                    <div class="content-box">
                        <h2>◄ SIGN MY GUESTBOOK! ►</h2>
                        <div class="guestbook">
                            <div class="guestbook-form">
                                <h3>Leave a message!</h3>
                                <form class="guest-form">
                                    <input type="text" placeholder="Your Name" class="form-input" required>
                                    <input type="email" placeholder="Your Email (optional)" class="form-input">
                                    <textarea placeholder="Your awesome message!" class="form-textarea" required></textarea>
                                    <button type="submit" class="submit-btn">SIGN GUESTBOOK! 🌟</button>
                                </form>
                            </div>
                            <div class="guestbook-entries">
                                <h3>Recent Entries:</h3>
                                <div class="guest-entry">
                                    <div class="guest-header">
                                        <strong>CyberGopher42</strong> - <span class="guest-date">Dec 15, 2024</span>
                                    </div>
                                    <div class="guest-message">Awesome website! Love the Go projects! 🐹</div>
                                </div>
                                <div class="guest-entry">
                                    <div class="guest-header">
                                        <strong>RetroFan90s</strong> - <span class="guest-date">Dec 12, 2024</span>
                                    </div>
                                    <div class="guest-message">This brings back so many memories! Totally radical site! ⭐</div>
                                </div>
                                <div class="guest-entry">
                                    <div class="guest-header">
                                        <strong>CodeMaster</strong> - <span class="guest-date">Dec 10, 2024</span>
                                    </div>
                                    <div class="guest-message">Really impressed by your LootLocker work! Keep coding! 💻</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Footer -->
            <footer class="footer">
                <!-- Web Ring -->
                <div class="webring">
                    <h3>◄ CYBER WEB RING ►</h3>
                    <div class="webring-nav">
                        <a href="{{webring.sites.0.url}}" target="_blank" class="webring-btn">{{webring.sites.0.url}}</a>
                        <a href="{{webring.sites.1.url}}" target="_blank" class="webring-btn">{{webring.sites.1.url}}</a>
                        <a href="{{webring.sites.2.url}}" target="_blank" class="webring-btn">{{webring.sites.2.url}}</a>
                        <a href="{{webring.sites.3.url}}" target="_blank" class="webring-btn">{{webring.sites.3.url}}</a>
                    </div>
                </div>

                <!-- Stats -->
                <div class="stats">
                    <div class="stat-item">
                        <strong>👥 Visitors:</strong> {{meta.visitor_count}}
                    </div>
                    <div class="stat-item">
                        <strong>🗓️ Last Updated:</strong> {{meta.last_updated}}
                    </div>
                    <div class="stat-item">
                        <strong>💻 Best Viewed:</strong> {{meta.best_viewed}}
                    </div>
                    <div class="stat-item">
                        <strong>❤️ Made with:</strong> {{meta.made_with}}
                    </div>
                </div>

                <!-- Copyright -->
                <div class="copyright">
                    <p>© {{meta.real_year}} {{personal.name}} - All rights reserved!</p>
                    <p>Made to be enjoyed by humans! 🌟</p>
                </div>
            </footer>
        </div>

        <!-- Floating Elements -->
        <div class="floating-elements">
            <div class="floating-star" data-char="★">★</div>
            <div class="floating-star" data-char="☆">☆</div>
            <div class="floating-star" data-char="✨">✨</div>
            <div class="floating-star" data-char="💫">💫</div>
            <div class="floating-star" data-char="🌟">🌟</div>
            <div class="floating-star" data-char="⭐">⭐</div>
            <div class="floating-star" data-char="💎">💎</div>
            <div class="floating-star" data-char="🔥">🔥</div>
        </div>

        <!-- Background Pattern -->
        <div class="bg-pattern"></div>
    `,
});

// Register the theme with the template engine
templateEngine.registerTheme("retro-90s", Retro90sTheme);
