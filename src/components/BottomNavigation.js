import { asset, el, selectOne } from "../lib/dom.js";
import { animate, transition } from "../lib/motion.js";

const ITEM_PITCH = 78; // 44px item + 34px gap

const DESTINATIONS = [
  { label: "Manage", icon: "bn-manage.svg", brand: true },
  { label: "Finance", icon: "bn-finance.svg" },
  { label: "Family", icon: "bn-family.svg" },
  { label: "Ask Us", icon: "bn-askus.svg", flip: true },
];

export function BottomNavigation({ onSelect } = {}) {
  const nav = el(`
    <nav class="bottom-nav" aria-label="Primary">
      <div class="bottom-nav__scrim"></div>
      <div class="bottom-nav__bar">
        <div class="bottom-nav__indicator"></div>
        <ul class="bottom-nav__items">
          ${DESTINATIONS.map(
            (item, index) => `
            <li>
              <button class="bottom-nav__item ${item.brand ? "bottom-nav__item--brand" : ""}" type="button"
                data-press="0.92" ${index === 0 ? 'aria-current="page"' : ""}>
                <span class="bottom-nav__icon">
                  <img ${item.flip ? 'class="icon--flip"' : ""} src="${asset(item.icon)}" alt="" />
                </span>
                ${item.label}
              </button>
            </li>`,
          ).join("")}
        </ul>
      </div>
    </nav>
  `);

  const indicator = nav.querySelector(".bottom-nav__indicator");
  const items = [...nav.querySelectorAll(".bottom-nav__item")];

  items.forEach((item, index) => {
    item.addEventListener("click", () => {
      selectOne(items, item, "aria-current", "page");
      animate(indicator, { x: index * ITEM_PITCH }, transition("pill"));
      onSelect?.(index);
    });
  });

  return nav;
}
