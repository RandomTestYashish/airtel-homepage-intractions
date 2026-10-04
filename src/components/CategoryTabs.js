import { asset, el } from "../lib/dom.js";
import { createRail } from "../lib/rail.js";

const TABS = [
  { label: "All", icon: "tab-all.svg" },
  { label: "Prepaid", icon: "tab-prepaid.svg" },
  { label: "Postpaid", icon: "tab-postpaid.svg", ribbon: "Unlimited" },
  { label: "Wi-Fi", icon: "tab-wifi.svg" },
  { label: "Digital TV", icon: "tab-dtv.svg" },
];

const selectedLayers = [...Array(4).fill("tab-selected-bg.svg"), "tab-selected-bg2.svg"]
  .map((file) => `<img src="${asset(file)}" alt="" />`)
  .join("");

export function CategoryTabs() {
  const root = el(`
    <div class="rail category-tabs" role="tablist" aria-label="Service type">
      <div class="rail__track">
        ${TABS.map(
          (tab, index) => `
          <button class="category-tab" type="button" role="tab" data-press="0.95" data-tab="${index}"
            aria-selected="${index === 0}">
            <span class="category-tab__scaler"><span class="category-tab__tile" data-press-target>
              <span class="category-tab__selected">${selectedLayers}</span>
              ${
                tab.ribbon
                  ? `<img class="category-tab__ribbon" src="${asset("tab-postpaid-ribbon.svg")}" alt="" />
                     <span class="category-tab__ribbon-text">${tab.ribbon}</span>`
                  : ""
              }
              <span class="category-tab__icon"><img src="${asset(tab.icon)}" alt="" /></span>
            </span></span>
            <span class="category-tab__label"><span>${tab.label}</span><span aria-hidden="true">${tab.label}</span></span>
            <span class="category-tab__underline"></span>
          </button>`,
        ).join("")}
      </div>
    </div>
  `);

  // Five fixed destinations: this rail has a start and an end rather than looping.
  const rail = createRail(root, { pad: 16, loop: false });

  root.addEventListener("click", (event) => {
    const tab = event.target.closest(".category-tab");
    if (!tab) return;
    root.querySelectorAll(".category-tab").forEach((copy) => {
      copy.setAttribute("aria-selected", String(copy.dataset.tab === tab.dataset.tab));
    });
    rail.centreOn(tab);
  });

  return root;
}
