/**
 * The single scroll listener for the page. It turns raw scroll events into a
 * few meaningful signals: header hidden/shown, bottom nav hidden/shown, scroll
 * progress, and "scrolling has come to rest". The header leaves on a downward
 * scroll and only comes back at the top; the bottom nav also returns on the
 * way up and whenever scrolling rests.
 */
const TOP_ZONE = 6; // px from the top where the chrome is always visible
const HIDE_DISTANCE = 10; // slow scrolls must travel this far before the chrome hides
const FAST_VELOCITY = 0.5; // px/ms; a flick hides the chrome almost at once
const FAST_DISTANCE = 8;
const SHOW_DISTANCE = 8; // upward travel that brings the chrome back
const STOP_DELAY = 400; // ms without scroll events before the page counts as at rest

export function createScrollMotion(page, { onHeader, onNav, onProgress, onScroll }) {
  let lastY = page.scrollTop;
  let lastTime = performance.now();
  let anchor = lastY;
  let direction = 0;
  let velocity = 0;
  let headerHidden = false;
  let navHidden = false;
  let ticking = false;
  let stopTimer = 0;

  function setHeader(hidden) {
    if (hidden === headerHidden) return;
    headerHidden = hidden;
    onHeader(hidden);
  }

  function setNav(hidden, reason) {
    if (hidden === navHidden) return;
    navHidden = hidden;
    onNav(hidden, reason);
  }

  function onRest() {
    velocity = 0;
    anchor = lastY; // the next hide needs fresh, deliberate travel
    setNav(false, "rest");
  }

  function update(now) {
    ticking = false;
    const max = page.scrollHeight - page.clientHeight;
    const y = Math.max(0, Math.min(page.scrollTop, max)); // ignore rubber-banding
    const delta = y - lastY;
    const next = Math.sign(delta);

    if (next !== 0) {
      velocity = 0.7 * (delta / Math.max(now - lastTime, 1)) + 0.3 * velocity;
      if (next !== direction) {
        direction = next;
        anchor = lastY;
      }
    }
    lastY = y;
    lastTime = now;
    onProgress?.(y);

    if (y <= TOP_ZONE) {
      setHeader(false);
      setNav(false, "top");
    } else if (direction > 0) {
      const travelled = y - anchor;
      if (travelled > HIDE_DISTANCE || (velocity > FAST_VELOCITY && travelled > FAST_DISTANCE)) {
        setHeader(true);
        setNav(true, "scroll");
      }
    } else if (direction < 0 && anchor - y > SHOW_DISTANCE) {
      setNav(false, "scroll"); // the header waits for the top of the page
    }

    clearTimeout(stopTimer);
    stopTimer = setTimeout(onRest, STOP_DELAY);
  }

  page.addEventListener(
    "scroll",
    () => {
      onScroll?.(Math.max(0, page.scrollTop)); // position-critical work stays in step with the scroll
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );

  return {
    /** Bring everything back, e.g. when keyboard focus lands on a hidden bar. */
    reveal() {
      anchor = lastY;
      setHeader(false);
      setNav(false, "focus");
    },
  };
}
