export function Button({ label, variant = "primary" }) {
  return `<button class="btn btn--${variant} pressable" type="button">${label}</button>`;
}
