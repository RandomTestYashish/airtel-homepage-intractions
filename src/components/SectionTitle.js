/** Returns markup so sections can drop it straight into their template. */
export function SectionTitle({ title, link, modifier = "" }) {
  return `
    <div class="section-title ${modifier}">
      <h2 class="section-title__text">${title}</h2>
      ${link ? `<button class="section-title__link pressable" type="button">${link}</button>` : ""}
    </div>
  `;
}
