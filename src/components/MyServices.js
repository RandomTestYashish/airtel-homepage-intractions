import { asset, el } from "../lib/dom.js";
import { SectionTitle } from "./SectionTitle.js";

const NOTICE = "Prepaid expiring in 1 day";
const asterisks = Array(4).fill(`<img src="${asset("asterisk.svg")}" alt="" />`).join("");

export function MyServices() {
  return el(`
    <section class="section">
      ${SectionTitle({ title: "My services", modifier: "section-title--tight" })}
      <div class="services">
        <button class="service-card card-surface pressable" type="button" aria-label="5 Services. ${NOTICE}">
          <img class="service-card__avatar" src="${asset("svc-avatar.png")}" alt="" />
          <span class="service-card__title">5 Services</span>
          <span class="service-card__marquee" aria-hidden="true">
            <span class="service-card__marquee-track"><span>${NOTICE}</span><span>${NOTICE}</span></span>
          </span>
        </button>
        <button class="service-card card-surface pressable" type="button" aria-label="Account ending 9929, balance hidden">
          <img class="service-card__ellipse" src="${asset("svc-ellipse.svg")}" alt="" />
          <img class="service-card__logo" src="${asset("svc-logo.png")}" alt="" />
          <span class="service-card__title">XXX9929</span>
          <span class="service-card__currency">₹</span>
          <span class="service-card__mask">${asterisks}</span>
        </button>
      </div>
    </section>
  `);
}
