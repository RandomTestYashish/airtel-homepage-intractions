import { el } from "../lib/dom.js";

const VARIANTS = [
  { id: "1", name: "V1", text: "Top nav small icons" },
  { id: "2", name: "V2", text: "Top nav only titles" },
  { id: "3", name: "V3", text: "Glass effect" },
];

/**
 * Preview control for switching between versions of the prototype. The choice
 * lives in the URL (`?v=2`), so a link opens on the same version; on phones the
 * control is hidden and the URL is the only switch.
 */
export function VariantSwitch({ onChange }) {
  const params = new URLSearchParams(location.search);
  let current = VARIANTS.some((variant) => variant.id === params.get("v")) ? params.get("v") : "1";

  const group = el(`
    <fieldset class="variant-switch" aria-label="Prototype version">
      ${VARIANTS.map(
        (variant) => `
        <button class="variant-switch__button" type="button" data-variant="${variant.id}"
          aria-pressed="${variant.id === current}"><strong>${variant.name}</strong>${variant.text}</button>`,
      ).join("")}
    </fieldset>
  `);

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
