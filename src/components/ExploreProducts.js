import { asset, el } from "../lib/dom.js";
import { SectionTitle } from "./SectionTitle.js";

const arrow = (top) =>
  `<span class="explore-card__arrow" style="top: ${top}px"><img src="${asset("arrow-right-18.svg")}" alt="" /></span>`;

const label = (text, top) => `<span class="explore-card__label" style="top: ${top}px">${text}</span>`;

export function ExploreProducts() {
  return el(`
    <section class="section">
      ${SectionTitle({ title: "Explore Airtel products", modifier: "section-title--lh14" })}
      <div class="explore">
        <button class="explore-card explore-card--postpaid pressable" type="button">
          <img src="${asset("ex-bg-postpaid.svg")}" alt="" style="top: 0; left: 0" />
          <img src="${asset("ex-fastlane.png")}" alt="" style="top: 8px; left: 60px; width: 31px; height: 34px" />
          ${label("Fast Lane\nPostpaid", 73)}
          ${arrow(88)}
        </button>
        <button class="explore-card explore-card--prepaid pressable" type="button">
          <img src="${asset("ex-ellipse-a.svg")}" alt="" style="top: -30px; left: 29px" />
          <img src="${asset("ex-ellipse-b.svg")}" alt="" style="top: -16px; left: 43px" />
          <img src="${asset("ex-shadow.svg")}" alt="" style="top: 35.5px; left: 64.1px; transform: rotate(-2.87deg)" />
          <img src="${asset("ex-sim.png")}" alt=""
            style="top: 6px; left: 55px; width: 44.6px; height: 37px; object-fit: cover" />
          ${label("Prepaid\nSIM", 74)}
          ${arrow(88)}
        </button>
        <button class="explore-card explore-card--wifi pressable" type="button">
          <img src="${asset("ex-bg-wifi.svg")}" alt="" style="top: 0; left: 0" />
          <img src="${asset("ex-wifi.png")}" alt=""
            style="top: 6px; left: 60.5px; width: 37px; height: 37px; object-fit: cover; opacity: 0.89" />
          ${label("Expert\nWi-Fi", 74)}
          ${arrow(89)}
        </button>
      </div>
    </section>
  `);
}
