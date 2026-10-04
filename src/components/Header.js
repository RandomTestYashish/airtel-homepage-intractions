import { asset, el } from "../lib/dom.js";

export function Header() {
  return el(`
    <header class="app-header">
      <button class="icon-btn pressable" type="button" aria-label="Menu">
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
}
