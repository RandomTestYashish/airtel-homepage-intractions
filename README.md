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

## Layout

- `index.html` – entry page
- `src/App.js` – assembles the screen and wires the scroll behaviour
- `src/components/` – one module per UI piece (Header, BottomNavigation, PhoneFrame, …)
- `src/lib/` – motion presets, the central scroll logic, the infinite rail engine, press feedback
- `src/styles/tokens.css` – design tokens (colour, type, radius, motion)
- `src/assets/` – images and icons exported from Figma
- `reference/full.png` – Figma render of the screen, for comparison
- `src/vendor/motion.js` – Motion 14.0.0 browser bundle (MIT)
