# Runbooks design system v0.3.0 (vendored)

Source: https://github.com/runbooks-help/design-system
Tag: `v0.3.0`
Release: https://github.com/runbooks-help/design-system/releases/tag/v0.3.0

Do not edit these files. Re-vendor from the release and update the hashes.

## Files

| File | Release URL | sha256 |
|---|---|---|
| `tokens.css` | https://github.com/runbooks-help/design-system/releases/download/v0.3.0/tokens.css | `20ee1e13e373c3f98e3501ecbfcce659c96269dde74c9d63c8e62c04054068c2` |
| `fonts.css` | https://github.com/runbooks-help/design-system/releases/download/v0.3.0/fonts.css | `cc663cf93561a298c7ec24b09bc419671f12268a39bbed8443d2c893bc5c56e7` |
| `fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2` | https://github.com/runbooks-help/design-system/releases/download/v0.3.0/fonts.tar.gz | `18b2a1a39a2fa298b0ba5390aca68462669826c90925656f1c1f6796e0e1bbaf` |
| `fonts/atkinson-hyperlegible-mono-latin-wght-normal.woff2` | https://github.com/runbooks-help/design-system/releases/download/v0.3.0/fonts.tar.gz | `2706b1ee4f452e744ea91f7e4908cbde9c5d35521bf5ffffc71a382a2de89613` |
| `fonts/noto-sans-mono-shades.woff2` | https://github.com/runbooks-help/design-system/releases/download/v0.3.0/fonts.tar.gz | `6e2c1b88702bd7cf12286468df1b99fd369094b5769748e08c2d95162bd45513` |
| `fonts/atkinson-hyperlegible.LICENSE` | https://github.com/runbooks-help/design-system/releases/download/v0.3.0/fonts.tar.gz | `a275a1ca3e69ee941f6c1127d784cd1a7eedab1e7e25d55ebd08af4d56d0fd63` |
| `fonts/noto-sans-mono-shades.LICENSE` | https://github.com/runbooks-help/design-system/releases/download/v0.3.0/fonts.tar.gz | `1d66b7f491c8511ad7df7c579267949e7c6274afeecc44d3f275dcf7a79180d9` |
| `LICENSE-FSL-1.1-MIT` | https://raw.githubusercontent.com/runbooks-help/design-system/v0.3.0/LICENSE | `672329c8e725d08a82adf20c527f934322135e82318ab4865654a35cfa0cb4d3` |

`fonts.tar.gz` also carries a `brand/`-free layout: the archive holds `fonts/` only.
`LICENSE-FSL-1.1-MIT` is the repository root `LICENSE`, renamed on vendor to keep it
distinct from the font licences.

## Licences

- `tokens.css`, `fonts.css`: FSL-1.1-MIT (Functional Source License 1.1, MIT future
  licence). See `LICENSE-FSL-1.1-MIT`.
- Every file in `fonts/`: SIL Open Font License 1.1, per the `*.LICENSE` files.

## Not vendored

Runbooks brand assets (`brand.tar.gz`, `favicon.svg`). They are Runbooks' own marks and
do not belong on this site.

## Reproduce

    mkdir -p fonts
    base=https://github.com/runbooks-help/design-system/releases/download/v0.3.0
    curl -sSLo tokens.css "$base/tokens.css"
    curl -sSLo fonts.css "$base/fonts.css"
    curl -sSLo fonts.tar.gz "$base/fonts.tar.gz"
    tar xzf fonts.tar.gz --strip-components=0 fonts/
    rm fonts.tar.gz
    curl -sSLo LICENSE-FSL-1.1-MIT https://raw.githubusercontent.com/runbooks-help/design-system/v0.3.0/LICENSE
    sha256sum tokens.css fonts.css fonts/* LICENSE-FSL-1.1-MIT
