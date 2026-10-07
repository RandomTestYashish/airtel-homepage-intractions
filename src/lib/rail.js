import { gesture, renderedScale } from "./gesture.js";
import { animate, reducedMotion, transition } from "./motion.js";

const DRAG_START = 6; // px before a press becomes a drag
const DECAY_MS = 350; // momentum time constant; close to iOS scroll deceleration
const MIN_VELOCITY = 0.015; // px/ms
const MAX_VELOCITY = 4;

const RUBBER_BAND = 0.35; // how much of an over-drag past an edge is shown

/**
 * Free-scrolling horizontal rail, infinite by default.
 *
 * Looping: the items are repeated enough times to cover the viewport and the
 * track is positioned with a transform taken modulo one set's width. Because
 * the wrap is a pure function of a continuous offset, there is never a reset
 * to jump. With `loop: false` the rail has two ends, resists being dragged
 * past them, and springs back.
 *
 * Markup: <div class="rail"><div class="rail__track">…items…</div></div>
 */
export function createRail(root, { pad = 16, loop = true, snap = false, startIndex = 0, onRender } = {}) {
  const track = root.querySelector(".rail__track");
  let items = []; // every rendered item (originals and clones) with its cached centre
  let setWidth = 0;
  let pitch = 0; // distance between neighbouring items
  let itemWidth = 0;
  let viewport = 0;
  let maxOffset = 0; // furthest scroll position when not looping
  let offset = 0; // unbounded scroll position in layout px
  let velocity = 0; // px/ms
  let frame = 0;
  let spring = null;
  let ready = false;

  // ---- layout -------------------------------------------------------------
  function layout() {
    const originals = [...track.children];
    viewport = root.clientWidth;
    if (!viewport || !originals.length) return requestAnimationFrame(layout);

    originals.forEach((item, index) => (item.dataset.railIndex = index));
    setWidth = originals.reduce(
      (sum, item) => sum + item.offsetWidth + parseFloat(getComputedStyle(item).marginRight),
      0,
    );
    itemWidth = originals[0].offsetWidth;
    pitch = setWidth / originals.length;

    const copy = () =>
      originals.map((item) => {
        const clone = item.cloneNode(true);
        clone.setAttribute("aria-hidden", "true"); // clones are visual only
        clone.tabIndex = -1;
        return clone;
      });
    if (loop) {
      track.prepend(...copy());
      for (let i = Math.ceil(viewport / setWidth); i > 0; i--) track.append(...copy());
    }
    maxOffset = Math.max(0, pad + setWidth - viewport); // the last item's gap is the trailing inset

    items = [...track.children].map((el) => ({ el, centre: el.offsetLeft + el.offsetWidth / 2 }));
    offset = snapBase() + startIndex * pitch;
    ready = true;
    render();
  }

  function render() {
    const wrapped = ((offset % setWidth) + setWidth) % setWidth;
    const x = loop ? pad - setWidth - wrapped : pad - offset;
    track.style.transform = `translate3d(${x}px, 0, 0)`;
    onRender?.({ x, items, viewport, pitch });
  }

  // ---- motion -------------------------------------------------------------
  const clamp = (value) => (loop ? value : Math.max(0, Math.min(maxOffset, value)));

  /** Past an edge the rail follows the finger at a fraction of its travel. */
  function rubberBand(value) {
    const edge = clamp(value);
    return edge + (value - edge) * RUBBER_BAND;
  }

  function halt() {
    cancelAnimationFrame(frame);
    spring?.stop();
    spring = null;
  }

  function rest() {
    velocity = 0;
    offset = Math.round(offset); // land on a whole pixel so text stays crisp
    render();
  }

  /** Offset at which item 0 sits on its snap line (centred, for `snap: "center"`). */
  function snapBase() {
    return snap === "center" ? pad + itemWidth / 2 - viewport / 2 : 0;
  }

  function nearestSnap(value) {
    const base = snapBase();
    return base + Math.round((value - base) / pitch) * pitch;
  }

  function springTo(target, initialVelocity = 0) {
    halt();
    spring = animate(offset, target, {
      ...transition("snap"),
      velocity: initialVelocity * 1000,
      onUpdate: (value) => {
        offset = value;
        render();
      },
      onComplete: rest,
    });
  }

  function glide(previous) {
    frame = requestAnimationFrame((now) => {
      const elapsed = Math.min(now - previous, 32);
      offset += velocity * elapsed;
      velocity *= Math.exp(-elapsed / DECAY_MS);
      render();
      if (offset !== clamp(offset)) springTo(clamp(offset), velocity); // ran into an end
      else if (Math.abs(velocity) < MIN_VELOCITY) rest();
      else glide(now);
    });
  }

  function release(releaseVelocity) {
    velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, releaseVelocity));
    if (offset !== clamp(offset)) {
      springTo(clamp(offset)); // released while over-dragged
    } else if (snap) {
      // Respect the flick: snap to wherever the momentum would have carried it.
      const throwDistance = reducedMotion.matches ? 0 : velocity * DECAY_MS * 0.6;
      springTo(nearestSnap(offset + throwDistance), velocity);
    } else if (reducedMotion.matches || Math.abs(velocity) < MIN_VELOCITY) {
      rest();
    } else {
      glide(performance.now());
    }
  }

  // ---- pointer (mouse + touch) -------------------------------------------
  let pressed = false;
  let dragging = false;
  let suppressClick = false;
  let scale = 1;
  let startX = 0;
  let startY = 0;
  let startOffset = 0;
  let samples = [];

  function onDown(event) {
    if (!ready || (event.pointerType === "mouse" && event.button !== 0)) return;
    halt();
    pressed = true;
    dragging = false;
    suppressClick = false;
    scale = renderedScale(root);
    startX = event.clientX;
    startY = event.clientY;
  }

  function onMove(event) {
    if (!pressed) return;
    const dx = event.clientX - startX;

    if (!dragging) {
      if (gesture.owner && gesture.owner !== root) return;
      const dy = event.clientY - startY;
      if (Math.abs(dy) > DRAG_START && Math.abs(dy) > Math.abs(dx)) return void (pressed = false);
      if (Math.abs(dx) < DRAG_START) return;
      dragging = true;
      gesture.owner = root;
      root.setPointerCapture(event.pointerId);
      root.classList.add("is-dragging");
      root.dispatchEvent(new CustomEvent("rail:dragstart", { bubbles: true }));
      startX = event.clientX; // rebase so the rail does not jump by the threshold
      startOffset = offset;
      samples = [];
    }

    offset = rubberBand(startOffset - (event.clientX - startX) / scale);
    samples.push({ time: event.timeStamp, offset });
    if (samples.length > 6) samples.shift();
    render();
  }

  function onUp(event) {
    if (!pressed) return;
    pressed = false;
    if (!dragging) return;
    dragging = false;
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 50);
    if (gesture.owner === root) gesture.owner = null;
    root.classList.remove("is-dragging");

    // Velocity over the last ~100ms of the drag; a pause before release means no throw.
    const recent = samples.filter((sample) => event.timeStamp - sample.time < 100);
    const first = recent[0];
    const last = recent[recent.length - 1];
    release(recent.length > 1 && last.time > first.time ? (last.offset - first.offset) / (last.time - first.time) : 0);
  }

  root.addEventListener("pointerdown", onDown);
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerup", onUp);
  root.addEventListener("pointercancel", onUp);
  window.addEventListener("pointerup", onUp);
  root.addEventListener(
    "click",
    (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );

  // ---- trackpad / shift-wheel --------------------------------------------
  let wheelTimer = 0;
  root.addEventListener(
    "wheel",
    (event) => {
      const horizontal = event.shiftKey ? event.deltaY || event.deltaX : event.deltaX;
      if (!ready || (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY))) return;
      event.preventDefault(); // keep the page from moving sideways or navigating back
      halt();
      offset = clamp(offset + horizontal);
      render();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => (snap ? springTo(nearestSnap(offset)) : rest()), 120);
    },
    { passive: false },
  );

  // ---- public -------------------------------------------------------------
  function centreOn(element) {
    const box = element.getBoundingClientRect();
    const frameBox = root.getBoundingClientRect();
    const delta = (box.left + box.width / 2 - (frameBox.left + frameBox.width / 2)) / renderedScale(root);
    springTo(clamp(offset + delta));
  }

  // Keyboard focus can land on an item that is currently off screen.
  root.addEventListener("focusin", (event) => {
    const item = event.target.closest(".rail__track > *");
    if (!item || !event.target.matches(":focus-visible")) return;
    const box = item.getBoundingClientRect();
    const frameBox = root.getBoundingClientRect();
    if (box.left < frameBox.left || box.right > frameBox.right) centreOn(item);
  });

  /**
   * Re-measure after the items' size or spacing changes, optionally with a new
   * leading inset. Only for rails with two ends: a looping rail's clones are
   * built once from the first layout.
   */
  function refresh(nextPad = pad) {
    pad = nextPad;
    if (loop || !ready) return; // not laid out yet: the first layout picks the inset up
    halt();
    const children = [...track.children];
    viewport = root.clientWidth;
    setWidth = children.reduce(
      (sum, item) => sum + item.offsetWidth + parseFloat(getComputedStyle(item).marginRight),
      0,
    );
    itemWidth = children[0].offsetWidth;
    pitch = setWidth / children.length;
    maxOffset = Math.max(0, pad + setWidth - viewport);
    items = children.map((el) => ({ el, centre: el.offsetLeft + el.offsetWidth / 2 }));
    offset = clamp(offset);
    render();
  }

  requestAnimationFrame(layout);
  return { centreOn, refresh };
}
