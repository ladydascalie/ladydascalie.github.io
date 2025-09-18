/**
 * Windows 9x Theme JavaScript
 * Interactive desktop experience with window management
 */

document.addEventListener("DOMContentLoaded", function () {
        // Initialize all Windows 9x functionality
        initWindowManagement();
        initDesktopIcons();
        initTaskbar();
        initClock();
        initButtons();
        initFileExplorer();
        initWebRing();
        initDialogs();
        initStartMenu();
        initSoundEffects();
});

/**
 * Window Management System
 */
let activeWindow = null;
let windowZIndex = 100;
let isWindowBeingDragged = false;

function initWindowManagement() {
        const windows = document.querySelectorAll(".window, .dialog");

        windows.forEach((window) => {
                // Make window draggable by title bar
                const titleBar = window.querySelector(".title-bar");
                if (titleBar) {
                        makeDraggable(window, titleBar);
                }

                // Window controls
                const minimizeBtn = window.querySelector(
                        ".control-btn.minimize",
                );
                const maximizeBtn = window.querySelector(
                        ".control-btn.maximize",
                );
                const closeBtn = window.querySelector(".control-btn.close");

                if (minimizeBtn) {
                        minimizeBtn.addEventListener("click", () =>
                                minimizeWindow(window),
                        );
                }

                if (maximizeBtn) {
                        maximizeBtn.addEventListener("click", () =>
                                maximizeWindow(window),
                        );
                }

                if (closeBtn) {
                        closeBtn.addEventListener("click", () =>
                                closeWindow(window),
                        );
                }

                // Focus window on click
                window.addEventListener("mousedown", () => focusWindow(window));

                // Add an explicit resize grip element (so Firefox and other browsers get a visible handle)
                if (!window.querySelector(".resize-grip")) {
                        const grip = document.createElement("div");
                        grip.className = "resize-grip";
                        // append grip so CSS can style it; also provide JS handlers below
                        window.appendChild(grip);

                        // Pointer-based resize handling (works with mouse, touch, pen)
                        let isResizing = false;
                        let startX = 0;
                        let startY = 0;
                        let startW = 0;
                        let startH = 0;
                        let pointerId = null;

                        function onPointerMove(e) {
                                if (!isResizing) return;
                                // Use client coordinates (pointer events)
                                const dx = e.clientX - startX;
                                const dy = e.clientY - startY;

                                // Compute new sizes
                                const newW = Math.max(
                                        parseInt(
                                                getComputedStyle(window)
                                                        .minWidth,
                                        ) || 280,
                                        Math.min(
                                                startW + dx,
                                                globalThis.innerWidth - 16,
                                        ),
                                );
                                const newH = Math.max(
                                        parseInt(
                                                getComputedStyle(window)
                                                        .minHeight,
                                        ) || 120,
                                        Math.min(
                                                startH + dy,
                                                globalThis.innerHeight - 40,
                                        ),
                                );

                                window.style.width = newW + "px";
                                window.style.height = newH + "px";
                        }

                        function onPointerUp(e) {
                                if (!isResizing) return;
                                isResizing = false;
                                try {
                                        if (pointerId != null)
                                                grip.releasePointerCapture(
                                                        pointerId,
                                                );
                                } catch (err) {
                                        // ignore release errors
                                }
                                pointerId = null;
                                document.removeEventListener(
                                        "pointermove",
                                        onPointerMove,
                                );
                                document.removeEventListener(
                                        "pointerup",
                                        onPointerUp,
                                );
                                // Mark resized so autosize doesn't override user intent
                                window.dataset.autoSized = "false";
                        }

                        grip.addEventListener("pointerdown", (e) => {
                                // prevent starting a drag or text selection
                                e.preventDefault();
                                // capture this pointer to the grip so we continue receiving move/up
                                try {
                                        grip.setPointerCapture(e.pointerId);
                                        pointerId = e.pointerId;
                                } catch (err) {
                                        pointerId = null;
                                }

                                isResizing = true;
                                startX = e.clientX;
                                startY = e.clientY;

                                const rect = window.getBoundingClientRect();
                                startW = rect.width;
                                startH = rect.height;

                                // Attach global listeners while resizing
                                document.addEventListener(
                                        "pointermove",
                                        onPointerMove,
                                );
                                document.addEventListener(
                                        "pointerup",
                                        onPointerUp,
                                );
                        });
                }
        });

        // Focus the main profile window by default
        const profileWindow = document.querySelector(".profile-window");
        if (profileWindow) {
                // Autosize the profile window on init (limit applied inside autosize helper)
                if (typeof autosizeWindow === "function") {
                        try {
                                autosizeWindow(profileWindow);
                                // After autosizing, ensure the inner content area is bounded and becomes scrollable if needed
                                if (
                                        typeof ensureContentScrollable ===
                                        "function"
                                ) {
                                        ensureContentScrollable(profileWindow);
                                }
                        } catch (e) {
                                console.warn(
                                        "autosizeWindow failed on init",
                                        e,
                                );
                        }
                }
                focusWindow(profileWindow);
        }
}

function makeDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener("mousedown", (e) => {
                if (e.target.closest(".control-btn")) return;

                isDragging = true;
                isWindowBeingDragged = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = element.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;

                document.addEventListener("mousemove", onMouseMove);
                document.addEventListener("mouseup", onMouseUp);
                e.preventDefault();
        });

        function onMouseMove(e) {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                let newLeft = startLeft + deltaX;
                let newTop = startTop + deltaY;

                // Keep window within viewport bounds
                newLeft = Math.max(
                        0,
                        Math.min(newLeft, window.innerWidth - 200),
                );
                newTop = Math.max(
                        0,
                        Math.min(newTop, window.innerHeight - 100),
                );

                element.style.left = newLeft + "px";
                element.style.top = newTop + "px";
                element.style.transform = "none";
        }

        function onMouseUp() {
                isDragging = false;
                isWindowBeingDragged = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
        }
}

function focusWindow(window) {
        if (window === activeWindow) return;

        // Remove focus from all windows
        document.querySelectorAll(".window, .dialog").forEach((w) => {
                w.classList.remove("focused");
        });

        // Focus the selected window
        window.classList.add("focused");
        window.style.zIndex = ++windowZIndex;
        activeWindow = window;

        // Update taskbar
        updateTaskbarButtons();
}

function minimizeWindow(window) {
        window.style.display = "none";
        updateTaskbarButtons();
        playSystemSound("minimize");
}

function maximizeWindow(window) {
        const isMaximized = window.dataset.maximized === "true";

        if (isMaximized) {
                // Restore window
                window.style.width = window.dataset.originalWidth || "480px";
                window.style.height = window.dataset.originalHeight || "520px";
                window.style.left = window.dataset.originalLeft || "50%";
                window.style.top = window.dataset.originalTop || "50%";
                window.style.transform =
                        window.dataset.originalTransform ||
                        "translate(-50%, -50%)";
                window.dataset.maximized = "false";
        } else {
                // Store original dimensions
                const rect = window.getBoundingClientRect();
                window.dataset.originalWidth =
                        window.style.width || rect.width + "px";
                window.dataset.originalHeight =
                        window.style.height || rect.height + "px";
                window.dataset.originalLeft = window.style.left || "50%";
                window.dataset.originalTop = window.style.top || "50%";
                window.dataset.originalTransform = window.style.transform || "";

                // Maximize window
                window.style.width = "calc(100vw - 10px)";
                window.style.height = "calc(100vh - 40px)";
                window.style.left = "5px";
                window.style.top = "5px";
                window.style.transform = "none";
                window.dataset.maximized = "true";
        }

        playSystemSound("maximize");
}

function closeWindow(window) {
        window.style.display = "none";
        updateTaskbarButtons();
        playSystemSound("close");

        // If closing main window, focus another visible window
        if (window === activeWindow) {
                const visibleWindows = Array.from(
                        document.querySelectorAll(".window, .dialog"),
                ).filter((w) => w.style.display !== "none");

                if (visibleWindows.length > 0) {
                        focusWindow(visibleWindows[0]);
                } else {
                        activeWindow = null;
                }
        }
}

function openWindow(windowClass) {
        const window = document.querySelector(`.${windowClass}`);
        if (window) {
                // Ensure element is visible before measuring
                window.style.display = "block";

                // Autosize the window to fit its content where possible (constrained by CSS max sizes)
                if (typeof autosizeWindow === "function") {
                        autosizeWindow(window);
                        // After autosizing, ensure the inner content area is bounded and becomes scrollable if needed
                        if (typeof ensureContentScrollable === "function") {
                                ensureContentScrollable(window);
                        }
                }

                focusWindow(window);
                updateTaskbarButtons();
                playSystemSound("open");
        }
}

/**
 * Desktop Icons
 */
function initDesktopIcons() {
        const icons = document.querySelectorAll(".icon");

        icons.forEach((icon) => {
                icon.addEventListener("dblclick", () => {
                        const iconType = Array.from(icon.classList).find(
                                (cls) => cls !== "icon",
                        );

                        switch (iconType) {
                                case "my-projects":
                                        openWindow("projects-window");
                                        break;
                                case "network":
                                        openWindow("webring-window");
                                        break;
                                case "my-computer":
                                        showAboutDialog();
                                        break;
                                case "recycle-bin":
                                        showRecycleBinDialog();
                                        break;
                                case "my-documents":
                                        showDocumentsDialog();
                                        break;
                                case "properties":
                                        openWindow("profile-window");
                                        break;
                        }

                        playSystemSound("doubleClick");
                });

                icon.addEventListener("click", () => {
                        // Remove selection from other icons
                        icons.forEach((i) => i.classList.remove("selected"));
                        icon.classList.add("selected");
                });
        });

        // Deselect icons when clicking on desktop
        document.querySelector(".desktop").addEventListener("click", (e) => {
                if (e.target.classList.contains("desktop")) {
                        icons.forEach((i) => i.classList.remove("selected"));
                }
        });
}

/**
 * Taskbar Management
 */
function initTaskbar() {
        const startButton = document.querySelector(".start-button");

        startButton.addEventListener("click", () => {
                showStartMenu();
        });

        // Taskbar button clicks
        document.addEventListener("click", (e) => {
                if (e.target.classList.contains("taskbar-button")) {
                        const windowTitle = e.target.textContent;
                        const window = findWindowByTitle(windowTitle);
                        if (window) {
                                if (window.style.display === "none") {
                                        window.style.display = "block";
                                }
                                focusWindow(window);
                        }
                }
        });
}

function updateTaskbarButtons() {
        const taskbarApps = document.querySelector(".taskbar-apps");
        const visibleWindows = Array.from(
                document.querySelectorAll(".window"),
        ).filter((w) => w.style.display !== "none");

        taskbarApps.innerHTML = "";

        visibleWindows.forEach((window) => {
                const titleText =
                        window.querySelector(".title-bar span")?.textContent ||
                        "Window";
                const button = document.createElement("div");
                button.className = "taskbar-button";
                button.textContent = titleText;

                if (window === activeWindow) {
                        button.classList.add("active");
                }

                button.addEventListener("click", () => {
                        if (
                                window === activeWindow &&
                                window.style.display !== "none"
                        ) {
                                minimizeWindow(window);
                        } else {
                                if (window.style.display === "none") {
                                        window.style.display = "block";
                                }
                                focusWindow(window);
                        }
                });

                taskbarApps.appendChild(button);
        });
}

function findWindowByTitle(title) {
        return Array.from(document.querySelectorAll(".window")).find((w) =>
                w.querySelector(".title-bar span")?.textContent.includes(title),
        );
}

function showStartMenu() {
        const startMenu = document.getElementById("startMenu");
        const startButton = document.querySelector(".start-button");

        if (startMenu.style.display === "block") {
                hideStartMenu();
                return;
        }

        startMenu.style.display = "block";
        startButton.style.border = "2px inset var(--win-gray)";

        // Close start menu when clicking elsewhere
        setTimeout(() => {
                document.addEventListener("click", function closeStartMenu(e) {
                        if (
                                !startMenu.contains(e.target) &&
                                !startButton.contains(e.target)
                        ) {
                                hideStartMenu();
                                document.removeEventListener(
                                        "click",
                                        closeStartMenu,
                                );
                        }
                });
        }, 100);

        playSystemSound("menuOpen");
}

function hideStartMenu() {
        const startMenu = document.getElementById("startMenu");
        const startButton = document.querySelector(".start-button");
        const submenus = document.querySelectorAll(".start-submenu");

        startMenu.style.display = "none";
        startButton.style.border = "2px outset var(--win-gray)";

        // Hide all submenus
        submenus.forEach((submenu) => {
                submenu.style.display = "none";
        });
}

/**
 * Start Menu Item Handling
 */
function initStartMenu() {
        const startMenuItems = document.querySelectorAll(".start-menu-item");

        startMenuItems.forEach((item) => {
                item.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const action = item.dataset.action;
                        handleStartMenuItem(action);
                });

                item.addEventListener("mouseenter", () => {
                        const action = item.dataset.action;
                        if (action === "programs") {
                                showSubmenu("programsSubmenu", item);
                        } else {
                                hideAllSubmenus();
                        }
                });
        });
}

function handleStartMenuItem(action) {
        switch (action) {
                case "programs":
                        // Handled by hover
                        break;
                case "my-projects":
                        hideStartMenu();
                        openWindow("projects-window");
                        break;
                case "web-ring":
                        hideStartMenu();
                        openWindow("webring-window");
                        break;
                case "about":
                        hideStartMenu();
                        showAboutDialog();
                        break;
                case "documents":
                        hideStartMenu();
                        showDocumentsDialog();
                        break;
                case "settings":
                        hideStartMenu();
                        showControlPanelDialog();
                        break;
                case "find":
                        hideStartMenu();
                        showFindDialog();
                        break;
                case "help":
                        hideStartMenu();
                        showHelpDialog();
                        break;
                case "run":
                        hideStartMenu();
                        showRunDialog();
                        break;
                case "shutdown":
                        hideStartMenu();
                        showShutdownDialog();
                        break;
        }

        playSystemSound("menuOpen");
}

function showSubmenu(submenuId, parentItem) {
        hideAllSubmenus();

        const submenu = document.getElementById(submenuId);
        const parentRect = parentItem.getBoundingClientRect();

        submenu.style.display = "block";
        submenu.style.bottom = window.innerHeight - parentRect.bottom + "px";
        submenu.style.left = parentRect.right + "px";
}

function hideAllSubmenus() {
        const submenus = document.querySelectorAll(".start-submenu");
        submenus.forEach((submenu) => {
                submenu.style.display = "none";
        });
}

/**
 * Clock Updates
 */
function initClock() {
        function updateClock() {
                const now = new Date();
                const time = now.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                });
                const clockElement = document.getElementById("clock");
                if (clockElement) {
                        clockElement.textContent = time;
                }
        }

        setInterval(updateClock, 1000);
        updateClock();
}

/**
 * Button Actions
 */
function initButtons() {
        // Centralized handler for button actions so we can reuse it for both direct and delegated events.
        function handleButtonAction(button) {
                if (!button) return;
                const action =
                        button.dataset.action ||
                        button.textContent.toLowerCase();

                switch (action) {
                        case "properties": {
                                const profileWindow =
                                        document.querySelector(
                                                ".profile-window",
                                        );
                                if (
                                        profileWindow &&
                                        profileWindow.style.display === "none"
                                ) {
                                        openWindow("profile-window");
                                } else if (profileWindow) {
                                        focusWindow(profileWindow);
                                }
                                break;
                        }
                        case "my projects":
                                openWindow("projects-window");
                                break;
                        case "web ring":
                                openWindow("webring-window");
                                break;
                        case "about":
                                showAboutDialog();
                                break;
                        case "open source":
                                window.location.href =
                                        "https://github.com/ladydascalie";
                                break;
                        case "random":
                                randomWebringSite();
                                break;
                }

                playSystemSound("buttonClick");
        }

        // Attach direct listeners to currently-rendered buttons (preserve original behavior).
        const buttons = document.querySelectorAll(".win-button, .button");
        buttons.forEach((button) => {
                // stopPropagation prevents the delegated handler from firing the same action twice
                button.addEventListener("click", (e) => {
                        handleButtonAction(button);
                        e.stopPropagation();
                });
        });

        // Delegated click handler at document level so buttons still work if re-rendered or replaced.
        // This ensures dynamically added buttons are handled without re-running initButtons.
        document.addEventListener("click", (e) => {
                try {
                        const btn =
                                e.target &&
                                e.target.closest &&
                                e.target.closest(".win-button, .button");
                        if (!btn) return;
                        // If the direct handler called stopPropagation, we won't reach here for the same event.
                        handleButtonAction(btn);
                } catch (err) {
                        // Non-fatal: ignore delegation errors
                }
        });
}

/**
 * File Explorer
 */
function initFileExplorer() {
        const fileItems = document.querySelectorAll(".file-item");

        fileItems.forEach((item) => {
                item.addEventListener("dblclick", () => {
                        const url = item.dataset.url;
                        if (url) {
                                window.location.href = url;
                                playSystemSound("fileOpen");
                        }
                });

                item.addEventListener("click", () => {
                        // Remove selection from other files
                        fileItems.forEach((f) =>
                                f.classList.remove("selected"),
                        );
                        item.classList.add("selected");
                });
        });
}

/**
 * Web Ring Navigation
 */
function initWebRing() {
        const webringLinks = document.querySelectorAll(".webring-link a");

        webringLinks.forEach((link) => {
                link.addEventListener("click", (e) => {
                        e.preventDefault();
                        window.location.href = link.href;
                        playSystemSound("linkClick");
                });
        });
}

function randomWebringSite() {
        const links = Array.from(document.querySelectorAll(".webring-link a"));
        if (links.length > 0) {
                const randomLink =
                        links[Math.floor(Math.random() * links.length)];
                window.location.href = randomLink.href;
                playSystemSound("linkClick");
        }
}

/**
 * Dialog Management
 */
function initDialogs() {
        // About dialog
        const aboutOkButton = document.querySelector(".about-ok");
        if (aboutOkButton) {
                aboutOkButton.addEventListener("click", () => {
                        closeWindow(document.querySelector(".about-dialog"));
                });
        }

        const dialogOkButtons = document.querySelectorAll(".dialog-ok");
        dialogOkButtons.forEach((button) => {
                button.addEventListener("click", () => {
                        const dialog = button.closest(".dialog");
                        if (dialog) {
                                closeWindow(dialog);
                        }
                });
        });

        const runOkButton = document.querySelector(".run-ok");
        if (runOkButton) {
                runOkButton.addEventListener("click", () => {
                        const input = document.getElementById("run-input");
                        const program = input ? input.value.trim() : "";
                        if (program) {
                                showErrorDialog(
                                        `Running: ${program}\n\nProgram not found.`,
                                );
                        }
                        closeWindow(document.querySelector(".run-dialog"));
                });
        }

        const shutdownYesButton = document.querySelector(".shutdown-yes");
        if (shutdownYesButton) {
                shutdownYesButton.addEventListener("click", () => {
                        closeWindow(document.querySelector(".shutdown-dialog"));
                        performShutdown();
                });
        }
}
function showAboutDialog() {
        const aboutDialog = document.querySelector(".about-dialog");
        if (aboutDialog) {
                aboutDialog.style.display = "block";
                focusWindow(aboutDialog);
                playSystemSound("dialog");
        }
}

function showRecycleBinDialog() {
        showDocumentsDialog(); // Reuse documents dialog for recycle bin
        playSystemSound("dialog");
}

function showErrorDialog(message) {
        // Create a temporary error dialog
        const errorDialog = document.createElement("div");
        errorDialog.className = "dialog";
        errorDialog.style.cssText = "display: block; z-index: 10000;";
        errorDialog.innerHTML = `
                <div class="title-bar">
                        <span>❌ Windows 9x Error</span>
                        <div class="window-controls">
                                <div class="control-btn close">✕</div>
                        </div>
                </div>
                <div class="dialog-content">
                        <div class="about-icon">❌</div>
                        <div class="about-text">
                                <h3>Error</h3>
                                <p>${message}</p>
                        </div>
                        <button class="win-button dialog-ok">OK</button>
                </div>
        `;

        document.body.appendChild(errorDialog);
        focusWindow(errorDialog);

        // Add event listeners
        const closeBtn = errorDialog.querySelector(".control-btn.close");
        const okBtn = errorDialog.querySelector(".dialog-ok");

        const closeDialog = () => {
                errorDialog.remove();
        };

        closeBtn.addEventListener("click", closeDialog);
        okBtn.addEventListener("click", closeDialog);

        playSystemSound("error");
}

/**
 * Sound Effects (simulated)
 */
function initSoundEffects() {
        // Create audio context for system sounds
        let audioContext;

        try {
                audioContext = new (window.AudioContext ||
                        window.webkitAudioContext)();
        } catch (e) {
                console.log("Web Audio API not supported");
                return;
        }

        // System sound effects
        window.playWindowsSound = function (
                frequency = 800,
                duration = 100,
                type = "sine",
        ) {
                if (!audioContext) return;

                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = frequency;
                oscillator.type = type;

                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(
                        0.01,
                        audioContext.currentTime + duration / 1000,
                );

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration / 1000);
        };
}

function playSystemSound(action) {
        if (typeof window.playWindowsSound !== "function") return;

        switch (action) {
                case "open":
                        window.playWindowsSound(523, 100); // C note
                        break;
                case "close":
                        window.playWindowsSound(392, 100); // G note
                        break;
                case "minimize":
                        window.playWindowsSound(294, 150); // D note
                        break;
                case "maximize":
                        window.playWindowsSound(659, 150); // E note
                        break;
                case "buttonClick":
                        window.playWindowsSound(800, 50);
                        break;
                case "doubleClick":
                        window.playWindowsSound(1000, 50);
                        setTimeout(
                                () => window.playWindowsSound(1200, 50),
                                100,
                        );
                        break;
                case "menuOpen":
                        window.playWindowsSound(440, 80); // A note
                        break;
                case "dialog":
                        window.playWindowsSound(523, 200); // C note, longer
                        break;
                case "error":
                        window.playWindowsSound(200, 300); // Low error sound
                        break;
                case "fileOpen":
                        window.playWindowsSound(659, 120); // E note
                        break;
                case "linkClick":
                        window.playWindowsSound(880, 80); // A note, higher
                        break;
                case "shutdown":
                        // Windows shutdown sound sequence
                        window.playWindowsSound(523, 200); // C note
                        setTimeout(
                                () => window.playWindowsSound(392, 300),
                                200,
                        ); // G note
                        setTimeout(
                                () => window.playWindowsSound(294, 400),
                                500,
                        ); // D note
                        break;
        }
}

/**
 * Keyboard Shortcuts
 */
let currentMenuIndex = -1;
let currentSubmenuIndex = -1;

document.addEventListener("keydown", (e) => {
        // Windows key or Ctrl+Esc - Toggle Start Menu
        if (
                e.code === "MetaLeft" ||
                e.code === "MetaRight" ||
                (e.ctrlKey && e.code === "Escape")
        ) {
                e.preventDefault();
                const startMenu = document.getElementById("startMenu");
                if (startMenu.style.display === "block") {
                        hideStartMenu();
                } else {
                        showStartMenu();
                        currentMenuIndex = 0;
                        highlightMenuItem(0);
                }
                return;
        }

        // Handle start menu navigation
        const startMenu = document.getElementById("startMenu");
        if (startMenu && startMenu.style.display === "block") {
                handleStartMenuKeyboard(e);
                return;
        }

        // Alt + Tab (simplified)
        if (e.altKey && e.code === "Tab") {
                e.preventDefault();
                const visibleWindows = Array.from(
                        document.querySelectorAll(".window"),
                ).filter((w) => w.style.display !== "none");

                if (visibleWindows.length > 1) {
                        const currentIndex =
                                visibleWindows.indexOf(activeWindow);
                        const nextIndex =
                                (currentIndex + 1) % visibleWindows.length;
                        focusWindow(visibleWindows[nextIndex]);
                }
        }

        // F5 - Refresh
        if (e.code === "F5") {
                e.preventDefault();
                location.reload();
        }

        // ESC - Close active dialog
        if (e.code === "Escape") {
                const activeDialog = document.querySelector(
                        ".dialog:not([style*='display: none'])",
                );
                if (activeDialog) {
                        closeWindow(activeDialog);
                }
        }
});

function handleStartMenuKeyboard(e) {
        e.preventDefault();
        const menuItems = Array.from(
                document.querySelectorAll(
                        ".start-menu-item:not(.start-menu-separator)",
                ),
        );

        switch (e.code) {
                case "Escape":
                        hideStartMenu();
                        currentMenuIndex = -1;
                        break;

                case "ArrowUp":
                        if (currentMenuIndex > 0) {
                                currentMenuIndex--;
                                highlightMenuItem(currentMenuIndex);
                        }
                        break;

                case "ArrowDown":
                        if (currentMenuIndex < menuItems.length - 1) {
                                currentMenuIndex++;
                                highlightMenuItem(currentMenuIndex);
                        }
                        break;

                case "ArrowRight":
                        if (currentMenuIndex >= 0) {
                                const currentItem = menuItems[currentMenuIndex];
                                const action = currentItem.dataset.action;
                                if (action === "programs") {
                                        showSubmenu(
                                                "programsSubmenu",
                                                currentItem,
                                        );
                                        currentSubmenuIndex = 0;
                                        highlightSubmenuItem(0);
                                }
                        }
                        break;

                case "Enter":
                case "Space":
                        if (currentMenuIndex >= 0) {
                                const currentItem = menuItems[currentMenuIndex];
                                const action = currentItem.dataset.action;
                                handleStartMenuItem(action);
                        }
                        break;
        }
}

function highlightMenuItem(index) {
        // Remove previous highlight
        document.querySelectorAll(".start-menu-item").forEach((item) => {
                item.classList.remove("keyboard-selected");
        });

        // Add highlight to current item
        const menuItems = Array.from(
                document.querySelectorAll(
                        ".start-menu-item:not(.start-menu-separator)",
                ),
        );
        if (menuItems[index]) {
                menuItems[index].classList.add("keyboard-selected");
        }
}

function highlightSubmenuItem(index) {
        // Remove previous highlight
        document.querySelectorAll(".start-submenu .start-menu-item").forEach(
                (item) => {
                        item.classList.remove("keyboard-selected");
                },
        );

        // Add highlight to current submenu item
        const submenuItems = Array.from(
                document.querySelectorAll(".start-submenu .start-menu-item"),
        );
        if (submenuItems[index]) {
                submenuItems[index].classList.add("keyboard-selected");
        }
}

/**
 * Context Menus (Right-click)
 */
document.addEventListener("contextmenu", (e) => {
        e.preventDefault();

        const contextMenu = createContextMenu(e.pageX, e.pageY);
        document.body.appendChild(contextMenu);

        // Remove context menu on click elsewhere
        setTimeout(() => {
                document.addEventListener("click", function removeMenu() {
                        if (contextMenu.parentNode) {
                                contextMenu.remove();
                        }
                        document.removeEventListener("click", removeMenu);
                });
        }, 100);
});

function createContextMenu(x, y) {
        const menu = document.createElement("div");
        menu.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                background: var(--win-gray);
                border: 2px outset var(--win-gray);
                box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
                font-size: 11px;
                z-index: 10000;
                min-width: 120px;
        `;

        const menuItems = [
                { text: "Refresh", action: () => location.reload() },
                { text: "Properties", action: showAboutDialog },
        ];

        menuItems.forEach((item, index) => {
                const menuItem = document.createElement("div");
                menuItem.textContent = item.text;
                menuItem.style.cssText = `
                        padding: 4px 12px;
                        cursor: pointer;
                        border-bottom: ${index < menuItems.length - 1 ? "1px solid var(--win-dark-gray)" : "none"};
                `;

                menuItem.addEventListener("mouseenter", () => {
                        menuItem.style.background = "var(--win-blue)";
                        menuItem.style.color = "white";
                });

                menuItem.addEventListener("mouseleave", () => {
                        menuItem.style.background = "";
                        menuItem.style.color = "";
                });

                menuItem.addEventListener("click", () => {
                        item.action();
                        menu.remove();
                        playSystemSound("menuOpen");
                });

                menu.appendChild(menuItem);
        });

        return menu;
}

/**
 * Window Resize Handlers
 */
/**
 * Window Resize Handlers + autosize helper
 *
 * - Keeps windows inside the viewport on resize
 * - Re-applies autosizing for windows that were auto-sized originally
 */
function autosizeWindow(winEl) {
        if (!winEl) return;
        const content = winEl.querySelector(".window-content, .dialog-content");
        if (!content) return;

        // Temporarily allow natural size to measure content
        winEl.style.width = "auto";
        winEl.style.height = "auto";

        // Measure content size
        const contentRect = content.getBoundingClientRect();
        const contentHeight = content.scrollHeight || contentRect.height;
        const titleBar = winEl.querySelector(".title-bar");
        const titleH = titleBar ? titleBar.getBoundingClientRect().height : 20;

        // Add padding allowances (borders, padding, etc.)
        const horizPadding = 24; // left+right padding/borders
        const maxExtraVertical = 10; // maximum extra vertical space beyond content (px)

        const computed = getComputedStyle(winEl);
        const minW = parseInt(computed.minWidth) || 280;
        const minH = parseInt(computed.minHeight) || 120;
        const maxW = Math.max(window.innerWidth - 20, minW);
        const maxH = Math.max(window.innerHeight - 60, minH);

        // Default desired width/height based on content
        let desiredWidth = Math.min(
                Math.max(content.scrollWidth + horizPadding, minW),
                maxW,
        );

        let desiredHeight = Math.min(
                Math.max(contentHeight + titleH + maxExtraVertical, minH),
                maxH,
        );

        // Special-case: profile/properties window should start centered, tall and thin
        if (winEl.classList && winEl.classList.contains("profile-window")) {
                // thin but not narrower than minW, and never wider than maxW
                const thinWidth = Math.min(420, maxW);
                desiredWidth = Math.max(minW, thinWidth);

                // tall: prefer at least 360px or content height + slack, but don't exceed viewport
                const preferTall = 360;
                desiredHeight = Math.min(
                        maxH,
                        Math.max(
                                contentHeight + titleH + maxExtraVertical,
                                preferTall,
                        ),
                );
        }

        // Apply computed sizes
        winEl.style.width = desiredWidth + "px";
        winEl.style.height = desiredHeight + "px";

        // Center if it was previously centered via transform or has no explicit left/top
        if (!winEl.style.left || winEl.style.left.includes("%")) {
                winEl.style.left =
                        Math.max(10, (window.innerWidth - desiredWidth) / 2) +
                        "px";
                winEl.style.top =
                        Math.max(10, (window.innerHeight - desiredHeight) / 2) +
                        "px";
                winEl.style.transform = "none";
        }

        // Mark that this window was auto-sized so we can re-apply on viewport changes
        winEl.dataset.autoSized = "true";
}

/**
 * Ensure the inner content area of a window is bounded and scrollable when the outer
 * window is constrained by the viewport. This computes a safe max-height for the
 * `.window-content` / `.dialog-content` area and toggles native overflow accordingly.
 *
 * Enhancements:
 * - Observes content size/DOM changes (MutationObserver / ResizeObserver) and image loads so
 *   the scrollbar state updates automatically when content changes.
 * - Debounces rapid updates to avoid layout thrashing.
 */
function ensureContentScrollable(winEl) {
        if (!winEl) return;
        const content = winEl.querySelector(".window-content, .dialog-content");
        if (!content) return;

        // Debounced updater to avoid repeated layout thrash
        function doUpdate() {
                try {
                        const computed = getComputedStyle(winEl);

                        const titleBar = winEl.querySelector(".title-bar");
                        const titleH = titleBar
                                ? titleBar.getBoundingClientRect().height
                                : 0;

                        const padTop = parseFloat(computed.paddingTop) || 0;
                        const padBottom =
                                parseFloat(computed.paddingBottom) || 0;
                        const borderTop =
                                parseFloat(computed.borderTopWidth) || 0;
                        const borderBottom =
                                parseFloat(computed.borderBottomWidth) || 0;

                        // Small slack so the content isn't notched tight against chrome
                        const slack = 8;

                        // Compute available inner content height and clamp to a minimum for usability
                        const innerMax = Math.max(
                                80,
                                Math.round(
                                        winEl.clientHeight -
                                                titleH -
                                                padTop -
                                                padBottom -
                                                borderTop -
                                                borderBottom -
                                                slack,
                                ),
                        );

                        if ((content.scrollHeight || 0) > innerMax + 2) {
                                content.style.maxHeight = innerMax + "px";
                                content.style.overflowY = "auto";
                                content.style.overflowX = "hidden";
                                content.classList.add("scrollable");
                        } else {
                                // Clear any inline constraints if content fits naturally
                                content.style.maxHeight = "";
                                content.style.overflowY = "";
                                content.style.overflowX = "";
                                content.classList.remove("scrollable");
                        }
                } catch (e) {
                        // Non-fatal: if measurement fails, fall back to CSS defaults
                }
        }

        // Create a debounced wrapper (store per-content so multiple calls reuse same timer)
        if (!content.__ensureDebounce) {
                content.__ensureDebounce = {
                        timer: null,
                        run() {
                                if (content.__ensureDebounce.timer) {
                                        clearTimeout(
                                                content.__ensureDebounce.timer,
                                        );
                                }
                                content.__ensureDebounce.timer = setTimeout(
                                        () => {
                                                content.__ensureDebounce.timer =
                                                        null;
                                                doUpdate();
                                        },
                                        60,
                                ); // small debounce
                        },
                };
        }

        // Run immediately for current state
        content.__ensureDebounce.run();

        // Set up observers/listeners once per content element
        if (!content.__ensureObserversSetup) {
                // ResizeObserver to detect layout/content size changes
                try {
                        if (typeof ResizeObserver !== "undefined") {
                                content.__ensureResizeObserver =
                                        new ResizeObserver(() => {
                                                content.__ensureDebounce.run();
                                        });
                                content.__ensureResizeObserver.observe(content);
                                // Also observe the host window element (title/menu changes affect available space)
                                try {
                                        content.__ensureResizeObserver.observe(
                                                winEl,
                                        );
                                } catch (e) {
                                        // ignore if observing winEl fails in some browsers
                                }
                        }
                } catch (e) {
                        // ignore if ResizeObserver not available
                }

                // MutationObserver for structural/content changes (text nodes, added/removed nodes)
                try {
                        content.__ensureMutationObserver = new MutationObserver(
                                () => {
                                        content.__ensureDebounce.run();
                                        // Re-attach image load listeners for dynamically added images
                                        attachImageLoadListeners();
                                },
                        );
                        content.__ensureMutationObserver.observe(content, {
                                childList: true,
                                subtree: true,
                                characterData: true,
                        });
                } catch (e) {
                        // ignore if MutationObserver not available
                }

                // Window resize should also trigger update
                content.__ensureWindowListener = () =>
                        content.__ensureDebounce.run();
                window.addEventListener(
                        "resize",
                        content.__ensureWindowListener,
                );

                // Image load handling: images may change the content height after load.
                function attachImageLoadListeners() {
                        const imgs = Array.from(
                                content.querySelectorAll("img"),
                        );
                        imgs.forEach((img) => {
                                if (img.__ensureHasLoad) return;
                                img.__ensureHasLoad = true;
                                // If already complete, trigger update; otherwise listen for load/error
                                if (img.complete) {
                                        content.__ensureDebounce.run();
                                } else {
                                        img.addEventListener(
                                                "load",
                                                () => {
                                                        content.__ensureDebounce.run();
                                                },
                                                { once: true },
                                        );
                                        img.addEventListener(
                                                "error",
                                                () => {
                                                        content.__ensureDebounce.run();
                                                },
                                                { once: true },
                                        );
                                }
                        });
                }

                // Initial attach of image listeners
                attachImageLoadListeners();

                // Mark setup done so we don't rebind observers repeatedly
                content.__ensureObserversSetup = true;

                // Provide a cleanup handle if needed later (e.g., when removing the window)
                content.__ensureCleanup = function () {
                        try {
                                if (content.__ensureResizeObserver) {
                                        content.__ensureResizeObserver.disconnect();
                                        content.__ensureResizeObserver = null;
                                }
                                if (content.__ensureMutationObserver) {
                                        content.__ensureMutationObserver.disconnect();
                                        content.__ensureMutationObserver = null;
                                }
                                if (content.__ensureWindowListener) {
                                        window.removeEventListener(
                                                "resize",
                                                content.__ensureWindowListener,
                                        );
                                        content.__ensureWindowListener = null;
                                }
                        } catch (e) {
                                // ignore cleanup errors
                        }
                        content.__ensureObserversSetup = false;
                };
        }

        // Return a small API for tests or cleanup if caller wants it
        return {
                element: content,
                trigger: () =>
                        content.__ensureDebounce &&
                        content.__ensureDebounce.run(),
                cleanup: () =>
                        content.__ensureCleanup && content.__ensureCleanup(),
        };
}

/* Firefox custom scrollbar helpers
 *
 * This implements a lightweight, JS-driven overlay scrollbar for key scrollable elements
 * when the site is viewed in Firefox (which ignores ::-webkit-scrollbar).
 * It attaches a track and thumb, wires wheel and drag interactions, and updates as content changes.
 */
function initFirefoxScrollbars() {
        // Only initialize in Firefox to avoid duplicating native scrollbars elsewhere
        const ua =
                navigator && navigator.userAgent
                        ? navigator.userAgent.toLowerCase()
                        : "";
        if (!ua.includes("firefox")) return;

        const selectors = [
                ".window-content",
                ".about-text",
                ".file-list",
                ".webring-content",
        ];

        // Create scrollbars for existing elements
        selectors.forEach((sel) => {
                document.querySelectorAll(sel).forEach((el) => {
                        createFxScrollbarForElement(el);
                });
        });

        // Watch for dynamically added elements that match the selectors
        const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((node) => {
                                if (!(node instanceof HTMLElement)) return;
                                selectors.forEach((sel) => {
                                        if (node.matches && node.matches(sel)) {
                                                createFxScrollbarForElement(
                                                        node,
                                                );
                                        } else if (node.querySelector) {
                                                node.querySelectorAll(
                                                        sel,
                                                ).forEach((n) =>
                                                        createFxScrollbarForElement(
                                                                n,
                                                        ),
                                                );
                                        }
                                });
                        });
                });
        });

        observer.observe(document.body, { childList: true, subtree: true });
}

function createFxScrollbarForElement(el) {
        if (!el || el.dataset.fxScroll === "true") return;
        el.dataset.fxScroll = "true";

        // Ensure the element is positioned so we can overlay track inside it
        const computed = getComputedStyle(el);
        if (computed.position === "static") {
                el.style.position = "relative";
        }

        // Create track and thumb
        const track = document.createElement("div");
        track.className = "fx-scroll-track";

        // Force inline sizing and use !important for width where necessary to override any external UA/skin rules
        track.style.setProperty("width", "18px", "important");
        track.style.position = "absolute";
        track.style.right = "6px";
        track.style.top = "6px";
        // Compute a deterministic height for the track based on the container height minus reserved footer area
        // so the track doesn't accidentally expand to the whole container or end up with unexpected dimensions.
        try {
                const reservedBottom = 52; // spinner/footer/grip reserved area
                // el.clientHeight is the visible content height of the scroll container
                const computedTrackHeight = Math.max(
                        24,
                        Math.round(
                                Math.max(0, el.clientHeight - reservedBottom),
                        ),
                );
                track.style.height = computedTrackHeight + "px";
                // When height is explicitly set we don't rely on 'bottom' which can sometimes produce layout oddities
                track.style.bottom = "auto";
        } catch (e) {
                // fallback: keep previous bottom approach if measurement fails
                track.style.bottom = "52px";
        }

        track.style.boxSizing = "border-box";
        track.style.zIndex = "60";
        track.style.display = "flex";
        track.style.alignItems = "flex-start";
        track.style.justifyContent = "center";
        track.style.padding = "2px 0";
        // make track interactive for pointer events (thumb dragging, clicks)
        track.style.pointerEvents = "auto";
        // Add a small safeguard attribute so we can identify injected tracks
        track.dataset.fxInjected = "true";

        const thumb = document.createElement("div");
        thumb.className = "fx-scroll-thumb";

        // Ensure the thumb has predictable inline sizing and transform origin for drag math
        thumb.style.width = "100%";
        thumb.style.display = "block";
        thumb.style.transform = "translateY(0px)";
        thumb.style.willChange = "transform";

        // Try to set an initial thumb height proportional to the current visible/content ratio so the thumb is visible immediately
        try {
                const trackH =
                        parseInt(track.style.height, 10) ||
                        Math.max(24, Math.round(el.clientHeight - 8));
                const visibleH = el.clientHeight || 24;
                const contentH = Math.max(
                        el.scrollHeight || visibleH,
                        visibleH,
                );
                const ratio = Math.min(1, Math.max(visibleH / contentH, 0.05));
                const initialThumbH = Math.max(18, Math.round(trackH * ratio));
                thumb.style.height = initialThumbH + "px";
        } catch (e) {
                // fallback
                thumb.style.height = "24px";
                function createFxScrollbarForElement(el) {
                        // Robust overlay scrollbar for Firefox-like browsers
                        if (!el) return;

                        // Avoid re-initializing
                        if (el.dataset.fxScroll === "initialized") return;

                        // If there's no vertical overflow, don't create overlay
                        const visibleH = el.clientHeight;
                        const contentH = el.scrollHeight;
                        if (contentH <= visibleH + 2) {
                                // no overflow -> native scrollbar sufficient
                                return;
                        }

                        el.dataset.fxScroll = "initialized";

                        // Ensure container is positioned for absolutely-positioned overlay
                        const comp = getComputedStyle(el);
                        if (comp.position === "static") {
                                el.style.position = "relative";
                        }

                        // Create track + thumb
                        const track = document.createElement("div");
                        track.className = "fx-scroll-track";
                        track.dataset.fxInjected = "true";
                        // Inline styles to avoid UA/skin interference
                        track.style.position = "absolute";
                        track.style.right = "6px";
                        track.style.boxSizing = "border-box";
                        track.style.width = "18px";
                        track.style.padding = "2px 0";
                        track.style.zIndex = "60";
                        track.style.pointerEvents = "auto";

                        const thumb = document.createElement("div");
                        thumb.className = "fx-scroll-thumb";
                        thumb.style.width = "100%";
                        thumb.style.display = "block";
                        thumb.style.transform = "translateY(0px)";
                        thumb.style.willChange = "transform";
                        thumb.style.cursor = "pointer";
                        thumb.style.background =
                                "linear-gradient(to bottom, #d0d0d0, #808080)";
                        thumb.style.border = "2px inset #808080";
                        thumb.style.boxShadow = "none";

                        track.appendChild(thumb);
                        el.appendChild(track);

                        // Layout the track with a deterministic height based on container, leaving room for reserved footer/grip
                        const RESERVED_BOTTOM = 52; // px reserved for footer / grip
                        function layoutTrack() {
                                const visible = el.clientHeight || 0;
                                const h = Math.max(
                                        24,
                                        Math.round(
                                                Math.max(
                                                        0,
                                                        visible -
                                                                RESERVED_BOTTOM -
                                                                6,
                                                ),
                                        ),
                                );
                                track.style.height = h + "px";
                                // place track a small inset from top
                                track.style.top =
                                        Math.max(6, el.clientTop || 6) + "px";
                        }

                        function updateThumb() {
                                const visible = el.clientHeight || 0;
                                const content = el.scrollHeight || visible;

                                // If content no longer overflows, remove track and allow recreation later
                                if (content <= visible + 2) {
                                        try {
                                                track.remove();
                                        } catch (e) {}
                                        el.dataset.fxScroll = "false";
                                        return;
                                }

                                layoutTrack();

                                const trackH = Math.max(
                                        24,
                                        track.clientHeight ||
                                                Math.max(
                                                        24,
                                                        visible -
                                                                8 -
                                                                RESERVED_BOTTOM,
                                                ),
                                );
                                const ratio = Math.max(
                                        0.05,
                                        Math.min(
                                                1,
                                                visible /
                                                        Math.max(
                                                                content,
                                                                visible,
                                                        ),
                                        ),
                                );
                                const thumbH = Math.max(
                                        18,
                                        Math.round(trackH * ratio),
                                );
                                thumb.style.height = thumbH + "px";

                                const maxScroll = Math.max(
                                        0,
                                        content - visible,
                                );
                                const scrollRatio =
                                        maxScroll > 0
                                                ? el.scrollTop / maxScroll
                                                : 0;
                                const maxThumbTop = Math.max(
                                        0,
                                        trackH - thumbH,
                                );
                                const thumbTop = Math.round(
                                        scrollRatio * maxThumbTop,
                                );
                                thumb.style.transform =
                                        "translateY(" + thumbTop + "px)";

                                // update ARIA
                                try {
                                        thumb.setAttribute(
                                                "aria-valuenow",
                                                String(
                                                        Math.round(
                                                                scrollRatio *
                                                                        100,
                                                        ),
                                                ),
                                        );
                                } catch (e) {}
                        }

                        // Initialize
                        layoutTrack();
                        requestAnimationFrame(() => setTimeout(updateThumb, 0));

                        // Sync events
                        const onScroll = () => updateThumb();
                        const onResize = () => {
                                layoutTrack();
                                updateThumb();
                        };
                        el.addEventListener("scroll", onScroll);
                        window.addEventListener("resize", onResize);

                        // Dragging
                        let dragging = false;
                        let startY = 0;
                        let startTop = 0;

                        thumb.addEventListener("pointerdown", (e) => {
                                e.preventDefault();
                                dragging = true;
                                startY = e.clientY;
                                const m = (thumb.style.transform || "").match(
                                        /translateY\(([-\d.]+)px\)/,
                                );
                                startTop = m ? parseFloat(m[1]) : 0;
                                try {
                                        thumb.setPointerCapture &&
                                                thumb.setPointerCapture(
                                                        e.pointerId,
                                                );
                                } catch (err) {}
                        });

                        function onPointerMove(e) {
                                if (!dragging) return;
                                e.preventDefault();
                                const dy = e.clientY - startY;
                                const trackH = Math.max(
                                        24,
                                        track.clientHeight || 24,
                                );
                                const thumbH =
                                        parseFloat(thumb.style.height) || 24;
                                const maxTop = Math.max(0, trackH - thumbH);
                                const newTop = Math.min(
                                        Math.max(0, startTop + dy),
                                        maxTop,
                                );
                                const ratio = maxTop > 0 ? newTop / maxTop : 0;
                                el.scrollTop = Math.round(
                                        ratio *
                                                (el.scrollHeight -
                                                        el.clientHeight),
                                );
                                thumb.style.transform =
                                        "translateY(" + newTop + "px)";
                        }

                        function onPointerUp(e) {
                                if (!dragging) return;
                                dragging = false;
                                try {
                                        thumb.releasePointerCapture &&
                                                thumb.releasePointerCapture(
                                                        e.pointerId,
                                                );
                                } catch (err) {}
                        }

                        document.addEventListener("pointermove", onPointerMove);
                        document.addEventListener("pointerup", onPointerUp);

                        // Track click -> page-wise scroll
                        track.addEventListener("click", (e) => {
                                if (e.target === thumb) return;
                                const rect = track.getBoundingClientRect();
                                const clickY = e.clientY - rect.top;
                                const thumbRect = thumb.getBoundingClientRect();
                                const thumbTop = thumbRect.top - rect.top;

                                if (clickY < thumbTop)
                                        el.scrollTop = Math.max(
                                                0,
                                                el.scrollTop -
                                                        el.clientHeight +
                                                        20,
                                        );
                                else
                                        el.scrollTop = Math.min(
                                                el.scrollHeight,
                                                el.scrollTop +
                                                        el.clientHeight -
                                                        20,
                                        );
                        });

                        // Observe content changes
                        if (typeof ResizeObserver !== "undefined") {
                                const ro = new ResizeObserver(updateThumb);
                                ro.observe(el);
                                el.__fxResizeObserver = ro;
                        } else {
                                el.__fxInterval = setInterval(updateThumb, 500);
                        }

                        // Clean-up if track removed
                        const mo = new MutationObserver((mutations) => {
                                for (const m of mutations) {
                                        m.removedNodes.forEach((n) => {
                                                if (n === track) {
                                                        try {
                                                                if (
                                                                        el.__fxResizeObserver
                                                                )
                                                                        el.__fxResizeObserver.disconnect();
                                                        } catch (e) {}
                                                        try {
                                                                if (
                                                                        el.__fxInterval
                                                                )
                                                                        clearInterval(
                                                                                el.__fxInterval,
                                                                        );
                                                        } catch (e) {}
                                                        mo.disconnect();
                                                }
                                        });
                                }
                        });
                        mo.observe(el, { childList: true });
                }

                // Initialize Firefox custom scrollbars on DOM ready (or now if already ready)
                if (
                        document.readyState === "complete" ||
                        document.readyState === "interactive"
                ) {
                        try {
                                initFirefoxScrollbars();
                        } catch (e) {
                                console.warn("initFirefoxScrollbars failed", e);
                        }
                } else {
                        document.addEventListener("DOMContentLoaded", () => {
                                try {
                                        initFirefoxScrollbars();
                                } catch (e) {
                                        console.warn(
                                                "initFirefoxScrollbars failed",
                                                e,
                                        );
                                }
                        });
                }

                window.addEventListener("resize", () => {
                        // Adjust window positions if they're outside viewport and re-autosize where appropriate
                        const windows =
                                document.querySelectorAll(".window, .dialog");
                        windows.forEach((winEl) => {
                                const rect = winEl.getBoundingClientRect();

                                // If partially or fully outside viewport on the right, move it left
                                if (rect.left > window.innerWidth - 100) {
                                        const newLeft = Math.max(
                                                8,
                                                window.innerWidth -
                                                        rect.width -
                                                        8,
                                        );
                                        winEl.style.left = newLeft + "px";
                                }

                                // If below the viewport, move it up
                                if (rect.top > window.innerHeight - 50) {
                                        const newTop = Math.max(
                                                8,
                                                window.innerHeight -
                                                        rect.height -
                                                        8,
                                        );
                                        winEl.style.top = newTop + "px";
                                }

                                // If window was previously auto-sized, recalc its size to respect new viewport
                                if (winEl.dataset.autoSized === "true") {
                                        autosizeWindow(winEl);
                                        // Ensure inner content area is bounded and made scrollable if necessary
                                        if (
                                                typeof ensureContentScrollable ===
                                                "function"
                                        ) {
                                                ensureContentScrollable(winEl);
                                        }
                                }
                        });
                });

                /**
                 * Performance Monitoring
                 */
                let performanceTimer;

                function startPerformanceMonitor() {
                        performanceTimer = setInterval(() => {
                                const memoryInfo = performance.memory;
                                if (memoryInfo && Math.random() < 0.1) {
                                        console.log(
                                                `Windows 9x System: ${Math.round(memoryInfo.usedJSHeapSize / 1048576)}MB used`,
                                        );
                                }
                        }, 10000);
                }

                // Start performance monitoring
                startPerformanceMonitor();

                /**
                 * Export theme functions for external use
                 */
                window.Windows9xTheme = {
                        openWindow,
                        closeWindow,
                        focusWindow,
                        showAboutDialog,
                        playSystemSound,
                        updateTaskbarButtons,
                };

                // Dialog functions
                function showDocumentsDialog() {
                        const dialog =
                                document.querySelector(".documents-dialog");
                        dialog.style.display = "block";
                        focusWindow(dialog);
                        playSystemSound("dialog");
                }

                function showControlPanelDialog() {
                        const dialog = document.querySelector(
                                ".control-panel-dialog",
                        );
                        dialog.style.display = "block";
                        focusWindow(dialog);
                        playSystemSound("dialog");
                }

                function showFindDialog() {
                        const dialog = document.querySelector(".find-dialog");
                        dialog.style.display = "block";
                        focusWindow(dialog);
                        playSystemSound("dialog");
                }

                function showHelpDialog() {
                        const dialog = document.querySelector(".help-dialog");
                        dialog.style.display = "block";
                        focusWindow(dialog);
                        playSystemSound("dialog");
                }

                function showRunDialog() {
                        const dialog = document.querySelector(".run-dialog");
                        dialog.style.display = "block";
                        focusWindow(dialog);

                        // Focus the input field
                        const input = document.getElementById("run-input");
                        if (input) {
                                input.value = "";
                                setTimeout(() => input.focus(), 100);
                        }

                        playSystemSound("dialog");
                }

                function showShutdownDialog() {
                        const dialog =
                                document.querySelector(".shutdown-dialog");
                        dialog.style.display = "block";
                        focusWindow(dialog);
                        playSystemSound("dialog");
                }

                function performShutdown() {
                        // Show shutdown screen
                        const shutdownScreen =
                                document.querySelector(".shutdown-screen");
                        shutdownScreen.style.display = "flex";
                        playSystemSound("shutdown");
                }

                console.log(
                        "Windows 9x Desktop Environment loaded successfully! 💻",
                );
        }
}
