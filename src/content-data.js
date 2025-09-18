/**
 * Central content data structure for all themes
 * This is the single source of truth for profile information
 */
const PROFILE_DATA = {
        personal: {
                short_name: "Ben",
                name: "Benjamin Cable",
                title: "Senior Backend Engineer",
                company: "LootLocker",
                companyUrl: "https://lootlocker.com/",
                portrait: "src/portrait.gif",
                status: "Online",
                clearance: "Classified",
                location: "Digital Realm",
        },

        bio: [
                "Hi there! 👋 I'm an enthusiastic Go developer with a wide range of skills, from building large-scale APIs to creating command line applications.",
                "Throughout my career, I've had the opportunity to lead teams of different sizes, ranging from 10 to 30 people, both as a lead developer and a principal engineer.",
                "I'm actively involved in the free and open source software community. Apart from creating and maintaining software, I also co-organize the Golang Dorset meetup with my friends and colleagues.",
                "Go is my primary language for work. I rely on it daily to develop micro-services and various command-line tools. Additionally, I have extensive experience with PHP, including creating new applications and managing legacy software.",
                "In my free time, I enjoy engaging with educational materials, writing small video games using C & SDL2, and indulging my passion for music by writing and recording my own tracks.",
        ],

        skills: {
                languages: ["Go", "PHP", "Rust", "JavaScript"],
                systems: ["*nix", "AWS/GCP", "Coffee ☕"],
                expertise: [
                        "Microservices Architecture",
                        "Distributed Systems",
                        "Team Leadership",
                        "API Design",
                        "Command Line Tools",
                ],
                threat_levels: {
                        Go: "CRITICAL",
                        PHP: "HIGH",
                        Rust: "MODERATE",
                        JavaScript: "ACTIVE",
                },
        },

        projects: [
                {
                        name: "go-flexible",
                        url: "https://github.com/go-flexible",
                        description: "Flexible Framework",
                        classification: "Classified",
                },
                {
                        name: "Currency",
                        url: "https://github.com/ladydascalie/currency",
                        description: "Financial Data Handler",
                },
                {
                        name: "zconf",
                        url: "https://github.com/ladydascalie/zconf",
                        description:
                                "Extremely Overengineered Configuration Manager",
                },
                {
                        name: "ulid-tools",
                        url: "https://github.com/ladydascalie/ulid-tools",
                        description: "ULID Tools GUI Application",
                },
                {
                        name: "iso3166-1-alpha-2",
                        url: "https://github.com/ladydascalie/iso3166-1-alpha-2",
                        description: "Geographic Intelligence",
                },
                {
                        name: "Sqlerr",
                        url: "https://github.com/ladydascalie/sqlerr",
                        description: "Database Security Tool",
                },
                {
                        name: "Vex",
                        url: "https://github.com/ladydascalie/vex",
                        description: "Vexing Makefile Replacement",
                },
                {
                        name: "Go Core",
                        url: "https://github.com/golang/go/",
                        description: "CLASSIFIED DOCUMENTATION ACCESS",
                        note: "documentation, but… still counts!",
                },
        ],

        contact: {
                email: "ben@cable.fyi",
                signal: "https://signal.me/#eu/V-9dTllhTgyXXHeIPglmmW4ScT7DVteYjNgkcf3L409OnH0uaVtF1JzIYvy9CS4z",
                linkedin: "https://www.linkedin.com/in/benjamin-cable-9aa05b90/",
                github: "https://github.com/ladydascalie",
                pgp: "https://github.com/ladydascalie.gpg",
                channels: [
                        {
                                name: "SIGNAL_ENCRYPTED",
                                url: "https://signal.me/#eu/V-9dTllhTgyXXHeIPglmmW4ScT7DVteYjNgkcf3L409OnH0uaVtF1JzIYvy9CS4z",
                                type: "secure",
                        },
                        {
                                name: "LINKEDIN_PROFESSIONAL",
                                url: "https://www.linkedin.com/in/benjamin-cable-9aa05b90/",
                                type: "professional",
                        },
                        {
                                name: "EMAIL_SECURE",
                                url: "mailto:ben@cable.fyi",
                                type: "email",
                        },
                        {
                                name: "GITHUB_REPOSITORIES",
                                url: "https://github.com/ladydascalie",
                                type: "code",
                        },
                ],
        },

        meetup: {
                name: "🐹 Golang Dorset Meetup 🐹",
                shortName: "Golang Dorset",
                url: "https://www.meetup.com/golang-dorset/",
                frequency: "Monthly",
                description:
                        "Monthly gatherings of digital gophers for advanced Go programming, distributed systems architecture, and underground knowledge sharing.",
                activities: [
                        "Advanced Go programming techniques",
                        "Distributed systems architecture",
                        "Cryptographic implementations",
                        "Network security protocols",
                        "Underground knowledge sharing",
                ],
                encrypted_data:
                        "4D6F6E746C7920476174686572696E67206F662043796265722D476F70686572730A",
        },

        system: {
                os: "GNU/Linux SHIBUYA-RECK-4 8.7.2-ALPHA-NEO-CYBERN-S1 x86_64",
                processor: "Neuralink SYNTH-X1-A Processor",
                ram: "128PB Hyper-Dimensional Quantum RAM",
                storage: "200ZB Holo-Disc Array",
                network_status: "active connection - LootLocker",
                version: "v2.085-SYNTH",
                reality_index: "94.7% (Stable)",
                neural_link: "ESTABLISHED - Bio-Synapse Interface active",
        },

        windows: {
                os: "Microsoft Windows 98 Second Edition 4.10.2222 A",
                processor: "Intel Pentium II 400 MHz",
                ram: "128 MB SDRAM",
                version: "Windows 98 SE Build 2222",
        },

        webring: {
                sites: [
                        {
                                url: "https://roolps.dev/",
                        },
                        {
                                url: "https://mikkel.smoothlys.com",
                        },
                        {
                                url: "https://icelynjennings.github.io/",
                        },
                        {
                                url: "https://github.com/zeevallin/",
                        },
                ],
        },

        meta: {
                last_updated: "Y2K Compliant",
                visitor_count: "133,337",
                best_viewed: "1024x768 resolution",
                made_with: "Existential Angst & HTML",
                cyber_year: "2085",
                real_year: new Date().getFullYear().toString(),
                go_version: "1.23+",
        },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
        module.exports = PROFILE_DATA;
}
