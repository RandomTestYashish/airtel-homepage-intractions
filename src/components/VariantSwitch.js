import { el } from "../lib/dom.js";

const ALL_VARIANTS = [
  { id: "1", name: "V1", text: "Top nav small icons" },
  { id: "2", name: "V2", text: "Top nav only titles" },
  { id: "3", name: "V3", text: "Glass effect" },
  { id: "4", name: "V4", text: "Bottom nav shrinks" },
  { id: "5", name: "V5", text: "New top nav" },
];
// Only V1 and V4 are published. The other versions stay in the code but are not offered
// here and cannot be opened with `?v=`.
const PUBLISHED = ["1", "4"];
const VARIANTS = ALL_VARIANTS.filter((variant) => PUBLISHED.includes(variant.id));

/**
 * Preview control for switching between versions of the prototype. The choice
 * lives in the URL (`?v=2`), so a link opens on the same version. On desktop it
 * is a labelled list beside the phone; on phones CSS turns it into a small pill
 * floating at the right edge that shows only "V1 / V2 / V3 / V4 / V5".
 */
export function VariantSwitch({ onChange }) {
  const params = new URLSearchParams(location.search);
  let current = VARIANTS.some((variant) => variant.id === params.get("v")) ? params.get("v") : "1";

  const group = el(`
    <fieldset class="variant-switch" aria-label="Prototype version">
      ${VARIANTS.map(
        (variant) => `
        <button class="variant-switch__button" type="button" data-variant="${variant.id}"
          aria-pressed="${variant.id === current}" aria-label="${variant.name}: ${variant.text}">
          <strong>${variant.name}</strong><span class="variant-switch__text">${variant.text}</span>
        </button>`,
      ).join("")}
    </fieldset>
  `);

  group.hidden = VARIANTS.length < 2; // nothing to switch between
  const buttons = [...group.querySelectorAll("button")];
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      current = button.dataset.variant;
      buttons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));

      const url = new URL(location.href);
      if (current === "1") url.searchParams.delete("v");
      else url.searchParams.set("v", current);
      history.replaceState(null, "", url);

      onChange(current);
    });
  });

  onChange(current);
  return group;
}
