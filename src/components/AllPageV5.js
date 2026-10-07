import { asset, el } from "../lib/dom.js";
import { createRail } from "../lib/rail.js";
import { IconAction } from "./IconActionGrid.js";
import { IllustrativeGrid } from "./IllustrativeGrid.js";
import { BENEFITS, ShowcaseTile } from "./ProductShowcase.js";
import { SectionTitle } from "./SectionTitle.js";

const SERVICES_ROW = [
  { label: "Recharge", icon: "ia-recharge.svg", highlight: true, tag: "Zero fees" },
  { label: "Pay Bills", icon: "ia-paybills.svg" },
  { label: "Check Safety Report", icon: "all5-ia-safety.svg" },
  { label: "International Roaming", icon: "ia-roaming.svg" },
];

const gift = `<img src="${asset("all5-gift.png")}" alt="" />`;

/** Pink "Claim Rewards" hero that the red folder tab runs into, with the benefit tiles on it. */
function ClaimRewards() {
  // Same benefits as the older showcase, with this frame's blue arrows.
  const tiles = BENEFITS.map((benefit, index) =>
    ShowcaseTile({ ...benefit, arrow: index === 2 ? "all5-arrow-16-blue-b.svg" : "all5-arrow-16-blue.svg" }),
  ).join("");
  const section = el(`
    <section class="all5 claim5" aria-label="Claim rewards">
      <span class="claim5__gift claim5__gift--left" aria-hidden="true">${gift}</span>
      <span class="claim5__gift claim5__gift--right" aria-hidden="true">${gift}</span>
      <span class="claim5__gift claim5__gift--small" aria-hidden="true">${gift}</span>
      <h2 class="claim5__title"><span aria-hidden="true">Claim Rewards</span><span>Claim Rewards</span></h2>
      <p class="claim5__subtitle">Plan Benefits</p>
      <div class="rail claim5__cards" style="--rail-gap: 12px">
        <div class="rail__track">${tiles}</div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 16, loop: false });
  return section;
}

function Recommended() {
  const section = el(`
    <section class="all5 section section--bleed reco5">
      ${SectionTitle({ title: "Recommended for you", modifier: "section-title--inset reco5__title" })}
      <div class="rail" style="--rail-gap: 12px">
        <div class="rail__track">
          <button class="reco5-card reco5-card--family pressable" type="button">
            <span class="reco5-card__title">Add Family Members</span>
            <span class="reco5-card__people" aria-hidden="true">
              <i><img src="${asset("all5-plus.svg")}" alt="" /></i>
              <i><img src="${asset("all5-plus.svg")}" alt="" /></i>
              <i class="reco5-card__you">You</i>
            </span>
            <span class="reco5-card__body">Manage connections, bills &amp; support in one place</span>
            <img class="reco5-card__arrow" src="${asset("all5-arrow-18.svg")}" alt="" />
          </button>
          <button class="reco5-card reco5-card--secure pressable" type="button">
            <img class="reco5-card__logo" src="${asset("all5-airtel-secure.svg")}" alt="Airtel Secure" />
            <span class="reco5-card__body">Airtel’s AI Protection keeping you safe from Spam calls</span>
          </button>
        </div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 16, loop: false });
  return section;
}

function AddOns() {
  // One flat artwork in the Figma frame: the two pack cards are part of the image.
  return el(`
    <section class="all5 section section--bleed addons5">
      ${SectionTitle({ title: "Exclusive add-ons for your pack", modifier: "section-title--inset" })}
      <img class="addons5__art" src="${asset("all5-addons.png")}" alt="Box Office Pack ₹200, and 3GB a day for 3 days ₹39" />
    </section>
  `);
}

function Services() {
  return el(`
    <section class="all5 section services5">
      ${SectionTitle({ title: "My services", modifier: "title5" })}
      <button class="service5 card-surface pressable" type="button">
        <img class="service5__avatar" src="${asset("all5-service-avatar.png")}" alt="" />
        <span class="service5__text">
          <span class="service5__title">+91 9319590283</span>
          <span class="service5__sub">1.64GB daily data left | Rs.20.4 talktime</span>
        </span>
        <img src="${asset("all5-chevron-20.svg")}" alt="" />
      </button>
    </section>
  `);
}

function Explore() {
  return el(`
    <section class="all5 section explore5">
      ${SectionTitle({ title: "Explore Airtel services", modifier: "title5" })}
      <div class="icon-actions explore5__grid">
        ${SERVICES_ROW.map(IconAction).join("")}
        <button class="icon-action icon-action--wide" type="button" data-press="0.96">
          <span class="icon-action__pill" data-press-target>
            <span class="icon-action__swooshes" aria-hidden="true">
              <i><img src="${asset("all5-upi-swoosh-a.svg")}" alt="" /></i>
              <i><img src="${asset("all5-upi-swoosh-b.svg")}" alt="" /></i>
            </span>
            <img class="icon-action__upi" src="${asset("all5-upi-logo.svg")}" alt="" />
            <span class="icon-action__offer">Earn ₹100 Cashback</span>
          </span>
          <span>Activate your Airtel UPI</span>
        </button>
        ${IconAction({ label: "Manage Family", icon: "ia-family.svg" })}
        ${IconAction({ label: "More" })}
      </div>
    </section>
  `);
}

/** V5's All tab: the sections shown under the category tabs when "All" is selected. */
export function AllPageV5({ products }) {
  const grid = IllustrativeGrid({ title: "Buy Airtel products", link: "View all", items: products });
  grid.classList.add("all5", "products5");
  return [ClaimRewards(), Recommended(), AddOns(), Services(), Explore(), grid];
}
