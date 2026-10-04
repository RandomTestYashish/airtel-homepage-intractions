import { asset, el } from "../lib/dom.js";

export function Header({ onMenu } = {}) {
  const header = el(`
    <header class="app-header">
      <button class="icon-btn pressable app-header__menu" type="button" aria-label="Menu" aria-haspopup="dialog">
        <img src="${asset("hdr-back.svg")}" alt="" />
      </button>
      <div class="app-header__actions">
        <button class="icon-btn pressable" type="button" aria-label="Search">
          <img src="${asset("hdr-question.svg")}" alt="" />
        </button>
        <button class="scan-btn pressable" type="button" aria-label="Scan QR">
          <img src="${asset("hdr-append.png")}" alt="" />
        </button>
      </div>
    </header>
  `);

  header.querySelector(".app-header__menu").addEventListener("click", () => onMenu?.());
  return header;
}
