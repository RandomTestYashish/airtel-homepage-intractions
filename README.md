# Airtel homepage interactions

Web prototype of the "Manage Landing" Figma screen (375 × 812), shown inside an iPhone mockup.
Plain HTML, CSS and JavaScript modules with no build step. Springs use [Motion](https://motion.dev),
vendored in `src/vendor/` so nothing is installed or fetched at runtime.

## Run

```
python3 -m http.server 3000
```

Then open http://localhost:3000.

## Layout

- `index.html` – entry page
- `src/App.js` – assembles the screen and wires the scroll behaviour
- `src/components/` – one module per UI piece (Header, BottomNavigation, PhoneFrame, …)
- `src/lib/` – motion presets, the central scroll logic, the infinite rail engine, press feedback
- `src/styles/tokens.css` – design tokens (colour, type, radius, motion)
- `src/assets/` – images and icons exported from Figma
- `reference/full.png` – Figma render of the screen, for comparison
- `src/vendor/motion.js` – Motion 14.0.0 browser bundle (MIT)
