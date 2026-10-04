import { asset, el } from "../lib/dom.js";
import { SectionTitle } from "./SectionTitle.js";

const ACTIONS = [
  { label: "Recharge", icon: "ia-recharge.svg", highlight: true },
  { label: "Pay Bills", icon: "ia-paybills.svg" },
  { label: "Claim OTTs & More", icon: "ia-claim.svg" },
  { label: "International Roaming", icon: "ia-roaming.svg" },
  { label: "My Wi-Fi", icon: "ia-wifi.svg" },
  { label: "Upgrade to Postpaid", icon: "ia-upgrade.svg" },
  { label: "Manage Family", icon: "ia-family.svg" },
  { label: "More" },
];

const moreGlyph = `<span class="icon-more"><i></i><i></i><i></i><i></i></span>`;

function IconAction({ label, icon, highlight }) {
  return `
    <button class="icon-action" type="button" data-press="0.94">
      <span class="icon-action__disc" data-press-target>
        ${highlight ? `<img class="icon-action__ring" src="${asset("ib-flourish.svg")}" alt="" />` : ""}
        <span class="icon-action__glyph">${icon ? `<img src="${asset(icon)}" alt="" />` : moreGlyph}</span>
      </span>
      <span>${label}</span>
    </button>
  `;
}

export function IconActionGrid() {
  return el(`
    <section class="section" style="margin-top: 34px">
      ${SectionTitle({ title: "Manage services" })}
      <div class="icon-actions">${ACTIONS.map(IconAction).join("")}</div>
    </section>
  `);
}
