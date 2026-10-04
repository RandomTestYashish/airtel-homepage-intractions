import { asset, el } from "../lib/dom.js";
import { Button } from "./Button.js";
import { ClipTag } from "./ClipTag.js";

export function NextBestAction() {
  return el(`
    <section class="nba" aria-label="Pack status">
      <div class="nba__card card-surface">
        ${ClipTag({ label: "Pack Status", tone: "red" })}
        <div class="nba__meta">
          <span class="nba__service">
            <span class="nba__service-icon"><img src="${asset("nba-service.svg")}" alt="" /></span>
            Prepaid
          </span>
          <span class="nba__number">9876543210</span>
        </div>
        <div class="nba__copy">
          <p class="nba__title">Your ₹399 pack is expiring today</p>
          <p class="nba__body">Recharge now to avoid service interruption and continue enjoying your benefits.</p>
        </div>
      </div>
      <div class="nba__actions">
        ${Button({ label: "Explore Packs", variant: "ghost" })}
        ${Button({ label: "Recharge Now", variant: "primary" })}
      </div>
    </section>
  `);
}
