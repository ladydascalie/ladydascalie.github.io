/**
 * Cypherpunk Theme Template
 * Matrix-style hacker terminal with green phosphor glow
 */

const CypherpunkTheme = new ThemeTemplate("cypherpunk", {
        title: "{{personal.name}} - Cypherpunk Terminal",
        description: "Matrix-style hacker terminal with green phosphor glow",
        icon: "🔰",

        html: `
        <!-- Terminal Background -->
        <div class="terminal-bg"></div>

        <!-- Main Container -->
        <div class="container">
            <!-- ASCII Header -->
            <div class="ascii-art">
░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓███████▓▒░░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░       ░▒▓██████▓▒░░▒▓███████▓▒░░▒▓████████▓▒░▒▓██████▓▒░ ░▒▓███████▓▒░░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░
░▒▓█▓▒░         ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
░▒▓█▓▒░░▒▓█▓▒░  ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
░▒▓██████▓▒░   ░▒▓█▓▒░   ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░       ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░
            </div>

            <!-- Profile Terminal Window -->
            <div class="terminal-window">
                <div class="terminal-header">
                    <span class="window-title">{{personal.name|upper}} - SECURE TERMINAL</span>
                </div>

                <div class="terminal-content">
                    <div><span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">whoami</span></div>
                    <div class="output">
                        <strong>{{personal.name|upper}}</strong><br>
                        Status: <span class="status-online">[{{personal.status|upper}}]</span><br>
                        Clearance Level: <span class="status-secure">[{{personal.clearance|upper}}]</span><br>
                        Location: <span class="status-encrypted">[ENCRYPTED]</span>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">cat /etc/profile</span>
                    </div>
                    <div class="output">
                        <div class="profile-data">
                            <img src="{{personal.portrait}}" alt="{{personal.name}}" class="terminal-avatar">
                            <div class="profile-info">
                                <h2>{{personal.name}}</h2>
                                <p class="role">{{personal.title}} @ <a href="{{personal.companyUrl}}" target="_blank" class="secure-link">{{personal.company}}</a></p>
                                <div class="bio-text">
{{@each bio}}                                    <p>{{@item}}</p>
{{/each}}                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">ls -la /skills/</span>
                    </div>
                    <div class="output">
                        <div class="file-listing">
                            <div class="file-header">total 42</div>
                            <div class="file-category">
                                <div class="category-header">drwxr-xr-x 3 root root 4096 Jan 1 2024 languages/</div>
{{@each skills.languages}}                                <div class="file-item threat-{{@item|lookup(skills.threat_levels)|lower}}">-rwx------ 1 netrunner root {{@item}} [{{@item|lookup(skills.threat_levels)}}]</div>
{{/each}}                            </div>
                            <div class="file-category">
                                <div class="category-header">drwxr-xr-x 3 root root 4096 Jan 1 2024 systems/</div>
{{@each skills.systems}}                                <div class="file-item">-rwxr-xr-x 1 netrunner root {{@item}}</div>
{{/each}}                            </div>
                            <div class="file-category">
                                <div class="category-header">drwxr-xr-x 5 root root 4096 Jan 1 2024 expertise/</div>
{{@each skills.expertise}}                                <div class="file-item">-rwxr-xr-x 1 netrunner root {{@item}}</div>
{{/each}}                            </div>
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">find /projects -type f -name "*.repo"</span>
                    </div>
                    <div class="output">
                        <div class="project-list">
{{@each projects}}                            <div class="project-item">
                                <a href="{{@item.url}}" target="_blank" class="secure-link">/projects/{{@item.name}}</a>
                                <span class="project-desc">{{@item.description}}</span>
                                <span class="classification">{{@item.classification|or}}</span>
                                <span class="project-note">{{@item.note|or}}</span>
                            </div>
{{/each}}                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">cat /var/log/employment.log</span>
                    </div>
                    <div class="output">
                        <div class="career-log">
{{@each experience}}                            <div class="career-entry">
                                <div class="career-employer">
                                    <span class="career-company">{{@item.company}}</span>
                                </div>
{{@each @item.roles}}                                <div class="career-line">
                                    <span class="career-period">[{{@item.period}}]</span>
                                    <span class="career-role">{{@item.role}}</span>
                                    <span class="career-location">[{{@item.location}}]</span>
                                </div>
                                <div class="career-summary">{{@item.summary|or}}</div>
{{@each @item.highlights}}                                <div class="career-bullet">{{@item}}</div>
{{/each}}
{{/each}}                            </div>
{{/each}}                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">netstat -a | grep ESTABLISHED</span>
                    </div>
                    <div class="output">
                        <div class="network-connections">
                            <div class="connection-header">Active Secure Connections:</div>
                            <div class="connection-item">
                                <a href="mailto:{{contact.email}}" class="secure-link">[EMAIL_SECURE] {{contact.email}}</a>
                            </div>
                            <div class="connection-item">
                                <a href="{{contact.signal}}" target="_blank" class="secure-link">[SIGNAL_ENCRYPTED] Secure Messaging</a>
                            </div>
                            <div class="connection-item">
                                <a href="{{contact.linkedin}}" target="_blank" class="secure-link">[LINKEDIN_PROFESSIONAL] Network Access</a>
                            </div>
                            <div class="connection-item">
                                <a href="{{contact.github}}" target="_blank" class="secure-link">[GITHUB_REPOSITORIES] Code Repository</a>
                            </div>
                            <div class="connection-item">
                                <a href="{{contact.pgp}}" target="_blank" class="secure-link">[PGP_KEY] Public Encryption Key</a>
                            </div>
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">ps aux | grep meetup</span>
                    </div>
                    <div class="output">
                        <div class="meetup-info">
                            <div class="process-line">
                                netrunner 1337 0.0 0.1 <a href="{{meetup.url}}" target="_blank" class="secure-link">{{meetup.name}}</a>
                            </div>
                            <div class="process-details">
                                └─ {{meetup.description}}
                            </div>
                            <div class="process-details">
                                └─ Frequency: {{meetup.frequency}}
                            </div>
                            <div class="process-details">
                                └─ Activities: {{meetup.activities|join(", ")}}
                            </div>
                            <div class="encrypted-data">
                                └─ Encrypted Data: {{meetup.encrypted_data}}
                            </div>
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command">uname -a</span>
                    </div>
                    <div class="output">
                        <div class="system-info">
                            OS: {{system.os}}<br>
                            Version: {{system.version}}<br>
                            Processor: {{system.processor}}<br>
                            RAM: {{system.ram}}<br>
                            Storage: {{system.storage}}<br>
                            Network: {{system.network_status}}<br>
                            Reality Index: {{system.reality_index}}<br>
                            Neural Link: {{system.neural_link}}
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@cyberdeck:~$</span> <span class="command typing">_</span>
                    </div>
                </div>
            </div>

            <!-- Webring Terminal Window -->
            <div class="terminal-window">
                <div class="terminal-header">
                    <span class="window-title">WEBRING NETWORK ACCESS</span>
                </div>

                <div class="terminal-content">
                    <div><span class="prompt">netrunner@webring:~$</span> <span class="command">ls -la /net/connected_nodes/</span></div>
                    <div class="output">
                        <div class="network-connections">
                            <div class="connection-header">Active Network Nodes:</div>
{{@each webring.sites}}                            <div class="connection-item">
                                <a href="{{@item.url}}" target="_blank" class="secure-link">[NODE_{{@index|inc|pad}}] {{@item.url}}</a>
                            </div>
{{/each}}
                        </div>
                    </div>

                    <div style="margin: 20px 0;">
                        <span class="prompt">netrunner@webring:~$</span> <span class="command typing">_</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="footer-line">
                    <span class="footer-label">[SYSTEM STATUS]</span>
                    <span class="status-online">ONLINE</span>
                    <span class="footer-separator">|</span>
                    <span class="footer-label">[LAST UPDATE]</span>
                    <span>{{meta.last_updated}}</span>
                    <span class="footer-separator">|</span>
                    <span class="footer-label">[VISITORS]</span>
                    <span>{{meta.visitor_count}}</span>
                </div>
                <div class="footer-line">
                    <span class="footer-label">[BEST VIEWED]</span>
                    <span>{{meta.best_viewed}}</span>
                    <span class="footer-separator">|</span>
                    <span class="footer-label">[MADE WITH]</span>
                    <span>{{meta.made_with}}</span>
                    <span class="footer-separator">|</span>
                    <span class="footer-label">[YEAR]</span>
                    <span>{{meta.cyber_year}}</span>
                </div>
                <div class="footer-line">
                    <span class="footer-label">[HUMAN MODE]</span>
                    <a href="cv.html" class="secure-link">cv.html</a>
                    <span class="footer-separator">|</span>
                    <span class="footer-label">[MACHINE MODE]</span>
                    <a href="cv.json" class="secure-link">cv.json</a>
                </div>
            </div>
        </div>

        <!-- Cyberpunk Data Stream -->
        <div class="data-stream">
            <canvas id="data-canvas"></canvas>
        </div>

        <!-- Neural Interface Overlay -->
        <div class="neural-overlay"></div>
    `,
});

// Register the theme with the template engine
templateEngine.registerTheme("cypherpunk", CypherpunkTheme);
