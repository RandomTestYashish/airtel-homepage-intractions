export const asset = (name) => `src/assets/${name}`;

/** Builds a single element from an HTML string. */
export function el(markup) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

/** Marks one item in a group as current and clears the rest. */
export function selectOne(items, selected, attribute, value = "true") {
  items.forEach((item) => {
    if (item === selected) item.setAttribute(attribute, value);
    else if (attribute === "aria-selected") item.setAttribute(attribute, "false");
    else item.removeAttribute(attribute);
  });
}
