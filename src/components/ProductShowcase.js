import { asset, el } from "../lib/dom.js";
import { createRail } from "../lib/rail.js";

export const BENEFITS = [
  { title: "Adobe Express", body: "12 months for FREE worth ₹4000", cta: "CLAIM NOW", logo: "sc-logo-adobe.png" },
  { title: "Netflix", body: "1 month FREE\nworth ₹999", cta: "CLAIM NOW", logo: "sc-logo-netflix.png" },
  { title: "Lorem ipsum", body: "Lorem ipsum dolor sit amet consectetur.", cta: "BUTTON", logo: "sc-logo-default.png" },
];

export function ShowcaseTile({ title, body, cta, logo, arrow = "arrow-right-16.svg" }) {
  return `
    <button class="showcase-tile pressable" type="button">
      <img class="showcase-tile__logo" src="${asset(logo)}" alt="" />
      <span class="showcase-tile__text">
        <span class="showcase-tile__title">${title}</span>
        <span class="showcase-tile__body">${body}</span>
      </span>
      <span class="showcase-tile__cta">${cta}<span><img src="${asset(arrow)}" alt="" /></span></span>
    </button>
  `;
}

export function ProductShowcase() {
  const section = el(`
    <section class="showcase" aria-label="Claim your benefits">
      <img class="showcase__bg" src="${asset("sc-bg.png")}" alt="" />
      <h2 class="showcase__title">Claim</h2>
      <p class="showcase__subtitle">Your benefits</p>
      <div class="rail showcase__cards" style="--rail-gap: 12px">
        <div class="rail__track">${BENEFITS.map(ShowcaseTile).join("")}</div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 16, loop: false });
  return section;
}
