import { asset, el } from "../lib/dom.js";
import { createRail } from "../lib/rail.js";
import { SectionTitle } from "./SectionTitle.js";

/** "Curated for you": wide banners in a free-scrolling, looping rail. */
export function CuratedBanners() {
  const banners = ["cur-1.png", "cur-2.png"];
  const section = el(`
    <section class="section section--bleed">
      ${SectionTitle({ title: "Curated for you", modifier: "section-title--curated" })}
      <div class="rail" style="--rail-gap: 20px">
        <div class="rail__track">
          ${banners
            .map(
              (file, index) => `
            <button class="banner pressable" type="button" aria-label="Offer ${index + 1} of ${banners.length}">
              <img src="${asset(file)}" alt="" />
            </button>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 17 });
  return section;
}

/**
 * "Recharge for others": Figma supplies this row as one flattened image, so each
 * card is a window onto that image, which lets the two packs loop like any rail.
 */
export function RechargeForOthers() {
  const packs = ["Box Office Pack, ₹200", "3GB per day for 3 days, ₹39"];
  const section = el(`
    <section class="section section--bleed">
      ${SectionTitle({ title: "Recharge for others", modifier: "section-title--recharge" })}
      <div class="rail" style="--rail-gap: 0px">
        <div class="rail__track">
          ${packs
            .map(
              (label, index) =>
                `<button class="recharge-card pressable" type="button" aria-label="${label}" style="--i: ${index}"></button>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 11.5 });
  return section;
}

/** "You might like": portrait cards in a free-scrolling, looping rail. */
export function YouMightLike() {
  const cards = [
    { file: "yml-1.png", label: "Get a free SIM. Add a loved one to your family plan" },
    { file: "yml-2.png", label: "Save ₹1200 a year. Combine services, save money" },
    { file: "yml-3.png", label: "More offers" },
  ];
  const section = el(`
    <section class="section section--bleed">
      ${SectionTitle({ title: "You might like", modifier: "section-title--likes" })}
      <div class="rail" style="--rail-gap: 16px">
        <div class="rail__track">
          ${cards
            .map(
              (card) => `
            <button class="like-card pressable" type="button" aria-label="${card.label}">
              <img src="${asset(card.file)}" alt="" />
            </button>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `);
  createRail(section.querySelector(".rail"), { pad: 20 });
  return section;
}

/**
 * "Featuring fresh": the design is centre-focused, so this is the one rail that
 * snaps. Slides scale continuously with their distance from the middle.
 */
export function FeaturingFresh() {
  const MIN_SCALE = 0.88; // 264px side card / 300px centre card
  const section = el(`
    <section class="section section--bleed">
      ${SectionTitle({ title: "Featuring fresh", modifier: "section-title--inset" })}
      <div class="rail fresh-rail" style="--rail-gap: -2px">
        <div class="rail__track">
          ${["ff-1.png", "ff-2.png", "ff-3.png"]
            .map(
              (file, index) => `
            <button class="fresh-card" type="button" aria-label="Featured offer ${index + 1} of 3">
              <img src="${asset(file)}" alt="" />
            </button>`,
            )
            .join("")}
        </div>
      </div>
    </section>
  `);

  const root = section.querySelector(".rail");
  const rail = createRail(root, {
    pad: 0,
    snap: "center",
    startIndex: 1, // the design opens on the middle card
    onRender({ x, items, viewport, pitch }) {
      for (const { el: slide, centre } of items) {
        const distance = Math.abs(centre + x - viewport / 2);
        if (distance > viewport) continue; // far off screen; leave as is
        const scale = 1 - (1 - MIN_SCALE) * Math.min(1, distance / pitch);
        slide.style.transform = `scale(${scale.toFixed(4)})`;
      }
    },
  });

  root.addEventListener("click", (event) => {
    const slide = event.target.closest(".fresh-card");
    if (slide) rail.centreOn(slide);
  });

  return section;
}
