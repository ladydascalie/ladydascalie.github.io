/**
 * Retro 90s Theme JavaScript
 * Nostalgic 90s website interactive effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all theme effects
    initNavigation();
    initInteractiveEffects();
    initSkillBars();
    initGuestbook();
    initFloatingElements();
    initSparkleEffects();
    init90sEffects();
    initKonamiCode();
    initSoundEffects();
});

/**
 * Navigation System
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');

            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked nav item and corresponding section
            item.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');

                // Add entrance animation
                targetElement.style.animation = 'none';
                targetElement.offsetHeight; // Trigger reflow
                targetElement.style.animation = 'fadeIn 0.5s ease-in';
            }

            // Create navigation effect
            createNavigationEffect(item);
        });
    });
}

function createNavigationEffect(element) {
    const rect = element.getBoundingClientRect();
    const particles = 12;

    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #ff69b4, #00ffff);
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            box-shadow: 0 0 10px currentColor;
        `;

        document.body.appendChild(particle);

        const angle = (i / particles) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;

        particle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${x}px, ${y}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }
}

/**
 * Interactive Effects
 */
function initInteractiveEffects() {
    // Hover effects for buttons and links
    const interactiveElements = document.querySelectorAll(
        '.nav-item, .contact-btn, .webring-btn, .submit-btn, .project-link, .rainbow-link'
    );

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            createHoverSparkles(element);
            addHoverGlow(element);
        });

        element.addEventListener('mouseleave', () => {
            removeHoverGlow(element);
        });

        element.addEventListener('click', () => {
            createClickBurst(element);
        });
    });

    // Profile image bounce effect
    const profileImages = document.querySelectorAll('.profile-image, .profile-pic');
    profileImages.forEach(img => {
        img.addEventListener('click', () => {
            img.style.animation = 'none';
            img.offsetHeight; // Trigger reflow
            img.style.animation = 'bounce 0.6s ease-in-out';
        });
    });

    // Skill tags interactive effects
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            tag.style.transform = 'scale(1.1) rotate(' + (Math.random() * 20 - 10) + 'deg)';
            createSparkleRain(tag);
        });

        tag.addEventListener('mouseleave', () => {
            tag.style.transform = '';
        });
    });
}

function createHoverSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 5;

    for (let i = 0; i < sparkleCount; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #ffff00;
                pointer-events: none;
                z-index: 9998;
                border-radius: 50%;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                box-shadow: 0 0 8px #ffff00;
            `;

            document.body.appendChild(sparkle);

            sparkle.animate([
                {
                    transform: 'scale(0) translateY(0)',
                    opacity: 1
                },
                {
                    transform: 'scale(1) translateY(-20px)',
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => sparkle.remove();
        }, i * 100);
    }
}

function addHoverGlow(element) {
    element.style.filter = 'brightness(1.2) drop-shadow(0 0 10px currentColor)';
}

function removeHoverGlow(element) {
    element.style.filter = '';
}

function createClickBurst(element) {
    const rect = element.getBoundingClientRect();
    const burstCount = 15;

    for (let i = 0; i < burstCount; i++) {
        const particle = document.createElement('div');
        particle.textContent = ['★', '✨', '💫', '🌟', '⭐'][Math.floor(Math.random() * 5)];
        particle.style.cssText = `
            position: fixed;
            font-size: 12px;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            color: #ff69b4;
        `;

        document.body.appendChild(particle);

        const angle = (i / burstCount) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.animate([
            {
                transform: 'translate(0, 0) scale(1) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${x}px, ${y}px) scale(0) rotate(360deg)`,
                opacity: 0
            }
        ], {
            duration: 1200,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
}

function createSparkleRain(element) {
    const rect = element.getBoundingClientRect();
    const rainCount = 8;

    for (let i = 0; i < rainCount; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: #00ffff;
                pointer-events: none;
                z-index: 9998;
                border-radius: 50%;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top - 10}px;
                box-shadow: 0 0 6px #00ffff;
            `;

            document.body.appendChild(drop);

            drop.animate([
                {
                    transform: 'translateY(0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translateY(${rect.height + 40}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 1000,
                easing: 'ease-in'
            }).onfinish = () => drop.remove();
        }, i * 50);
    }
}

/**
 * Skill Bars Animation
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress');

    // Animate skill bars when skills section becomes active
    const skillsSection = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
            }
        });
    });

    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Also animate when skills nav is clicked
    const skillsNav = document.querySelector('[data-section="skills"]');
    if (skillsNav) {
        skillsNav.addEventListener('click', () => {
            setTimeout(animateSkillBars, 300);
        });
    }

    function animateSkillBars() {
        skillBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress') || '50';

            setTimeout(() => {
                bar.style.width = '0%';
                bar.offsetHeight; // Trigger reflow

                bar.animate([
                    { width: '0%' },
                    { width: progress + '%' }
                ], {
                    duration: 1500,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fill: 'forwards'
                });

                // Add completion sparkle
                setTimeout(() => {
                    createSkillBarSparkle(bar);
                }, 1500);

            }, index * 200);
        });
    }

    function createSkillBarSparkle(bar) {
        const rect = bar.getBoundingClientRect();
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.cssText = `
            position: fixed;
            font-size: 16px;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.right - 10}px;
            top: ${rect.top + rect.height / 2}px;
            color: #ffff00;
        `;

        document.body.appendChild(sparkle);

        sparkle.animate([
            {
                transform: 'scale(0) translateY(0)',
                opacity: 1
            },
            {
                transform: 'scale(1.5) translateY(-30px)',
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => sparkle.remove();
    }
}

/**
 * Guestbook Functionality
 */
function initGuestbook() {
    const guestForm = document.querySelector('.guest-form');

    if (guestForm) {
        guestForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(guestForm);
            const name = guestForm.querySelector('input[type="text"]').value;
            const email = guestForm.querySelector('input[type="email"]').value;
            const message = guestForm.querySelector('textarea').value;

            if (!name || !message) {
                showNotification('Please fill in your name and message!', 'error');
                return;
            }

            // Create new guest entry
            addGuestEntry(name, email, message);

            // Reset form
            guestForm.reset();

            // Show success message
            showNotification('Thanks for signing my guestbook! 🌟', 'success');

            // Celebration effect
            createCelebrationEffect();
        });
    }
}

function addGuestEntry(name, email, message) {
    const guestEntries = document.querySelector('.guestbook-entries');
    const newEntry = document.createElement('div');
    newEntry.className = 'guest-entry';

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    newEntry.innerHTML = `
        <div class="guest-header">
            <strong>${escapeHtml(name)}</strong> - <span class="guest-date">${dateStr}</span>
        </div>
        <div class="guest-message">${escapeHtml(message)}</div>
    `;

    newEntry.style.animation = 'fadeIn 0.5s ease-in';
    guestEntries.insertBefore(newEntry, guestEntries.children[1]);

    // Limit to 5 entries
    const entries = guestEntries.querySelectorAll('.guest-entry');
    if (entries.length > 6) { // Keep h3 + 5 entries
        entries[entries.length - 1].remove();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function createCelebrationEffect() {
    const celebrationCount = 25;
    const emojis = ['🎉', '🎊', '✨', '🌟', '💫', '🎈', '🎆'];

    for (let i = 0; i < celebrationCount; i++) {
        setTimeout(() => {
            const celebration = document.createElement('div');
            celebration.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            celebration.style.cssText = `
                position: fixed;
                font-size: 20px;
                pointer-events: none;
                z-index: 9999;
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                animation: celebration-fall 3s ease-in forwards;
            `;

            document.body.appendChild(celebration);

            setTimeout(() => celebration.remove(), 3000);
        }, i * 50);
    }

    // Add celebration fall animation
    if (!document.getElementById('celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            @keyframes celebration-fall {
                to {
                    transform: translateY(${window.innerHeight + 50}px) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Floating Elements Animation
 */
function initFloatingElements() {
    const floatingStars = document.querySelectorAll('.floating-star');

    // Random color changes
    setInterval(() => {
        floatingStars.forEach(star => {
            const colors = ['#ff69b4', '#00ffff', '#00ff00', '#ffff00', '#9932cc', '#ff1493', '#ff8c00'];
            star.style.color = colors[Math.floor(Math.random() * colors.length)];
        });
    }, 3000);

    // Add click interaction
    floatingStars.forEach(star => {
        star.addEventListener('click', () => {
            createFloatingStarBurst(star);
        });
    });
}

function createFloatingStarBurst(star) {
    const rect = star.getBoundingClientRect();
    const burstStars = 8;

    for (let i = 0; i < burstStars; i++) {
        const miniStar = document.createElement('div');
        miniStar.textContent = star.textContent;
        miniStar.style.cssText = `
            position: fixed;
            font-size: 12px;
            pointer-events: none;
            z-index: 9999;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            color: ${star.style.color || '#ff69b4'};
        `;

        document.body.appendChild(miniStar);

        const angle = (i / burstStars) * Math.PI * 2;
        const distance = 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        miniStar.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${x}px, ${y}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => miniStar.remove();
    }
}

/**
 * Sparkle Effects
 */
function initSparkleEffects() {
    // Continuous sparkle generation
    setInterval(createRandomSparkle, 2000);

    // Mouse trail sparkles
    let mouseTrailTimeout;
    document.addEventListener('mousemove', (e) => {
        clearTimeout(mouseTrailTimeout);
        mouseTrailTimeout = setTimeout(() => {
            if (Math.random() < 0.1) { // 10% chance
                createMouseSparkle(e.clientX, e.clientY);
            }
        }, 50);
    });
}

function createRandomSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.cssText = `
        position: fixed;
        font-size: 14px;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        color: #ffff00;
        opacity: 0.7;
    `;

    document.body.appendChild(sparkle);

    sparkle.animate([
        {
            transform: 'scale(0) rotate(0deg)',
            opacity: 0
        },
        {
            transform: 'scale(1) rotate(180deg)',
            opacity: 0.7
        },
        {
            transform: 'scale(0) rotate(360deg)',
            opacity: 0
        }
    ], {
        duration: 2000,
        easing: 'ease-in-out'
    }).onfinish = () => sparkle.remove();
}

function createMouseSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: #ff69b4;
        pointer-events: none;
        z-index: 9997;
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        box-shadow: 0 0 6px #ff69b4;
    `;

    document.body.appendChild(sparkle);

    sparkle.animate([
        {
            transform: 'scale(1)',
            opacity: 1
        },
        {
            transform: 'scale(0)',
            opacity: 0
        }
    ], {
        duration: 600,
        easing: 'ease-out'
    }).onfinish = () => sparkle.remove();
}

/**
 * 90s Effects
 */
function init90sEffects() {
    // Visitor counter animation
    animateVisitorCounter();

    // Random popup messages (90s style)
    setTimeout(show90sPopup, 5000);
    setInterval(show90sPopup, 30000);

    // Rainbow text effects
    initRainbowEffects();
}

function animateVisitorCounter() {
    const counter = document.querySelector('.counter');
    if (counter) {
        const targetValue = parseInt(counter.textContent.replace(/,/g, ''));
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 100);

        const countAnimation = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(countAnimation);
            }
            counter.textContent = currentValue.toLocaleString();
        }, 50);
    }
}

function show90sPopup() {
    const messages = [
        "🎉 Welcome to my rad website!",
        "✨ Thanks for visiting my cyber space!",
        "🌟 Don't forget to sign my guestbook!",
        "💫 This site is best viewed in 1024x768!",
        "🎊 You're visitor number " + Math.floor(Math.random() * 10000) + "!",
        "🔥 This page is totally tubular!",
        "⚡ Loading additional awesomeness...",
        "🎯 Check out my cool projects!"
    ];

    showNotification(messages[Math.floor(Math.random() * messages.length)], 'info', 3000);
}

function initRainbowEffects() {
    const rainbowElements = document.querySelectorAll('.rainbow-link, .title');

    rainbowElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animationDuration = '0.5s';
        });

        element.addEventListener('mouseleave', () => {
            element.style.animationDuration = '3s';
        });
    });
}

/**
 * Konami Code Easter Egg
 */
function initKonamiCode() {
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);

        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateUltraMode();
            konamiCode = [];
        }
    });
}

function activateUltraMode() {
    showNotification('🎊 ULTRA 90S MODE ACTIVATED! 🎊', 'success');

    // Enhanced effects
    document.body.style.filter = 'hue-rotate(45deg) saturate(1.5)';

    // Super sparkles
    for (let i = 0; i < 50; i++) {
        setTimeout(createRandomSparkle, i * 100);
    }

    // Disco background
    const disco = document.createElement('div');
    disco.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, transparent, rgba(255, 105, 180, 0.1), transparent, rgba(0, 255, 255, 0.1));
        background-size: 100px 100px;
        animation: disco-move 0.5s linear infinite;
        pointer-events: none;
        z-index: 1;
    `;

    document.body.appendChild(disco);

    // Add disco animation
    if (!document.getElementById('disco-styles')) {
        const style = document.createElement('style');
        style.id = 'disco-styles';
        style.textContent = `
            @keyframes disco-move {
                0% { background-position: 0 0; }
                100% { background-position: 100px 100px; }
            }
        `;
        document.head.appendChild(style);
    }

    // Reset after 10 seconds
    setTimeout(() => {
        document.body.style.filter = '';
        disco.remove();
        showNotification('Back to normal... or are we? 😉', 'info');
    }, 10000);
}

/**
 * Sound Effects (Web Audio API)
 */
function initSoundEffects() {
    // Create audio context for sound effects
    let audioContext;

    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
        return;
    }

    // Sound effect functions
    function playBeep(frequency = 800, duration = 100) {
        if (!audioContext) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    // Add sound to navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => playBeep(600, 150));
    });

    // Add sound to buttons
    const buttons = document.querySelectorAll('.contact-btn, .submit-btn, .webring-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => playBeep(400, 100));
    });
}

/**
 * Notification System
 */
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'linear-gradient(45deg, #ff0040, #ff6b00)' :
                     type === 'success' ? 'linear-gradient(45deg, #00ff00, #00ffff)' :
                     'linear-gradient(45deg, #ff69b4, #9932cc)'};
        color: white;
        padding: 15px 20px;
        border-radius: 20px;
        font-weight: bold;
        z-index: 10000;
        border: 2px solid white;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        max-width: 300px;
        font-size: 14px;
        animation: notification-slide 0.3s ease-out;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Add slide animation
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notification-slide {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Auto remove
    setTimeout(() => {
        notification.animate([
            { transform: 'translateX(0)', opacity: 1 },
            { transform: 'translateX(100%)', opacity: 0 }
        ], {
            duration: 300,
            easing: 'ease-in'
        }).onfinish = () => notification.remove();
    }, duration);
}

/**
 * Utility Functions
 */
function getRandomColor() {
    const colors = ['#ff69b4', '#00ffff', '#00ff00', '#ffff00', '#9932cc', '#ff1493', '#ff8c00'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createParticle(x, y, char = '✨', color = '#ffff00') {
    const particle = document.createElement('div');
    particle.textContent = char;
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 14px;
        color: ${color};
        pointer-events: none;
        z-index: 9999;
        text-shadow: 0 0 6px currentColor;
    `;

    document.body.appendChild(particle);

    particle.animate([
        {
            transform: 'scale(1) translateY(0) rotate(0deg)',
            opacity: 1
        },
        {
            transform: 'scale(0) translateY(-40px) rotate(360deg)',
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => particle.remove();
}

// Export functions for potential external use
window.Retro90sTheme = {
    showNotification,
    createParticle,
    activateUltraMode: function() {
        activateUltraMode();
    },
    createSparkles: function(element) {
        createHoverSparkles(element);
    }
};
