# Coin Cubby — website

Static site for Coin Cubby, a coin sort and merge puzzle for iPhone:

- `index.html`: the landing page, with a playable four-pocket tray in the hero.
- `privacy.html`: the App Store Privacy Policy URL.
- `support.html`: the App Store Support URL.
- `404.html`: catches missing pages.

There is no build step for the pages, and nothing loads from other servers.

Live: https://nguyenvanlamm.github.io/coin-cubby-site/

Published by GitHub Pages from the root of `main`.

```bash
python3 -m http.server 8790 --directory ..   # then open http://localhost:8790/coin-cubby-site/
```

`404.html` uses `<base href="/coin-cubby-site/">`, so serve the parent folder as above to try it locally. If the site moves to another path or a custom domain, update that base.

## Design

The direction is the game's own: Terminal-Core Soft-Futurism (see `design-demos/round2/direction-approved.md` in the game repo).

- Warm charcoal ground and warm white text, with the tokens copied from `lib/ui/theme.dart`.
- One accent, annealed copper, used for the primary key, the wordmark cursor and the drop-target brackets.
- The twelve coin colours are the only saturated colour on the page.
- Keys look like the game's hardware buttons, and readouts and the console line look like its HUD.
- Fonts: Martian Mono (wordmark, headings, labels, numerals; the condensed width for two-digit coins) and Hanken Grotesk (sentences). Both come from the game's `assets/fonts/` and are subset to Latin WOFF2 (SIL Open Font License, see `assets/fonts/OFL-*.txt`).

## Coins and the tray demo

`tools/coins.mjs` draws the game's art as an inline SVG sprite: coins 1–12, their reeded edges, the star coin, the face-down coin, the stone, the clover and the padlock. Its colours are copied from `_coinColors` in the game, and every coin has its value notch at value × 30°. The script writes the sprite between `<!-- sprite:start -->` and `<!-- sprite:end -->` in each page:

```bash
node tools/coins.mjs index.html 404.html tools/share-card.html
```

`assets/site.js` runs the hero tray, using the game's rules in miniature:

- Tapping a pocket lifts its front group.
- A pocket holds ten coins.
- Ten of a kind merge into five of the next number.
- Deal! fills up to two empty pockets.

It respects `prefers-reduced-motion` and works from the keyboard.

## Images

- `assets/img/shots/*.webp`: 780×1688 WebP copies of 3× captures of the game's web build (Playwright, a 390×844 viewport). `play`, `home` and `stuck` come from `tool/screenshot_main.dart` (`?seed=7&warmup=300&tap=10` and `?seed=7&warmup=300&home=1`). `specials` and `win` come from a temporary entry that ran the bot until a star coin and a stone were on the tray, or until the tray was complete.
- `assets/img/shots/*-390.webp` are 390×844 copies of the same shots, served through `srcset` to phones (Pillow, LANCZOS, quality 82).
- `assets/img/icon-512.png`, `apple-touch-icon.png` and `favicon.png` are scaled from the game's `assets/icon/app_icon.png`. `favicon.svg` is a coin 12 with the copper cursor.
- `assets/img/icon-336.webp` is `icon-512.png` at 336 px for the Get it section (2× of its 168 px slot); `srcset` still offers the 512 px PNG to 3× screens.
- Share card: `assets/img/share-card.png` (1200×630) is the `og:image` of every page, rendered from `tools/share-card.html`:

  ```bash
  python3 -m http.server 8790 --directory .. &
  python3 tools/render-share-card.py http://127.0.0.1:8790/coin-cubby-site/
  ```

## Search and AI files

`sitemap.xml`, `llms.txt`, the JSON-LD in each page and the Markdown copies (`index.html.md`, `privacy.html.md`, `support.html.md`) all repeat the pages' text. When a page changes, update these in the same commit:

- its `.html.md`
- `llms.txt`
- the JSON-LD
- the sitemap `lastmod`

Crawlers read `robots.txt` only at the host root (`nguyenvanlamm.github.io/robots.txt`), which this repo cannot serve.

## Keep in step with the game

The privacy policy must match what the app really does, which today is:

- `PrivacyInfo.xcprivacy` declares no collected data and no tracking.
- `shared_preferences` holds the saved run, best coin, trays done, booster stock, coin gifts, credited purchase IDs and the mute setting.
- `in_app_purchase` talks to the App Store at launch and in the shop.

If the game adds analytics, ads, an account or sync, update `privacy.html` (and the App Store privacy answers) first. The booster rules and pack contents on the landing and support pages mirror `README.md` and `lib/ui/store.dart` in the game repo.

## When the iOS app ships

- **Get it** section: replace "Coming soon to the App Store" and the status line with the official App Store badge and link.
- Hero: replace the "App Store: coming soon" status with the badge, and the header's "Get it" key can link straight to the App Store.
- Add the `apple-itunes-app` meta tag (see the comment in `index.html`).
- JSON-LD in `index.html`: add the App Store URL to the game (`url`, or an `offers` with `"price": "0"`).
- Replace "coming soon" in `llms.txt`, `index.html.md`, the meta descriptions and the share card.
