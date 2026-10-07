import { asset, el } from "../lib/dom.js";
import { createRail } from "../lib/rail.js";
import { Button } from "./Button.js";
import { IconAction } from "./IconActionGrid.js";
import { SectionTitle } from "./SectionTitle.js";

const ACTIONS = [
  { label: "Get Int’l<br />Roaming", icon: "pp-ia-roaming.svg", flip: true },
  { label: "Recharge any number", icon: "pp-ia-recharge.svg", highlight: true },
  { label: "Get add-on data", icon: "pp-ia-topup.svg" },
  { label: "View more actions", icon: "pp-ia-more.svg" },
];

// Each logo is the Figma artwork as exported: a background layer and the mark over it.
const REWARDS = [
  {
    title: "Xstream Play",
    body: "Watch live TV shows, movies with Premium",
    logo: `<img src="${asset("pp-logo-xstream-bg.svg")}" alt="" />
           <img class="pp-tile__mark" style="inset: 34.79% 9.1% 34.8%" src="${asset("pp-logo-xstream.svg")}" alt="" />`,
  },
  {
    title: "Adobe Express",
    body: "12 months for FREE\nworth ₹4000",
    logo: `<img class="pp-tile__masked" src="${asset("pp-logo-adobe.png")}" alt="" />`,
  },
  {
    title: "Perplexity Pro",
    body: "Check your subscription days",
    logo: `<img src="${asset("pp-logo-perplexity-bg.svg")}" alt="" />
           <img class="pp-tile__mark" style="inset: 13.69% 18.75%" src="${asset("pp-logo-perplexity.svg")}" alt="" />`,
  },
];

function Hero() {
  return el(`
    <section class="pp pp-hero" aria-label="Your prepaid connection">
      <span class="pp-hero__glow" aria-hidden="true"><img src="${asset("pp-glow.png")}" alt="" /></span>
      <span class="pp-hero__rings" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
      <p class="pp-hero__status"><span></span>Connection Active</p>
      <img class="pp-hero__sim" src="${asset("pp-sim.png")}" alt="" />
      <h2 class="pp-hero__title">Welcome to Airtel</h2>
      <p class="pp-hero__number">+91 - 9876543211</p>
      <p class="pp-hero__caption">The Safe Network</p>
    </section>
  `);
}

function Actions() {
  return el(`
    <section class="pp pp-actions" aria-label="Quick actions">
      <div class="icon-actions icon-actions--row">${ACTIONS.map(IconAction).join("")}</div>
    </section>
  `);
}

function RewardTile({ title, body, logo }) {
  return `
    <button class="pp-tile card-surface pressable" type="button">
      <span class="pp-tile__logo">${logo}</span>
      <span class="pp-tile__text">
        <span class="pp-tile__title">${title}</span>
        <span class="pp-tile__body">${body}</span>
      </span>
      <span class="pp-link">Claim Now<img src="${asset("pp-arrow-20.svg")}" alt="" /></span>
    </button>
  `;
}

function Rewards() {
  const section = el(`
    <section class="pp section section--bleed">
      ${SectionTitle({ title: "Rewards &amp; Benefits", link: "View All", modifier: "section-title--inset section-title--lh14 pp-title" })}
      <div class="rail pp-rail" style="--rail-gap: 8px">
        <div class="rail__track">${REWARDS.map(RewardTile).join("")}</div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 16, loop: false });
  return section;
}

function Benefits() {
  // The Figma frame has empty image placeholders here; they are kept as designed.
  const card = `<span class="pp-benefit"><img src="${asset("pp-benefit-placeholder.png")}" alt="" /></span>`;
  const section = el(`
    <section class="pp section section--bleed">
      <div class="pp-heading">
        <div>
          <h2 class="section-title__text">Prepaid Benefits</h2>
          <p class="pp-heading__sub">Here's what's now yours:</p>
        </div>
        <span class="pp-pager" aria-hidden="true"><i></i><i></i><i></i></span>
      </div>
      <div class="rail pp-rail" style="--rail-gap: 20px">
        <div class="rail__track">${card}${card}</div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 16, loop: false });
  return section;
}

function Usage() {
  return el(`
    <section class="pp section" aria-label="Data usage">
      <div class="pp-usage">
        <p class="pp-usage__figure"><strong>2</strong><span>GB left</span></p>
        <div class="pp-meter">
          <p class="pp-meter__label">4G daily data</p>
          <div class="pp-meter__track" role="progressbar" aria-valuemin="0" aria-valuemax="2" aria-valuenow="2"
            aria-label="4G daily data left"><span></span></div>
          <p class="pp-meter__hints"><span>Renews at midnight (12:00 AM)</span><span>of 2 GB</span></p>
        </div>
        <div class="pp-usage__facts">
          <span><img src="${asset("pp-call.svg")}" alt="" />₹7.94 Talktime left</span>
          <span><img src="${asset("pp-sms.svg")}" alt="" />100 SMS/day left</span>
        </div>
        <div class="pp-usage__buttons">
          ${Button({ label: "Buy Top-up Data", variant: "primary" })}
          <button class="pp-link pressable" type="button">Track Data Usage</button>
        </div>
      </div>
    </section>
  `);
}

function Pack() {
  return el(`
    <section class="pp section">
      ${SectionTitle({ title: "Your Current Packs", modifier: "section-title--lh14 pp-title" })}
      <div class="pp-plan card-surface">
        <div class="pp-plan__head">
          <div>
            <p class="pp-plan__price"><strong>₹199</strong><span>/28 days</span></p>
            <p class="pp-plan__sub">Unlimited calls</p>
          </div>
          <span class="pp-tag">Active</span>
        </div>
        <dl class="pp-plan__pairs">
          <div><dd>2 GB</dd><dt>Data</dt></div>
          <div><dd>20 Jul 2026</dd><dt>Valid till</dt></div>
          <div>
            <dd class="pp-otts">
              <span><img src="${asset("pp-ott-prime.svg")}" alt="Prime Video" /></span>
              <span>
                <img src="${asset("pp-ott-netflix-ring.svg")}" alt="" />
                <img class="pp-otts__fill" src="${asset("pp-ott-netflix-bg.svg")}" alt="" />
                <img class="pp-otts__netflix" src="${asset("pp-ott-netflix.png")}" alt="Netflix" />
              </span>
              <span>
                <img src="${asset("pp-ott-zee5-ring.svg")}" alt="" />
                <img class="pp-otts__fill" src="${asset("pp-ott-zee5.png")}" alt="Zee5" />
              </span>
              <span class="pp-otts__more">+9</span>
            </dd>
            <dt>Benefits</dt>
          </div>
        </dl>
        <div class="pp-plan__actions">
          <button class="pp-link pressable" type="button">View Details</button>
          ${Button({ label: "Recharge", variant: "secondary" })}
        </div>
      </div>
    </section>
  `);
}

/** The Prepaid tab's page: the sections shown under the category tabs when it is selected. */
export function PrepaidPage() {
  return [Hero(), Actions(), Rewards(), Benefits(), Usage(), Pack()];
}
