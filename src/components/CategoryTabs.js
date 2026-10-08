import { asset, el } from "../lib/dom.js";
import { animate, transition } from "../lib/motion.js";
import { createRail } from "../lib/rail.js";

const TABS = [
  { label: "All", icon: "tab-all.svg", iconV5: "tab5-all-outline.svg", filled: "tab5-all-filled.svg" },
  { label: "Prepaid", icon: "tab-prepaid.svg", filled: "tab5-prepaid-filled.svg" },
  { label: "Postpaid", icon: "tab-postpaid.svg", ribbon: "Unlimited", ribbonV5: "Priority" },
  { label: "Wi-Fi", icon: "tab-wifi.svg" },
  { label: "Digital TV", icon: "tab-dtv.svg" },
];

// V5 draws the selected tab as a folder-tab outline whose base line runs the width of
// the screen. The Figma vectors are drawn for one tab position each, so the same path
// is kept here with the tab's left edge at x = 0 and moved to whichever tab is selected.
// The tab is 10px wider than the tile on each side.
const BOX_INSET = 10;
const BOX_LINE =
  "M-500 110.973H-23C-10.298 110.973 0 100.676 0 87.9734V20.5C0 9.45431 8.954 0.5 20 0.5H63.91" +
  "C74.956 0.5 83.91 9.46183 83.91 20.5075V87.9694C83.91 100.672 94.207 110.973 106.91 110.973H900";
const BOX_FILL =
  "M-23 110.973C-10.298 110.973 0 100.676 0 87.9734V20C0 8.954 8.954 0 20 0H63.91" +
  "C74.956 0 83.91 8.954 83.91 20V87.9694C83.91 100.672 94.207 110.973 106.91 110.973Z";
// The line is strongest at the tab's left edge and fades out to either side.
const boxLine = (id, peak, colour) => `
  <linearGradient id="${id}" x1="-126" y1="55" x2="363" y2="62" gradientUnits="userSpaceOnUse">
    <stop stop-color="${colour}" stop-opacity="0" />
    <stop offset="0.2615" stop-color="${peak}" />
    <stop offset="0.4324" stop-color="${colour}" stop-opacity="0.6" />
    <stop offset="1" stop-color="${colour}" stop-opacity="0" />
  </linearGradient>`;
const boxShape = (tone) => `
  <g data-tone="${tone}">
    <path d="${BOX_FILL}" fill="url(#tab5-fill-${tone})" />
    <path d="${BOX_LINE}" stroke="url(#tab5-line-${tone})" />
  </g>`;
const toneOf = (tab) => (tab.dataset.tab === "0" ? "red" : "blue");

const selectedLayers = [...Array(4).fill("tab-selected-bg.svg"), "tab-selected-bg2.svg"]
  .map((file) => `<img src="${asset(file)}" alt="" />`)
  .join("");

export function CategoryTabs() {
  const root = el(`
    <div class="rail category-tabs" role="tablist" aria-label="Service type" data-tone="red">
      <svg class="category-tabs__box" aria-hidden="true" width="84" height="112" viewBox="0 0 84 112" fill="none">
        <defs>
          <linearGradient id="tab5-fill-red" x1="0" y1="0" x2="0" y2="111" gradientUnits="userSpaceOnUse">
            <stop stop-color="#fff" /><stop offset="1" stop-color="#FDD9D9" />
          </linearGradient>
          <linearGradient id="tab5-fill-blue" x1="0" y1="0" x2="0" y2="112.7" gradientUnits="userSpaceOnUse">
            <stop stop-color="#fff" /><stop offset="0.6" stop-color="#fff" /><stop offset="0.8" stop-color="#F7FBFC" /><stop offset="1" stop-color="#F1F8FB" />
          </linearGradient>
          ${boxLine("tab5-line-red", "#FB5C74", "#FA233B")}
          ${boxLine("tab5-line-blue", "#9CBFF6", "#9CBFF6")}
        </defs>
        ${boxShape("red")}
        ${boxShape("blue")}
      </svg>
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
                     <span class="category-tab__ribbon-text">${tab.ribbon}</span>
                     <span class="category-tab__ribbon-text category-tab__ribbon-text--v5">${tab.ribbonV5}</span>`
                  : ""
              }
              <span class="category-tab__icon"><img src="${asset(tab.icon)}" alt="" />${
                tab.iconV5 ? `<img class="category-tab__icon-v5" src="${asset(tab.iconV5)}" alt="" />` : ""
              }</span>
              ${
                tab.filled
                  ? `<span class="category-tab__icon category-tab__icon--filled"><img src="${asset(tab.filled)}" alt="" /></span>`
                  : ""
              }
            </span></span>
            <span class="category-tab__label"><span>${tab.label}</span><span aria-hidden="true">${tab.label}</span></span>
          </button>`,
        ).join("")}
      </div>
      <span class="category-tabs__indicator" aria-hidden="true" hidden></span>
    </div>
  `);

  // One line for the whole row: it slides from the old tab to the new one rather than
  // each tab showing and hiding its own. It sits outside the track, so its position is
  // the track's own offset plus its place along the tabs, and either can move at once.
  const indicator = root.querySelector(".category-tabs__indicator");
  const box = root.querySelector(".category-tabs__box");
  const lineX = (tab) => tab.offsetLeft + (tab.offsetWidth - indicator.offsetWidth) / 2;
  let selected = root.querySelector('.category-tab[aria-selected="true"]');
  let trackX = 0;
  let indicatorX = 0;
  let slide = null;
  // The V5 shape rides with the line, so one slide moves both.
  const placeIndicator = () => {
    indicator.style.transform = `translate3d(${trackX + indicatorX}px, 0, 0)`;
    const lineInset = (selected.offsetWidth - indicator.offsetWidth) / 2;
    box.style.transform = `translate3d(${trackX + indicatorX - lineInset - BOX_INSET}px, 0, 0)`;
  };

  // Five fixed destinations: this rail has a start and an end rather than looping.
  const rail = createRail(root, {
    pad: 16,
    loop: false,
    onRender({ x }) {
      trackX = x;
      if (indicator.hidden) {
        indicator.hidden = false; // first layout: start under the selected tab, without a slide
        indicatorX = lineX(selected);
      }
      placeIndicator();
    },
  });

  root.addEventListener("click", (event) => {
    const tab = event.target.closest(".category-tab");
    if (!tab || tab === selected) return;
    selected = tab;
    root.dataset.tone = toneOf(tab);
    root.dispatchEvent(new CustomEvent("tabchange", { bubbles: true, detail: { index: Number(tab.dataset.tab) } }));
    root.querySelectorAll(".category-tab").forEach((copy) => {
      copy.setAttribute("aria-selected", String(copy.dataset.tab === tab.dataset.tab));
    });
    rail.centreOn(tab);

    // A tap mid-slide carries on from wherever the line has reached.
    slide?.stop();
    slide = animate(indicatorX, lineX(tab), {
      ...transition("indicator"),
      onUpdate(value) {
        indicatorX = value;
        placeIndicator();
      },
    });
  });

  /** A version with different tab spacing calls this once its styles apply. */
  root.relayout = (pad) => {
    rail.refresh(pad);
    slide?.stop();
    if (!indicator.hidden) {
      indicatorX = lineX(selected);
      placeIndicator();
    }
  };

  return root;
}
