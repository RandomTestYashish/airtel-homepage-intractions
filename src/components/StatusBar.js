import { asset, el } from "../lib/dom.js";

export function StatusBar() {
  return el(`
    <div class="status-bar" aria-hidden="true">
      <img class="status-bar__time" src="${asset("sb-time.svg")}" alt="" />
      <img class="status-bar__cell" src="${asset("sb-cell.svg")}" alt="" />
      <img class="status-bar__wifi" src="${asset("sb-wifi.svg")}" alt="" />
      <img class="status-bar__battery" src="${asset("sb-battery.svg")}" alt="" />
    </div>
  `);
}
