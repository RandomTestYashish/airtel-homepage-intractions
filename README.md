# Airtel homepage interactions

Web prototype of the "Manage Landing" Figma screen (375 × 812), shown inside an iPhone mockup.
Plain HTML, CSS and JavaScript modules with no build step. Springs use [Motion](https://motion.dev),
vendored in `src/vendor/` so nothing is installed or fetched at runtime.

## Run

```
python3 serve.py
```

`serve.py` is Python's built-in file server with browser caching switched off, so a normal refresh
always shows the latest files.

Then open http://localhost:3000.

On a desktop browser the screen is shown inside an iPhone mockup. On a phone the mockup is dropped and
the screen fills the browser. Add `?view=mobile` or `?view=mockup` to the URL to force either mode.

Only **V1** and **V4** are published at the moment: `PUBLISHED` in `src/components/VariantSwitch.js` lists the versions
that are offered (with a single one the switch is hidden). With all five listed, the versions are switchable from the buttons at the top left of the desktop preview, from the small
V1 / V2 / V3 / V4 / V5 pill at the right edge on a phone, or with `?v=2` / `?v=3` / `?v=4` / `?v=5`:
**V1** shrinks the category tab icons once the page is scrolled; **V2** hides them and keeps only the titles;
**V3** is V1 with an iOS-style glass background on the header, category tabs and bottom navigation;
**V4** is V1 with a bottom navigation that never hides: its bar scales down in place while the page is
scrolling and returns to full size when scrolling stops;
**V5** has the new top nav: the selected category is a folder-tab shape that runs into the page, with a
filled icon, and once the page is scrolled it keeps only the titles, as V2 does. V5 also has its own
pages under the tabs: the All page (Claim Rewards, recommendations, add-ons, services, products) and the
Prepaid page (connection status, quick actions, rewards, benefits, data usage and the current pack).

## Layout

- `index.html` – entry page
- `src/App.js` – assembles the screen and wires the scroll behaviour
- `src/components/` – one module per UI piece (Header, BottomNavigation, PhoneFrame, …);
  `AllPageV5.js` and `PrepaidPage.js` hold the sections of V5's All and Prepaid tabs, styled in
  `src/styles/all-v5.css` and `src/styles/prepaid.css`
- `src/lib/` – motion presets, the central scroll logic, the infinite rail engine, press feedback
- `src/styles/tokens.css` – design tokens (colour, type, radius, motion)
- `src/assets/` – images and icons exported from Figma
- `reference/full.png` – Figma render of the screen, for comparison
- `src/vendor/motion.js` – Motion 14.0.0 browser bundle (MIT)
