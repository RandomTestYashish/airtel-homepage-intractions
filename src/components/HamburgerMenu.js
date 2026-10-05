import { el } from "../lib/dom.js";
import { enableDragScroll } from "../lib/dragScroll.js";
import { animate, transition } from "../lib/motion.js";

const PROFILE = { name: "Yashish .", phone: "9716317936" };

const SERVICES = [
  {
    name: "Postpaid • 0987654321",
    open: true,
    actions: ["Call Manager", "View Bills and Payments", "Activate International Roaming", "View Plan Details"],
  },
  { name: "Prepaid • 0987654321" },
  { name: "Wi-Fi • 01234567897_dsl" },
  { name: "DTH • 0123456789876" },
];

// `y` is each row's top in the Figma frame; its icon is cut from the design's
// screenshots at that position (see .menu-art in menu.css).
const ROWS = [
  { y: 320, title: "My Active Services", text: "View and manage your plans & services", chevron: true, services: true },
  { y: 389, title: "New Connections", text: "Buy new Postpaid, Prepaid, Wi-Fi & more", chevron: true },
  { y: 458, title: "Airtel Financial Services", text: "Apply for instant loans, credit cards, FDs", chevron: true },
  { y: 527, title: "Recharge & Pay Bills", text: "Pay for mobile, electricity, FASTag & more", chevron: true },
  { y: 596, title: "Bank and UPI", text: "Manage your Banking and UPI services", chevron: true },
  { y: 664, title: "Rewards & OTTs", text: "Claim top OTTs, data coupons & more", chevron: true },
  { y: 733, title: "Set Hellotunes", text: "Set your favourite tunes for your callers" },
  { y: 802, title: "Refer and Earn", text: "Get ₹300 discount coupon on each referral" },
  { y: 871, title: "Safety Report", text: "Check no. of prevented fraud attempts" },
  { y: 940, title: "Orders & Requests", text: "Track your orders & view status of requests" },
  { y: 1009, title: "Transaction History", text: "View past payments & UPI transfers" },
  { y: 1078, title: "Settings", text: "Accounts, payments & bank, privacy & security" },
  { y: 1146, title: "About Airtel", text: "Latest updates about our brand and policies", chevron: true },
  { y: 1215, title: "Customer Care", text: "Customer grievance" },
  { y: 1284, title: "Log Out" },
];

const SHOT_SPLIT = 802; // frame y where the design's second screenshot takes over
const escapeHtml = (text) => text.replace(/&/g, "&amp;");
/**
 * Chevron outline at `p`: 1 points down, -1 points up, and 0 is a dot at the glyph's centre.
 * The arms are redrawn rather than scaled or rotated, so the stroke keeps its weight and
 * the glyph stays centred the whole way through.
 */
function chevronPath(p) {
  const w = (Math.max(Math.abs(p), 0.001) * 7).toFixed(3);
  const h = p * 3.5;
  return `M${10 - w} ${(10.5 - h).toFixed(3)}L10 ${(10.5 + h).toFixed(3)}L${10 + +w} ${(10.5 - h).toFixed(3)}`;
}

// Inline rather than an <img>, so the path can be morphed and stays crisp at its fractional size.
const Chevron = (open = false) => `
  <svg class="menu-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="${chevronPath(open ? -1 : 1)}" stroke="#000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`;

/** A small window onto one of the design's screenshots, at frame position (x, y). */
function art(x, y, className = "") {
  const shot = y >= SHOT_SPLIT ? "menu-art--2" : "";
  return `<span class="menu-art ${shot} ${className}" style="--x: ${x}px; --y: ${y}px" aria-hidden="true"></span>`;
}

function Service({ name, actions, open }, index) {
  const expandable = Boolean(actions);
  return `
    <li class="menu-service">
      <button class="menu-service__row" type="button"
        ${expandable ? `aria-expanded="${Boolean(open)}" aria-controls="menu-service-${index}"` : ""}>
        <span class="menu-service__name">${name}</span>
        ${Chevron(open)}
      </button>
      ${
        expandable
          ? `<div class="menu-collapse" id="menu-service-${index}">
              <div class="menu-collapse__inner">
                <ul class="menu-service__actions">
                  ${actions.map((action) => `<li><button class="menu-service__action" type="button">${action}</button></li>`).join("")}
                </ul>
              </div>
            </div>`
          : ""
      }
    </li>
  `;
}

function Row({ y, title, text, chevron: hasChevron, services }) {
  return `
    <li class="menu-row">
      <button class="menu-row__button" type="button"
        ${services ? 'aria-expanded="false" aria-controls="menu-services"' : ""}>
        ${art(13, y + 22, "menu-row__icon")}
        <span class="menu-row__title">${escapeHtml(title)}</span>
        ${text ? `<span class="menu-row__text">${escapeHtml(text)}</span>` : ""}
        ${hasChevron ? Chevron() : ""}
      </button>
      ${
        services
          ? `<div class="menu-collapse" id="menu-services">
              <div class="menu-collapse__inner">
                <ul class="menu-services">${SERVICES.map(Service).join("")}</ul>
              </div>
            </div>`
          : ""
      }
    </li>
  `;
}

/**
 * Side drawer opened from the header's menu button. The panel slides in from
 * the left over a dimmed home screen. Returns the element plus open/close.
 */
export function HamburgerMenu({ onOpenChange } = {}) {
  const root = el(`
    <div class="menu" role="dialog" aria-modal="true" aria-label="Menu" inert>
      <div class="menu__scrim"></div>
      <div class="menu__panel scroll-y" tabindex="-1">
        <div class="menu-header">
          ${art(17, 69, "menu-header__avatar")}
          <span class="menu-header__name">${PROFILE.name}</span>
          <span class="menu-header__phone">${PROFILE.phone}</span>
          <button class="menu-header__link pressable" type="button">View Profile</button>
          <p class="menu-header__help">
            Facing issues? <button class="menu-header__chat pressable" type="button">Chat With Us</button>
          </p>
          <button class="menu-header__action menu-header__action--bell pressable" type="button"
            aria-label="Notifications, new activity">${art(262, 76)}</button>
          <button class="menu-header__action menu-header__action--settings pressable" type="button"
            aria-label="Settings">${art(292, 82)}</button>
        </div>

        <button class="menu-safe pressable" type="button" aria-label="Airtel Safe: active">
          ${art(83, 270, "menu-safe__logo")}
          <span class="menu-safe__status">ACTIVE</span>
        </button>

        <ul class="menu-rows">${ROWS.map(Row).join("")}</ul>

        <p class="menu__version">Version 4.96.1</p>
      </div>
    </div>
  `);

  const panel = root.querySelector(".menu__panel");
  const scrim = root.querySelector(".menu__scrim");

  // Anything with aria-expanded toggles the collapsible block that follows it, and its
  // chevron folds into a dot and opens out the other way. A tap mid-morph turns it back
  // from wherever it has got to.
  root.querySelectorAll("[aria-expanded]").forEach((toggle) => {
    const path = toggle.querySelector(":scope > .menu-chevron path");
    let p = toggle.getAttribute("aria-expanded") === "true" ? -1 : 1;
    let morph = null;

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      morph?.stop();
      morph = animate(p, open ? -1 : 1, {
        ...transition("chevron"),
        onUpdate(value) {
          p = value;
          path.setAttribute("d", chevronPath(p));
          path.style.opacity = 1 - 0.45 * (1 - Math.abs(p)) ** 2; // thins out a little as it becomes the dot
        },
      });
    });
  });

  let isOpen = false;
  let returnFocus = null;
  let animations = [];

  function setOpen(open) {
    if (open === isOpen) return;
    isOpen = open;
    onOpenChange?.(open);
    animations.forEach((animation) => animation.stop());
    const screen = root.parentElement;

    if (open) {
      returnFocus = document.activeElement;
      root.inert = false;
      root.dataset.open = "true";
      screen.dataset.menu = "open";
      panel.scrollTop = 0;
      animations = [
        animate(panel, { x: "0%" }, transition("drawerIn")),
        animate(scrim, { opacity: 1 }, transition("scrimIn")),
      ];
      panel.focus({ preventScroll: true });
    } else {
      root.inert = true;
      animations = [
        animate(panel, { x: "-100%" }, transition("drawerOut")),
        animate(scrim, { opacity: 0 }, transition("scrimOut")),
      ];
      animations[0].then(() => {
        if (isOpen) return;
        delete root.dataset.open; // fully off screen: stop painting it
        screen.dataset.menu = "closed";
      });
      returnFocus?.focus({ preventScroll: true });
    }
  }

  scrim.addEventListener("click", () => setOpen(false));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) setOpen(false);
  });
  enableDragScroll(panel);

  return { element: root, open: () => setOpen(true), close: () => setOpen(false) };
}
