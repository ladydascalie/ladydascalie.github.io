/**
 * Windows 9x Theme Template
 * Classic Windows 95/98/ME desktop experience
 */

const Windows9xTheme = new ThemeTemplate("windows9x", {
        title: "{{personal.name}} - Windows 9x Desktop",
        description:
                "Classic Windows 95/98 desktop with retro computing nostalgia",
        icon: "💻",

        html: `
        <!-- Desktop Background -->
        <div class="desktop">
            <!-- Desktop Icons -->
            <div class="icon recycle-bin">
                <div class="icon-image">🗑️</div>
                <div>Recycle Bin</div>
            </div>
            <div class="icon my-computer">
                <div class="icon-image">💻</div>
                <div>My Computer</div>
            </div>
            <div class="icon network">
                <div class="icon-image">🌐</div>
                <div>Network Neighborhood</div>
            </div>
            <div class="icon my-documents">
                <div class="icon-image">📁</div>
                <div>My Documents</div>
            </div>
            <div class="icon my-projects">
                <div class="icon-image">📊</div>
                <div>My Projects</div>
            </div>
            <div class="icon properties">
                <div class="icon-image">👤</div>
                <div>{{personal.short_name}} Properties</div>
            </div>

            <!-- Main Profile Properties Window -->
            <div class="window profile-window">
                <div class="title-bar">
                    <span>👤 {{personal.name}} - Properties</span>
                    <div class="window-controls">
                        <div class="control-btn minimize">_</div>
                        <div class="control-btn maximize">□</div>
                        <div class="control-btn close">✕</div>
                    </div>
                </div>
                <div class="menu-bar">
                    <span class="menu-item">File</span>
                    <span class="menu-item">Edit</span>
                    <span class="menu-item">View</span>
                    <span class="menu-item">Help</span>
                </div>
                <div class="window-content">
                    <div class="profile-header">
                        <img src="{{personal.portrait}}" alt="{{personal.name}}" class="profile-icon" />
                        <div class="profile-info">
                            <h2>{{personal.name}}</h2>
                            <p class="role">{{personal.title}} @ <a href="{{personal.companyUrl}}">{{personal.company}}</a></p>
                            <p class="status">Status: <span class="online">{{personal.status}}</span></p>
                        </div>
                    </div>

                    <div class="bio-section">
                        <p>{{bio.0}}</p>
                        <p>{{bio.1}}</p>
                        <p>{{bio.2}}</p>
                    </div>

                    <div class="info-panel">
                        <div class="panel-header">Skills:</div>
                        <div class="panel-content">
                            Languages: {{skills.languages.0}}, {{skills.languages.1}}, {{skills.languages.2}}, {{skills.languages.3}}<br />
                            Systems: {{skills.systems.0}}, {{skills.systems.1}}, {{skills.systems.2}}<br />
                            Expertise: {{skills.expertise.0}}, {{skills.expertise.1}}, {{skills.expertise.2}}
                        </div>
                    </div>

                    <div class="info-panel">
                        <div class="panel-header">Contact:</div>
                        <div class="panel-content">
                            <a href="{{contact.signal}}">Signal</a> |
                            <a href="{{contact.linkedin}}">LinkedIn</a> |
                            <a href="mailto:{{contact.email}}">Email</a> |
                            <a href="{{contact.github}}">GitHub</a> |
                            <a href="{{contact.pgp}}">PGP Key</a>
                        </div>
                    </div>

                    <div class="info-panel">
                        <div class="panel-header">{{meetup.shortName}}:</div>
                        <div class="panel-content">
                            <a href="{{meetup.url}}">{{meetup.name}}</a><br />
                            {{meetup.description}}<br />
                            Frequency: {{meetup.frequency}}
                        </div>
                    </div>

                    <div class="button-panel">
                        <button class="win-button" data-action="properties">Properties</button>
                        <button class="win-button" data-action="my projects">My Projects</button>
                        <button class="win-button" data-action="web ring">Web Ring</button>
                        <button class="win-button" data-action="about">About</button>
                    </div>
                </div>
            </div>

            <!-- Projects Window (initially hidden) -->
            <div class="window projects-window" style="display: none; top: 80px; left: 150px;">
                <div class="title-bar">
                    <span>📊 My Projects - Explorer</span>
                    <div class="window-controls">
                        <div class="control-btn minimize">_</div>
                        <div class="control-btn maximize">□</div>
                        <div class="control-btn close">✕</div>
                    </div>
                </div>
                <div class="menu-bar">
                    <span class="menu-item">File</span>
                    <span class="menu-item">Edit</span>
                    <span class="menu-item">View</span>
                    <span class="menu-item">Tools</span>
                </div>
                <div class="window-content">
                    <div class="explorer-header">
                        <div class="explorer-toolbar">
                            <button class="toolbar-btn">Back</button>
                            <button class="toolbar-btn">Forward</button>
                            <button class="toolbar-btn">Up</button>
                            <div class="address-bar">C:\\Users\\{{personal.short_name}}\\Projects\\</div>
                        </div>
                    </div>
                    <div class="file-list">
                        <div class="file-headers">
                            <span class="col-name">Name</span>
                            <span class="col-type">Type</span>
                            <span class="col-desc">Description</span>
                        </div>
                        <div class="file-item" data-url="{{projects.0.url}}">
                            <span class="file-icon">📄</span>
                            <span class="file-name">{{projects.0.name}}</span>
                            <span class="file-type">Go Project</span>
                            <span class="file-desc">{{projects.0.description}}</span>
                        </div>
                        <div class="file-item" data-url="{{projects.1.url}}">
                            <span class="file-icon">📄</span>
                            <span class="file-name">{{projects.1.name}}</span>
                            <span class="file-type">Library</span>
                            <span class="file-desc">{{projects.1.description}}</span>
                        </div>
                        <div class="file-item" data-url="{{projects.2.url}}">
                            <span class="file-icon">📄</span>
                            <span class="file-name">{{projects.2.name}}</span>
                            <span class="file-type">Config Tool</span>
                            <span class="file-desc">{{projects.2.description}}</span>
                        </div>
                        <div class="file-item" data-url="{{projects.3.url}}">
                            <span class="file-icon">🖥️</span>
                            <span class="file-name">{{projects.3.name}}</span>
                            <span class="file-type">GUI App</span>
                            <span class="file-desc">{{projects.3.description}}</span>
                        </div>
                        <div class="file-item" data-url="{{projects.4.url}}">
                            <span class="file-icon">📄</span>
                            <span class="file-name">{{projects.4.name}}</span>
                            <span class="file-type">Go Library</span>
                            <span class="file-desc">{{projects.4.description}}</span>
                        </div>
                        <div class="file-item" data-url="{{projects.5.url}}">
                            <span class="file-icon">🔧</span>
                            <span class="file-name">{{projects.5.name}}</span>
                            <span class="file-type">Database Tool</span>
                            <span class="file-desc">{{projects.5.description}}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Web Ring Window (initially hidden) -->
            <div class="window webring-window" style="display: none; top: 120px; left: 200px; width: 380px; height: 280px;">
                <div class="title-bar">
                    <span>🌐 Internet Explorer - Web Ring</span>
                    <div class="window-controls">
                        <div class="control-btn minimize">_</div>
                        <div class="control-btn maximize">□</div>
                        <div class="control-btn close">✕</div>
                    </div>
                </div>
                <div class="menu-bar">
                    <span class="menu-item">File</span>
                    <span class="menu-item">Edit</span>
                    <span class="menu-item">View</span>
                    <span class="menu-item">Favorites</span>
                    <span class="menu-item">Tools</span>
                </div>
                <div class="window-content">
                    <div class="ie-toolbar">
                        <button class="toolbar-btn">Back</button>
                        <button class="toolbar-btn">Forward</button>
                        <button class="toolbar-btn">Stop</button>
                        <button class="toolbar-btn">Refresh</button>
                        <button class="toolbar-btn">Home</button>
                    </div>
                    <div class="address-bar-container">
                        <label>Address:</label>
                        <input type="text" class="address-input" value="https://webring.local/members" readonly />
                        <button class="go-btn">Go</button>
                    </div>
                    <div class="webring-content">
                        <h3>🎯 Personal Web Ring</h3>
                        <p>Cool sites by awesome people:</p>
                        <div class="webring-links">
                            <div class="webring-link">
                                <span class="link-icon">🔗</span>
                                <a href="{{webring.sites.0.url}}">{{webring.sites.0.url}}</a>
                            </div>
                            <div class="webring-link">
                                <span class="link-icon">🔗</span>
                                <a href="{{webring.sites.1.url}}">{{webring.sites.1.url}}</a>
                            </div>
                            <div class="webring-link">
                                <span class="link-icon">🔗</span>
                                <a href="{{webring.sites.2.url}}">{{webring.sites.2.url}}</a>
                            </div>
                            <div class="webring-link">
                                <span class="link-icon">🔗</span>
                                <a href="{{webring.sites.3.url}}">{{webring.sites.3.url}}</a>
                            </div>
                        </div>
                        <div class="webring-nav">
                            <button class="win-button">← Previous</button>
                            <button class="win-button">Random</button>
                            <button class="win-button">Next →</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- About Dialog (initially hidden) -->
            <div class="dialog about-dialog" style="display: none;">
                <div class="title-bar">
                    <span>About {{personal.short_name}}</span>
                    <div class="window-controls">
                        <div class="control-btn close">✕</div>
                    </div>
                </div>
                <div class="dialog-content">
                    <div class="about-icon">ℹ️</div>
                    <div class="about-text">
                        <h3>{{personal.name}}</h3>
                        <p>{{personal.title}}</p>
                        <p>{{windows.os}}</p>
                        <p>{{windows.processor}}</p>
                        <p>{{windows.ram}}</p>
                        <p>Version {{windows.version}}</p>
                        <p>© {{meta.real_year}} {{personal.name}}</p>
                    </div>
                    <button class="win-button about-ok">OK</button>
                </div>
            </div>
        </div>

        <!-- Taskbar -->
        <div class="taskbar">
            <div class="start-button">
                <div class="start-icon"></div>
                Start
            </div>
            <div class="taskbar-apps">
                <div class="taskbar-button active">👤 {{personal.short_name}} - Properties</div>
            </div>
            <div class="system-tray">
                <span class="tray-icon" title="Volume">🔊</span>
                <span class="tray-icon" title="Network">📡</span>
                <span id="clock" class="system-clock">12:34 PM</span>
            </div>
        </div>

        <!-- Start Menu -->
        <div class="start-menu" id="startMenu" style="display: none;">
            <div class="start-menu-header">
                <div class="start-menu-user">
                    <img src="{{personal.portrait}}" alt="{{personal.name}}" class="start-menu-avatar" />
                    <span>{{personal.name}}</span>
                </div>
                <div class="start-menu-separator"></div>
            </div>
            <div class="start-menu-items">
                <div class="start-menu-item" data-action="programs">
                    <span class="start-menu-icon">📁</span>
                    <span>Programs</span>
                    <span class="submenu-arrow">►</span>
                </div>
                <div class="start-menu-item" data-action="documents">
                    <span class="start-menu-icon">📄</span>
                    <span>Documents</span>
                    <span class="submenu-arrow">►</span>
                </div>
                <div class="start-menu-separator"></div>
                <div class="start-menu-item" data-action="settings">
                    <span class="start-menu-icon">⚙️</span>
                    <span>Settings</span>
                    <span class="submenu-arrow">►</span>
                </div>
                <div class="start-menu-item" data-action="find">
                    <span class="start-menu-icon">🔍</span>
                    <span>Find</span>
                    <span class="submenu-arrow">►</span>
                </div>
                <div class="start-menu-item" data-action="help">
                    <span class="start-menu-icon">❓</span>
                    <span>Help</span>
                </div>
                <div class="start-menu-item" data-action="run">
                    <span class="start-menu-icon">🔄</span>
                    <span>Run...</span>
                </div>
                <div class="start-menu-separator"></div>
                <div class="start-menu-item" data-action="shutdown">
                    <span class="start-menu-icon">⏹️</span>
                    <span>Shut Down...</span>
                </div>
            </div>
        </div>

        <!-- Start Menu Programs Submenu -->
        <div class="start-submenu programs-submenu" id="programsSubmenu" style="display: none;">
            <div class="start-menu-item" data-action="accessories">
                <span class="start-menu-icon">🔧</span>
                <span>Accessories</span>
                <span class="submenu-arrow">►</span>
            </div>
            <div class="start-menu-item" data-action="my-projects">
                <span class="start-menu-icon">📊</span>
                <span>My Projects</span>
            </div>
            <div class="start-menu-item" data-action="web-ring">
                <span class="start-menu-icon">🌐</span>
                <span>Web Ring</span>
            </div>
            <div class="start-menu-item" data-action="about">
                <span class="start-menu-icon">ℹ️</span>
                <span>About {{personal.short_name}}</span>
            </div>
        </div>

        <!-- Documents Dialog (initially hidden) -->
        <div class="dialog documents-dialog" style="display: none;">
            <div class="title-bar">
                <span>📄 My Documents</span>
                <div class="window-controls">
                    <div class="control-btn close">✕</div>
                </div>
            </div>
            <div class="dialog-content">
                <div class="about-icon">📄</div>
                <div class="about-text">
                    <h3>My Documents</h3>
                    <p>This folder is empty.</p>
                    <p>You can store your documents here for easy access.</p>
                </div>
                <button class="win-button dialog-ok">OK</button>
            </div>
        </div>

        <!-- Control Panel Dialog (initially hidden) -->
        <div class="dialog control-panel-dialog" style="display: none;">
            <div class="title-bar">
                <span>⚙️ Control Panel</span>
                <div class="window-controls">
                    <div class="control-btn close">✕</div>
                </div>
            </div>
            <div class="dialog-content">
                <div class="about-icon">⚙️</div>
                <div class="about-text">
                    <h3>Control Panel</h3>
                    <p>System settings and configuration options.</p>
                    <p>Customize your Windows experience.</p>
                </div>
                <button class="win-button dialog-ok">OK</button>
            </div>
        </div>

        <!-- Find Dialog (initially hidden) -->
        <div class="dialog find-dialog" style="display: none;">
            <div class="title-bar">
                <span>🔍 Find: Files or Folders</span>
                <div class="window-controls">
                    <div class="control-btn close">✕</div>
                </div>
            </div>
            <div class="dialog-content">
                <div class="about-icon">🔍</div>
                <div class="about-text">
                    <h3>Find Files or Folders</h3>
                    <p>Search for files and folders on your computer.</p>
                    <p>Enter a filename or part of a filename to search.</p>
                </div>
                <button class="win-button dialog-ok">OK</button>
            </div>
        </div>

        <!-- Help Dialog (initially hidden) -->
        <div class="dialog help-dialog" style="display: none;">
            <div class="title-bar">
                <span>❓ Windows Help</span>
                <div class="window-controls">
                    <div class="control-btn close">✕</div>
                </div>
            </div>
            <div class="dialog-content">
                <div class="about-icon">❓</div>
                <div class="about-text">
                    <h3>Windows Help</h3>
                    <p>Get help with using Windows 9x features.</p>
                    <p>Browse topics or search for specific help.</p>
                </div>
                <button class="win-button dialog-ok">OK</button>
            </div>
        </div>

        <!-- Run Dialog (initially hidden) -->
        <div class="dialog run-dialog" style="display: none;">
            <div class="title-bar">
                <span>🔄 Run</span>
                <div class="window-controls">
                    <div class="control-btn close">✕</div>
                </div>
            </div>
            <div class="dialog-content">
                <div class="about-icon">🔄</div>
                <div class="run-text">
                    <h3>Run</h3>
                    <p>Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.</p>
                    <label for="run-input">Open:</label>
                    <input type="text" id="run-input" class="run-input" placeholder="Enter program name">
                </div>
                <div class="run-buttons">
                    <button class="win-button run-ok">OK</button>
                    <button class="win-button dialog-ok">Cancel</button>
                </div>
            </div>
        </div>

        <!-- Shutdown Confirmation Dialog (initially hidden) -->
        <div class="dialog shutdown-dialog" style="display: none;">
            <div class="title-bar">
                <span>⏹️ Shut Down Windows</span>
                <div class="window-controls">
                    <div class="control-btn close">✕</div>
                </div>
            </div>
            <div class="dialog-content">
                <div class="about-icon">⚠️</div>
                <div class="about-text">
                    <h3>Shut Down Windows</h3>
                    <p>Are you sure you want to shut down the computer?</p>
                    <p>Any unsaved work will be lost.</p>
                </div>
                <div class="shutdown-buttons">
                    <button class="win-button shutdown-yes">Yes</button>
                    <button class="win-button dialog-ok">No</button>
                </div>
            </div>
        </div>

        <!-- Shutdown Screen (initially hidden) -->
        <div class="shutdown-screen" style="display: none;">
            <div class="shutdown-content">
                <h2>Windows is shutting down...</h2>
                <div class="shutdown-message">It's now safe to turn off your computer.</div>
            </div>
        </div>
    `,
});

// Register the theme with the template engine
templateEngine.registerTheme("windows9x", Windows9xTheme);
