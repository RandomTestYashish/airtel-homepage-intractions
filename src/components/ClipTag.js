import { asset } from "../lib/dom.js";

/** Ribbon-style tag that hangs over the top edge of a card. */
export function ClipTag({ label, tone = "red" }) {
  return `
    <span class="clip-tag clip-tag--${tone}">
      <img src="${asset(`cliptag-${tone}-left.svg`)}" alt="" />
      <span class="clip-tag__text">${label}</span>
      <img src="${asset(`cliptag-${tone}-right.svg`)}" alt="" />
    </span>
  `;
}
