# Website Version Backups

This folder contains different versions of Benjamin Cable's personal website, each with distinct aesthetic themes while maintaining the same core content.

## Available Versions

### `retro-90s-version.html`
**Theme:** Classic 90's Internet Nostalgia
- **Visual Style:** Hot pink dominant color scheme with neon accents
- **Features:**
  - Animated starfield background with twinkling stars
  - Scrolling marquee with classic 90's messaging
  - Blinking text effects and neon glows
  - Ridge/outset borders for 3D effects
  - Classic retro buttons with gradient backgrounds
  - "Under Construction" notices
  - Visitor counter (fake but authentic!)
  - Web Ring navigation
  - Y2K compliance messaging
  - Classic "Best viewed in..." footer
- **Fonts:** Orbitron for that futuristic 90's look
- **Color Palette:** Hot pink, cyber pink, electric blue, lime green, yellow, purple

## Current Live Version
The current `index.html` features a **Cypherpunk Terminal** aesthetic with:
- Matrix-style terminal windows
- ASCII art banners
- Monospace fonts (Share Tech Mono)
- Hacker/cyberpunk narrative
- Terminal color scheme (matrix green, cyber pink, neon blue)
- Encrypted message blocks
- System prompts and command outputs

## How to Switch Versions

To switch to a different version:

1. **Backup current version** (if needed):
   ```bash
   cp index.html backups/current-backup-$(date +%Y%m%d).html
   ```

2. **Copy desired version to root**:
   ```bash
   cp backups/retro-90s-version.html index.html
   ```

3. **Commit and push** changes to deploy

## Dependencies

Both versions use:
- Google Fonts (Orbitron for 90's, Share Tech Mono for Cypherpunk)
- `fairydust.js` particle effects
- `src/portrait.gif` image

## Notes

- Both versions are fully responsive
- All external links and contact information remain consistent
- The Golang Dorset meetup link is prominently featured in both versions
- Content structure is identical, only styling differs