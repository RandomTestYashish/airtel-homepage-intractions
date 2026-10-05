// Motion (https://motion.dev) is vendored as a classic script and exposes `window.Motion`.
const { animate } = window.Motion;

export { animate };

export const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const spring = (visualDuration, bounce = 0) => ({ type: "spring", visualDuration, bounce });

// One motion system for the whole prototype: quick response, low bounce, smooth settle.
const TRANSITIONS = {
  press: spring(0.14),
  release: spring(0.26, 0.28),
  header: { type: "spring", stiffness: 400, damping: 35, mass: 0.8 }, // ~300ms, no overshoot
  // Side menu: a slow ease in and out rather than a spring, so it never darts in
  drawerIn: { duration: 0.52, ease: [0.45, 0, 0.15, 1] },
  drawerOut: { duration: 0.4, ease: [0.45, 0, 0.15, 1] },
  scrimIn: { duration: 0.48, ease: "easeInOut" },
  scrimOut: { duration: 0.36, ease: "easeInOut" },
  chevron: { duration: 0.42, ease: [0.4, 0, 0.2, 1] }, // menu chevron morph: no spring, so no overshoot
  bar: spring(0.28), // bottom nav following the scroll direction
  settle: spring(0.38, 0.16), // bottom nav returning once scrolling rests
  pill: spring(0.34, 0.2),
  reveal: spring(0.5),
  snap: { type: "spring", stiffness: 260, damping: 30 },
};

/** Named transition, collapsed to an effectively instant one under reduced motion. */
export function transition(name) {
  return reducedMotion.matches ? { duration: 0.01 } : TRANSITIONS[name];
}
