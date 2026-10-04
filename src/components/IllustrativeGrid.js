import { asset, el } from "../lib/dom.js";
import { ClipTag } from "./ClipTag.js";
import { SectionTitle } from "./SectionTitle.js";

function Tile({ label, image, tag }) {
  return `
    <button class="tile card-surface pressable" type="button">
      <img class="tile__image" src="${asset(image)}" alt="" />
      ${tag ? ClipTag({ label: tag, tone: "dark" }) : ""}
      <span class="tile__label">${label}</span>
    </button>
  `;
}

/** Three-column grid of illustrated tiles, with an optional title row. */
export function IllustrativeGrid({ title, link, items, gap = 17 }) {
  return el(`
    <section class="section">
      ${title ? SectionTitle({ title, link }) : ""}
      <div class="tile-grid" style="--tile-gap: ${gap}px">${items.map(Tile).join("")}</div>
    </section>
  `);
}
