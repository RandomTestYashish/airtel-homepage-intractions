import { el } from "./lib/dom.js";
import { enableDragScroll } from "./lib/dragScroll.js";
import { animate, reducedMotion, transition } from "./lib/motion.js";
import { enablePressFeedback } from "./lib/press.js";
import { createScrollMotion } from "./lib/scrollMotion.js";
import { BottomNavigation } from "./components/BottomNavigation.js";
import { CuratedBanners, FeaturingFresh, RechargeForOthers, YouMightLike } from "./components/Carousels.js";
import { CategoryTabs } from "./components/CategoryTabs.js";
import { ExploreProducts } from "./components/ExploreProducts.js";
import { HamburgerMenu } from "./components/HamburgerMenu.js";
import { Header } from "./components/Header.js";
import { IconActionGrid } from "./components/IconActionGrid.js";
import { IllustrativeGrid } from "./components/IllustrativeGrid.js";
import { MyServices } from "./components/MyServices.js";
import { NextBestAction } from "./components/NextBestAction.js";
import { PhoneFrame } from "./components/PhoneFrame.js";
import { ProductShowcase } from "./components/ProductShowcase.js";
import { StatusBar } from "./components/StatusBar.js";
import { VariantSwitch } from "./components/VariantSwitch.js";

const BUY_PRODUCTS = [
  { label: "Insta EMI Card", image: "tile-emi.png" },
  { label: "Gold Loan", image: "tile-gold.png" },
  { label: "Credit Card", image: "tile-credit.png" },
  { label: "Fixed Deposit", image: "tile-fd.png" },
  { label: "Refer Wi-Fi", image: "tile-referwifi.png", tag: "₹300 off" },
  { label: "Postpaid", image: "tile-postpaid.png" },
  { label: "IPTV", image: "tile-iptv.png" },
  { label: "Bundle your services", image: "tile-bundle.png" },
  { label: "New Prepaid", image: "tile-prepaid.png" },
];

const QUICK_LINKS = [
  { label: "Call Manager", image: "tile-call.png" },
  { label: "Rewards & OTTs", image: "tile-rewards.png" },
  { label: "Refer & Get ₹300", image: "tile-refer.png" },
];

const HERO_RANGE = 260; // px of scroll over which the hero card eases back
const HEADER_HEIGHT = 72;
const TABS_COMPACT_AT = 16; // scrolling past this shrinks the tabs…
const TABS_NORMAL_AT = 9; // …and they stay small until the page is back up here
const NAV_SHRUNK = 0.86; // V4: how small the bottom nav bar gets while the page is scrolling

export function App() {
  const { stage, screen } = PhoneFrame();

  const page = el(`<div class="page scroll-y" tabindex="-1"></div>`);
  const hero = NextBestAction();
  const tabs = CategoryTabs();
  page.append(
    tabs,
    hero,
    MyServices(),
    IllustrativeGrid({ title: "Buy Airtel products", link: "View all", items: BUY_PRODUCTS }),
    IconActionGrid(),
    ExploreProducts(),
    CuratedBanners(),
    IllustrativeGrid({ items: QUICK_LINKS, gap: 16 }),
    RechargeForOthers(),
    YouMightLike(),
    FeaturingFresh(),
    ProductShowcase(),
  );

  // The header's menu button opens the side drawer over the home screen; while it
  // is open, everything behind it is taken out of the tab order.
  const menu = HamburgerMenu({
    onOpenChange: (open) => [page, header, bottomNav].forEach((layer) => (layer.inert = open)),
  });
  const header = Header({ onMenu: menu.open });
  const bottomNav = BottomNavigation({
    // Choosing a destination returns the page to the top, as native tab bars do.
    onSelect: () => page.scrollTo({ top: 0, behavior: "smooth" }),
  });

  screen.append(page, StatusBar(), header, bottomNav, menu.element);

  // Scroll-linked: the hero card recedes very slightly as the page moves under the header.
  const heroCard = hero.querySelector(".nba__card");
  let heroProgress = 0;
  function linkHero(y) {
    const progress = reducedMotion.matches ? 0 : Math.min(1, y / HERO_RANGE);
    if (progress === heroProgress) return;
    heroProgress = progress;
    heroCard.style.transform = `scale(${1 - 0.02 * progress})`;
    heroCard.style.opacity = 1 - 0.06 * progress;
  }

  // The header hides and returns on its own spring. The category tabs' position is
  // never animated: they scroll with the page, pin under the status bar, and are
  // only held clear of whatever part of the header is currently on screen.
  let headerShown = 1; // 1 = fully visible, 0 = fully hidden
  let headerAnimation = null;
  let scrollY = 0;
  let statusBar = 44; // height of the mockup's status bar; 0 on a real phone
  let pageTop = 125; // where the category tabs sit at scrollTop 0
  function measureChrome() {
    statusBar = header.offsetTop;
    pageTop = parseFloat(getComputedStyle(page).paddingTop);
    layoutChrome();
  }
  function layoutChrome() {
    const visible = HEADER_HEIGHT * headerShown;
    header.style.transform = `translate3d(0, ${visible - HEADER_HEIGHT}px, 0)`; // translateY(-100%) when hidden
    header.style.opacity = 0.6 + 0.4 * headerShown;

    const pinned = Math.max(pageTop - scrollY, statusBar); // where position: sticky puts the tabs
    const clearance = Math.max(0, statusBar + visible - pinned);
    tabs.style.transform = clearance ? `translate3d(0, ${clearance}px, 0)` : "";
  }

  // Once the page is scrolled the tab tiles shrink; they stay small on the way
  // back up and return to full size only at the top.
  let tabsCompact = false;
  let compactAmount = 0;
  let compactAnimation = null;
  function linkTabs(y) {
    const compact = y > (tabsCompact ? TABS_NORMAL_AT : TABS_COMPACT_AT);
    if (compact === tabsCompact) return;
    tabsCompact = compact;
    compactAnimation?.stop();
    compactAnimation = animate(compactAmount, compact ? 1 : 0, {
      ...transition("header"),
      onUpdate(value) {
        compactAmount = value;
        tabs.style.setProperty("--compact", value.toFixed(3));
      },
    });
  }

  // V4 never hides the bottom nav: while the page is scrolling, either way, its bar
  // scales down in place, and it returns to full size once scrolling rests.
  const navBar = bottomNav.querySelector(".bottom-nav__bar");
  const shrinksNav = () => screen.dataset.variant === "4";
  let navAway = false;
  function setVariant(variant) {
    screen.dataset.variant = variant;
    // Carry the nav's current state over to however this version shows it.
    screen.dataset.nav = navAway && !shrinksNav() ? "hidden" : "visible";
    animate(bottomNav, { y: navAway && !shrinksNav() ? "110%" : "0%" }, transition("bar"));
    animate(navBar, { scale: navAway && shrinksNav() ? NAV_SHRUNK : 1 }, transition("navShrink"));
  }

  const scrollMotion = createScrollMotion(page, {
    onHeader(hidden) {
      screen.dataset.header = hidden ? "hidden" : "visible";
      headerAnimation?.stop();
      headerAnimation = animate(headerShown, hidden ? 0 : 1, {
        ...transition("header"),
        onUpdate(value) {
          headerShown = value;
          layoutChrome();
        },
      });
    },
    onNav(hidden, reason) {
      navAway = hidden;
      if (shrinksNav()) {
        // V4: the bar stays where it is and draws in about its own centre.
        animate(navBar, { scale: hidden ? NAV_SHRUNK : 1 }, transition(hidden ? "navShrink" : "navGrow"));
        return;
      }
      screen.dataset.nav = hidden ? "hidden" : "visible";
      // Returning because the scroll came to rest gets the softer, settling spring.
      animate(bottomNav, { y: hidden ? "110%" : "0%" }, transition(reason === "rest" ? "settle" : "bar"));
    },
    navUntilRest: () => shrinksNav(),
    onProgress(y) {
      screen.dataset.scrolled = String(y > 4);
      linkHero(y);
      linkTabs(y);
    },
    onScroll(y) {
      scrollY = y;
      layoutChrome();
    },
  });

  // Keyboard users must never land on a control that is translated off screen.
  [header, bottomNav].forEach((bar) => bar.addEventListener("focusin", scrollMotion.reveal));

  requestAnimationFrame(measureChrome); // needs layout, so wait until mounted
  window.addEventListener("resize", measureChrome);

  // V2 changes how the category tabs look once scrolled (sections.css); V3 is V1 with
  // glass surfaces on the header, tabs and bottom nav (chrome.css); V4 is V1 with a
  // bottom nav that shrinks in place instead of hiding.
  stage.append(VariantSwitch({ onChange: setVariant }));

  revealOnScroll(page);
  enablePressFeedback(screen);
  enableDragScroll(page);
  return stage;
}

/** Sections below the fold ease up into place the first time they scroll into view. */
function revealOnScroll(page) {
  if (reducedMotion.matches) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        animate(entry.target, { opacity: 1, y: 0 }, transition("reveal"));
      });
    },
    { root: page, rootMargin: "0px 0px -8% 0px" },
  );

  // Wait a frame so layout exists; anything already on screen is left alone.
  requestAnimationFrame(() => {
    const fold = page.getBoundingClientRect().bottom;
    page.querySelectorAll(":scope > section").forEach((section) => {
      if (section.getBoundingClientRect().top < fold) return;
      animate(section, { opacity: 0.35, y: 16 }, { duration: 0 });
      observer.observe(section);
    });
  });
}
