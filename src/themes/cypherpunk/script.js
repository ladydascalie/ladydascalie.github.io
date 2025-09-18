/**
 * Cypherpunk Theme JavaScript
 * Cyberpunk tabletop-inspired terminal interface effects
 */

document.addEventListener("DOMContentLoaded", function () {
        // Initialize all theme effects
        initDataStream();
        initTypingEffect();
        initGlitchEffects();
        initInteractiveElements();
        initTerminalEffects();
        initSystemMonitoring();
});

// datastream background effect
function initDataStream() {
        const canvas = document.getElementById("data-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        // Set canvas size
        function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const dataChars =
                "01░▒▓█▄▀▐▌<>{}[]()*/+-=~`!@#$%^&ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const charArray = dataChars.split("");

        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(0);

        function drawDataStream() {
                // Dark background with fade effect
                ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Data stream text
                ctx.fillStyle = "#00ffff";
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < drops.length; i++) {
                        const text =
                                charArray[
                                        Math.floor(
                                                Math.random() *
                                                        charArray.length,
                                        )
                                ];
                        const x = i * fontSize;
                        const y = drops[i] * fontSize;

                        ctx.fillText(text, x, y);

                        // Reset drop to top randomly
                        if (y > canvas.height && Math.random() > 0.975) {
                                drops[i] = 0;
                        }

                        drops[i]++;
                }
        }

        setInterval(drawDataStream, 50);
}

function initTypingEffect() {
        const typingElements = document.querySelectorAll(".typing");

        typingElements.forEach((element) => {
                const text = element.textContent || "";
                if (text === "_") return; // Skip cursor-only elements

                element.textContent = "";
                let i = 0;

                const typeInterval = setInterval(() => {
                        if (i < text.length) {
                                element.textContent += text.charAt(i);
                                i++;
                        } else {
                                clearInterval(typeInterval);
                                element.classList.add("cursor-blink");
                        }
                }, 100);
        });
}

function initGlitchEffects() {
        const neuralOverlay = document.querySelector(".neural-overlay");

        // Random glitch activation
        setInterval(() => {
                if (Math.random() < 0.1) {
                        // 10% chance
                        activateGlitch();
                }
        }, 2000);

        function activateGlitch() {
                const elements = document.querySelectorAll(
                        ".terminal-window, .ascii-art",
                );

                elements.forEach((element) => {
                        element.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                        element.style.filter = `hue-rotate(${Math.random() * 20}deg)`;

                        setTimeout(() => {
                                element.style.transform = "";
                                element.style.filter = "";
                        }, 100);
                });

                // Neural interface glitch
                if (neuralOverlay) {
                        neuralOverlay.style.opacity = "0.3";
                        setTimeout(() => {
                                neuralOverlay.style.opacity = "0";
                        }, 150);
                }
        }
}

function initInteractiveElements() {
        // Secure links hover effects
        const secureLinks = document.querySelectorAll(".secure-link");
        secureLinks.forEach((link) => {
                link.addEventListener("mouseenter", () => {
                        createNetrunnerEffect(link);
                });
        });

        // File items hover
        const fileItems = document.querySelectorAll(".file-item");
        fileItems.forEach((item) => {
                item.addEventListener("mouseenter", () => {
                        item.style.backgroundColor = "rgba(0, 255, 65, 0.1)";
                });

                item.addEventListener("mouseleave", () => {
                        item.style.backgroundColor = "";
                });
        });
}

function createNetrunnerEffect(element) {
        const rect = element.getBoundingClientRect();
        const particles = 8;

        for (let i = 0; i < particles; i++) {
                const particle = document.createElement("div");
                particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: #00ffff;
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            box-shadow: 0 0 4px #00ffff;
        `;

                document.body.appendChild(particle);

                particle.animate(
                        [
                                {
                                        transform: "scale(0) translateY(0)",
                                        opacity: 1,
                                },
                                {
                                        transform: `scale(1) translateY(-${Math.random() * 30 + 10}px)`,
                                        opacity: 0,
                                },
                        ],
                        {
                                duration: 800,
                                easing: "ease-out",
                        },
                ).onfinish = () => particle.remove();
        }
}

/**
 * Terminal Effects
 */
function initTerminalEffects() {
        // Scanline effect
        createScanlineEffect();

        // Random terminal beeps (visual only)
        setInterval(() => {
                if (Math.random() < 0.05) {
                        // 5% chance
                        flashTerminal();
                }
        }, 3000);

        // Boot sequence simulation
        setTimeout(() => {
                simulateBootSequence();
        }, 1000);
}

function createScanlineEffect() {
        const scanline = document.createElement("div");
        scanline.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #00ffff, transparent);
        z-index: 999;
        pointer-events: none;
        opacity: 0.3;
    `;

        document.body.appendChild(scanline);

        function animateScanline() {
                scanline.animate(
                        [
                                { transform: "translateY(-2px)" },
                                {
                                        transform: `translateY(${window.innerHeight}px)`,
                                },
                        ],
                        {
                                duration: 3000,
                                easing: "linear",
                        },
                ).onfinish = () => {
                        setTimeout(
                                animateScanline,
                                Math.random() * 10000 + 5000,
                        );
                };
        }

        setTimeout(animateScanline, 2000);
}

function flashTerminal() {
        const terminal = document.querySelector(".terminal-window");
        if (terminal) {
                terminal.style.boxShadow =
                        "0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(0, 255, 255, 0.1)";
                setTimeout(() => {
                        terminal.style.boxShadow =
                                "0 0 20px rgba(0, 255, 255, 0.3), inset 0 0 20px rgba(0, 255, 255, 0.05)";
                }, 100);
        }
}

function simulateBootSequence() {
        const messages = [
                "CYBERDECK INTERFACE ONLINE...",
                "INITIALIZING ICE PROTOCOLS...",
                "BYPASSING CORPORATE FIREWALLS...",
                "ACCESSING NET ARCHITECTURE...",
                "NEURAL LINK ESTABLISHED",
        ];

        // Create single boot notification
        const bootNotification = createBootNotification();
        let bootMessages = ["CYBERDECK BOOT INITIATED"];

        // Add messages one by one
        messages.forEach((message, index) => {
                setTimeout(
                        () => {
                                bootMessages.push(message);
                                updateBootNotification(
                                        bootNotification,
                                        bootMessages,
                                );

                                // Add success message and flash after last message
                                if (index === messages.length - 1) {
                                        setTimeout(() => {
                                                bootMessages.push(
                                                        "SYSTEM READY - ALL PROTOCOLS ACTIVE",
                                                );
                                                updateBootNotification(
                                                        bootNotification,
                                                        bootMessages,
                                                        true, // success flag
                                                );
                                                flashNotificationGreen(
                                                        bootNotification,
                                                );

                                                // Remove notification after success message
                                                setTimeout(() => {
                                                        removeBootNotification(
                                                                bootNotification,
                                                        );
                                                }, 3000);
                                        }, 1000);
                                }
                        },
                        (index + 1) * 800,
                );
        });
}

function createBootNotification() {
        const messageDiv = document.createElement("div");
        messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(10, 10, 10, 0.98);
                backdrop-filter: blur(10px);
                border: 2px solid #00ffff;
                color: #00ffff;
                padding: 12px 18px;
                border-radius: 5px;
                font-family: 'Fira Code', monospace;
                font-size: 13px;
                z-index: 99999;
                box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 4px 15px rgba(0, 0, 0, 0.8);
                max-width: 320px;
                word-wrap: break-word;
                max-height: 200px;
                overflow-y: auto;
                text-shadow: 0 0 5px currentColor;
        `;

        document.body.appendChild(messageDiv);

        // Slide in animation
        messageDiv.animate(
                [
                        { transform: "translateX(100%)", opacity: 0 },
                        { transform: "translateX(0)", opacity: 1 },
                ],
                {
                        duration: 300,
                        easing: "ease-out",
                },
        );

        return messageDiv;
}

function updateBootNotification(notification, messages, isSuccess = false) {
        const content = messages
                .map((msg, index) => {
                        const prefix =
                                isSuccess && index === messages.length - 1
                                        ? "[SUCCESS]"
                                        : "[INFO]";
                        return `${prefix} ${msg}`;
                })
                .join("<br>");
        notification.innerHTML = content;

        // Scroll to bottom to show latest message
        notification.scrollTop = notification.scrollHeight;
}

function removeBootNotification(notification) {
        notification.animate(
                [
                        { transform: "translateX(0)", opacity: 1 },
                        { transform: "translateX(100%)", opacity: 0 },
                ],
                {
                        duration: 300,
                        easing: "ease-in",
                },
        ).onfinish = () => notification.remove();
}

function flashNotificationGreen(notification) {
        const originalBorderColor = notification.style.borderColor;
        const originalBoxShadow = notification.style.boxShadow;

        // Flash green 3 times
        let flashCount = 0;
        const flashInterval = setInterval(() => {
                if (flashCount % 2 === 0) {
                        // Green flash
                        notification.style.borderColor = "#00ff41";
                        notification.style.boxShadow =
                                "0 0 20px rgba(0, 255, 65, 0.8)";
                        notification.style.backgroundColor =
                                "rgba(0, 255, 65, 0.1)";
                } else {
                        // Back to original
                        notification.style.borderColor = "#00ffff";
                        notification.style.boxShadow =
                                "0 0 10px rgba(0, 255, 255, 0.3)";
                        notification.style.backgroundColor =
                                "rgba(0, 0, 0, 0.9)";
                }

                flashCount++;
                if (flashCount >= 6) {
                        // 3 full flashes
                        clearInterval(flashInterval);
                        // Keep it green for success
                        notification.style.borderColor = "#00ff41";
                        notification.style.boxShadow =
                                "0 0 15px rgba(0, 255, 65, 0.5)";
                        notification.style.backgroundColor =
                                "rgba(0, 255, 65, 0.05)";
                }
        }, 200);
}

/**
 * System Monitoring Effects
 */
function initSystemMonitoring() {
        // Update system time
        updateSystemTime();
        setInterval(updateSystemTime, 1000);

        // Random system alerts
        setInterval(() => {
                if (Math.random() < 0.02) {
                        // 2% chance
                        showRandomSystemAlert();
                }
        }, 5000);

        // Monitor network activity simulation
        simulateNetworkActivity();
}

function updateSystemTime() {
        const timeElements = document.querySelectorAll(".system-time");
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
        });

        timeElements.forEach((element) => {
                element.textContent = timeString;
        });
}

function showRandomSystemAlert() {
        const alerts = [
                "ICE INTRUSION DETECTED",
                "FIREWALL STATUS: ACTIVE",
                "ENCRYPTING DATA STREAM...",
                "NEURAL SYNC: 97.3%",
                "CYBERDECK LINK STABLE",
                "BACKDOOR SECURED SUCCESSFULLY",
                "STEGANOGRAPHY MODULE LOADED",
        ];

        const alertType = Math.random() < 0.7 ? "info" : "warning";
        const message = alerts[Math.floor(Math.random() * alerts.length)];
        showSystemMessage(message, alertType);
}

function simulateNetworkActivity() {
        const connections = document.querySelectorAll(".connection-item");

        setInterval(() => {
                connections.forEach((connection) => {
                        if (Math.random() < 0.1) {
                                // 10% chance
                                connection.style.background =
                                        "rgba(0, 255, 255, 0.1)";
                                setTimeout(() => {
                                        connection.style.background = "";
                                }, 200);
                        }
                });
        }, 1000);
}

/**
 * System Message Display
 */
function showSystemMessage(message, type = "info") {
        const messageDiv = document.createElement("div");
        messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(10, 10, 10, 0.98);
        backdrop-filter: blur(10px);
        border: 2px solid ${type === "error" ? "#ff0040" : type === "warning" ? "#ff6b00" : "#00ff41"};
        color: ${type === "error" ? "#ff0055" : type === "warning" ? "#ff7700" : "#00ffff"};
        padding: 12px 18px;
        border-radius: 5px;
        font-family: 'Fira Code', monospace;
        font-size: 13px;
        z-index: 99999;
        box-shadow: 0 0 20px ${type === "error" ? "rgba(255, 0, 85, 0.5)" : type === "warning" ? "rgba(255, 119, 0, 0.5)" : "rgba(0, 255, 255, 0.5)"}, 0 4px 15px rgba(0, 0, 0, 0.8);
        max-width: 280px;
        word-wrap: break-word;
        text-shadow: 0 0 5px currentColor;
    `;

        messageDiv.textContent = `[${type.toUpperCase()}] ${message}`;
        document.body.appendChild(messageDiv);

        // Slide in animation
        messageDiv.animate(
                [
                        { transform: "translateX(100%)", opacity: 0 },
                        { transform: "translateX(0)", opacity: 1 },
                ],
                {
                        duration: 300,
                        easing: "ease-out",
                },
        );

        // Auto remove after 3 seconds
        setTimeout(() => {
                messageDiv.animate(
                        [
                                { transform: "translateX(0)", opacity: 1 },
                                { transform: "translateX(100%)", opacity: 0 },
                        ],
                        {
                                duration: 300,
                                easing: "ease-in",
                        },
                ).onfinish = () => messageDiv.remove();
        }, 3000);
}

/**
 * Konami Code Easter Egg
 */
(function initKonamiCode() {
        let konamiCode = [];
        const konamiSequence = [
                "ArrowUp",
                "ArrowUp",
                "ArrowDown",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "ArrowLeft",
                "ArrowRight",
                "KeyB",
                "KeyA",
        ]; // ↑↑↓↓←→←→BA

        document.addEventListener("keydown", (e) => {
                konamiCode.push(e.code);

                if (konamiCode.length > konamiSequence.length) {
                        konamiCode.shift();
                }

                if (konamiCode.join(",") === konamiSequence.join(",")) {
                        activateJohnnyMode();
                        konamiCode = [];
                }
        });

        function activateJohnnyMode() {
                showSystemMessage("ENTERING SILVERHAND MODE...", "success");

                // Enhanced data stream effect
                const canvas = document.getElementById("data-canvas");
                if (canvas) {
                        canvas.style.opacity = "0.3";
                }

                // Chrome terminal
                const terminal = document.querySelector(".terminal-window");
                if (terminal) {
                        terminal.style.animation = "chrome-border 2s infinite";

                        const style = document.createElement("style");
                        style.textContent = `
                @keyframes chrome-border {
                    0% { border-color: #00ffff; }
                    16% { border-color: #0080ff; }
                    33% { border-color: #aa00ff; }
                    50% { border-color: #ff0055; }
                    66% { border-color: #ff7700; }
                    83% { border-color: #ffdd00; }
                    100% { border-color: #00ffff; }
                }
            `;
                        document.head.appendChild(style);
                }

                // Enhanced glitch effects
                for (let i = 0; i < 10; i++) {
                        setTimeout(() => {
                                const elements = document.querySelectorAll("*");
                                elements.forEach((el) => {
                                        if (Math.random() < 0.1) {
                                                el.style.filter =
                                                        "hue-rotate(180deg) saturate(2)";
                                                setTimeout(() => {
                                                        el.style.filter = "";
                                                }, 100);
                                        }
                                });
                        }, i * 200);
                }

                // Reset after 10 seconds
                setTimeout(() => {
                        if (canvas) canvas.style.opacity = "0.05";
                        if (terminal) terminal.style.animation = "";
                        showSystemMessage(
                                "SILVERHAND MODE DEACTIVATED",
                                "info",
                        );
                }, 10000);
        }
})();

/**
 * Utility Functions
 */
function getRandomDataChar() {
        const chars = "01░▒▓█▄▀▐▌<>{}[]()*/+-=~`!@#$%^&";
        return chars.charAt(Math.floor(Math.random() * chars.length));
}

function createParticleEffect(x, y, color = "#00ffff") {
        const particle = document.createElement("div");
        particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 6px ${color};
    `;

        document.body.appendChild(particle);

        particle.animate(
                [
                        {
                                transform: "scale(1) translateY(0)",
                                opacity: 1,
                        },
                        {
                                transform: `scale(0) translateY(-${Math.random() * 50 + 20}px)`,
                                opacity: 0,
                        },
                ],
                {
                        duration: 1000,
                        easing: "ease-out",
                },
        ).onfinish = () => particle.remove();
}

// Export functions for potential external use
window.CypherpunkTheme = {
        showSystemMessage,
        createParticleEffect,
        activateGlitch: function () {
                // Expose neural glitch function
                const elements = document.querySelectorAll(
                        ".terminal-window, .ascii-art",
                );
                elements.forEach((element) => {
                        element.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
                        setTimeout(() => (element.style.transform = ""), 100);
                });
        },
};
