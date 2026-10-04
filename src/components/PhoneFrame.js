import { el } from "../lib/dom.js";

const PHONE_W = 399;
const PHONE_H = 836;
const MARGIN = 24;

/** Dark presentation stage with an iPhone shell around a fixed 375 × 812 screen. */
export function PhoneFrame() {
  const stage = el(`
    <div class="stage">
      <div class="phone">
        <div class="phone__screen" data-header="visible" data-nav="visible" data-scrolled="false">
          <div class="phone__island" aria-hidden="true"></div>
          <div class="phone__home-indicator" aria-hidden="true"></div>
        </div>
      </div>
    </div>
  `);

  // Scale the whole phone down on short or narrow windows; never the layout inside it.
  function fit() {
    const scale = Math.min(1, (window.innerHeight - MARGIN * 2) / PHONE_H, (window.innerWidth - MARGIN * 2) / PHONE_W);
    stage.style.setProperty("--phone-scale", Math.max(0.3, scale).toFixed(4));
  }
  fit();
  window.addEventListener("resize", fit);

  return { stage, screen: stage.querySelector(".phone__screen") };
}
