// Theme is applied immediately, to prevent flashing on page load
(() => {
  const themes = {
    light: "/assets/css/themes/light/light.css",
  };

  const previousLightThemes = new Set(["light", "cream", "parchment", "latte", "catppuccinLatte", "Inverted", "gruvboxLight", "solarizedLight"]);
  const previousTheme = store.get("theme");
  const themeid = previousLightThemes.has(previousTheme) ? "light" : "dark";
  if (previousTheme !== themeid) store.set("theme", themeid);

  function applyTheme(themeId) {
    let themeLink = document.getElementById("active-theme");
    const customThemeStyle = document.getElementById("active-custom-theme");

    document.documentElement.dataset.theme = themeId === "light" ? "light" : "dark";
    if (themeId === "light") {
      if (!themeLink) {
        themeLink = document.createElement("link");
        themeLink.id = "active-theme";
        themeLink.rel = "stylesheet";
        document.head.appendChild(themeLink);
      }
      themeLink.href = themes[themeId];
      customThemeStyle?.remove();
    } else {
      themeLink?.remove();
      customThemeStyle?.remove();
    }

  }

  window.applyTheme = applyTheme;
  applyTheme(themeid);

  const PROXY_KEY = "proxy";
  const ALLOWED = ["uv", "sj"];
  const DEFAULT = "sj";

  function initProxy() {
    const current = store.get(PROXY_KEY);
    if (current === null) {
      store.set(PROXY_KEY, DEFAULT);
      return DEFAULT;
    }
    if (ALLOWED.includes(current)) {
      return current;
    }
    store.set(PROXY_KEY, DEFAULT);
    return DEFAULT;
  }

  window.resolveProxyChoice = initProxy;
  window.resolveProxyChoice();
})();

// Background library. Stored preferences hold the key, not the path, so the build can randomise asset paths.
window.BACKGROUND_LIBRARY = {
  "v5-wallpaper": { label: "V5 Wallpaper", url: "/assets/media/background/v5-wallpaper.webp" },
  "v5-inverted": { label: "V5 Inverted", url: "/assets/media/background/v5-inverted.webp" },
  "minecraft-aesthetic": { label: "Aesthetic", url: "/assets/media/background/minecraft-aesthetic.webp" },
  "minecraft-ancient-city": { label: "Ancient City", url: "/assets/media/background/minecraft-ancient-city.webp" },
  "minecraft-bees": { label: "Bees", url: "/assets/media/background/minecraft-bees.webp" },
  "minecraft-birch-with-rainbow": { label: "Birch with Rainbow", url: "/assets/media/background/minecraft-birch-with-rainbow.webp" },
  "minecraft-blue-night": { label: "Blue Night", url: "/assets/media/background/minecraft-blue-night.webp" },
  "minecraft-cathedral": { label: "Cathedral", url: "/assets/media/background/minecraft-cathedral.webp" },
  "minecraft-cave-flowers": { label: "Cave Flowers", url: "/assets/media/background/minecraft-cave-flowers.webp" },
  "minecraft-cave-v2": { label: "Cave V2", url: "/assets/media/background/minecraft-cave-v2.webp" },
  "minecraft-cave": { label: "Cave", url: "/assets/media/background/minecraft-cave.webp" },
  "minecraft-cherry-blossom-sunrise": { label: "Cherry Blossom Sunrise", url: "/assets/media/background/minecraft-cherry-blossom-sunrise.webp" },
  "minecraft-cherry-with-sheep": { label: "Cherry with Sheep", url: "/assets/media/background/minecraft-cherry-with-sheep.webp" },
  "minecraft-dappled-forest": { label: "Dappled Forest", url: "/assets/media/background/minecraft-dappled-forest.webp" },
  "minecraft-desert-fog": { label: "Desert Fog", url: "/assets/media/background/minecraft-desert-fog.webp" },
  "minecraft-desert": { label: "Desert", url: "/assets/media/background/minecraft-desert.webp" },
  "minecraft-dock": { label: "Dock", url: "/assets/media/background/minecraft-dock.webp" },
  "minecraft-end": { label: "The End", url: "/assets/media/background/minecraft-end.webp" },
  "minecraft-firefly-bush": { label: "Firefly Bush", url: "/assets/media/background/minecraft-firefly-bush.webp" },
  "minecraft-frozen-ocean": { label: "Frozen Ocean", url: "/assets/media/background/minecraft-frozen-ocean.webp" },
  "minecraft-gloomy": { label: "Gloomy", url: "/assets/media/background/minecraft-gloomy.webp" },
  "minecraft-golden-hour": { label: "Golden Hour", url: "/assets/media/background/minecraft-golden-hour.webp" },
  "minecraft-house": { label: "House", url: "/assets/media/background/minecraft-house.webp" },
  "minecraft-ice-spikes-sunset": { label: "Ice Spikes Sunset", url: "/assets/media/background/minecraft-ice-spikes-sunset.webp" },
  "minecraft-jungle": { label: "Jungle", url: "/assets/media/background/minecraft-jungle.webp" },
  "minecraft-lukewarm-ocean": { label: "Lukewarm Ocean", url: "/assets/media/background/minecraft-lukewarm-ocean.webp" },
  "minecraft-lush-cave-v2": { label: "Lush Cave V2", url: "/assets/media/background/minecraft-lush-cave-v2.webp" },
  "minecraft-lush-cave-v3": { label: "Lush Cave V3", url: "/assets/media/background/minecraft-lush-cave-v3.webp" },
  "minecraft-lush-cave": { label: "Lush Cave", url: "/assets/media/background/minecraft-lush-cave.webp" },
  "minecraft-mangrove-swamp": { label: "Mangrove Swamp", url: "/assets/media/background/minecraft-mangrove-swamp.webp" },
  "minecraft-nether-crimson-forest": { label: "Nether Crimson Forest", url: "/assets/media/background/minecraft-nether-crimson-forest.webp" },
  "minecraft-nether-warped-forest": { label: "Nether Warped Forest", url: "/assets/media/background/minecraft-nether-warped-forest.webp" },
  "minecraft-night-desert-village": { label: "Night Desert Village", url: "/assets/media/background/minecraft-night-desert-village.webp" },
  "minecraft-night-mountain": { label: "Night Mountain", url: "/assets/media/background/minecraft-night-mountain.webp" },
  "minecraft-night-scary": { label: "Night Scary", url: "/assets/media/background/minecraft-night-scary.webp" },
  "minecraft-night": { label: "Night", url: "/assets/media/background/minecraft-night.webp" },
  "minecraft-pale-garden": { label: "Pale Garden", url: "/assets/media/background/minecraft-pale-garden.webp" },
  "minecraft-plains-lake": { label: "Plains Lake", url: "/assets/media/background/minecraft-plains-lake.webp" },
  "minecraft-plains": { label: "Plains", url: "/assets/media/background/minecraft-plains.webp" },
  "minecraft-rainy-plains": { label: "Rainy Plains", url: "/assets/media/background/minecraft-rainy-plains.webp" },
  "minecraft-realistic": { label: "Realistic", url: "/assets/media/background/minecraft-realistic.webp" },
  "minecraft-savannah-shores": { label: "Savannah Shores", url: "/assets/media/background/minecraft-savannah-shores.webp" },
  "minecraft-savannah": { label: "Savannah", url: "/assets/media/background/minecraft-savannah.webp" },
  "minecraft-ships": { label: "Ships", url: "/assets/media/background/minecraft-ships.webp" },
  "minecraft-snowy-mountain-cloudy": { label: "Snowy Mountain Cloudy", url: "/assets/media/background/minecraft-snowy-mountain-cloudy.webp" },
  "minecraft-snowy-mountains": { label: "Snowy Mountains", url: "/assets/media/background/minecraft-snowy-mountains.webp" },
  "minecraft-spruce-forest": { label: "Spruce Forest", url: "/assets/media/background/minecraft-spruce-forest.webp" },
  "minecraft-spruce-realistic": { label: "Realistic Spruce", url: "/assets/media/background/minecraft-spruce-realistic.webp" },
  "minecraft-swamp-green-fog": { label: "Swamp Green Fog", url: "/assets/media/background/minecraft-swamp-green-fog.webp" },
  "minecraft-swamp-sunrise": { label: "Swamp Sunrise", url: "/assets/media/background/minecraft-swamp-sunrise.webp" },
  "minecraft-swamp-sunset": { label: "Swamp Sunset", url: "/assets/media/background/minecraft-swamp-sunset.webp" },
  "minecraft-swamp": { label: "Swamp", url: "/assets/media/background/minecraft-swamp.webp" },
  "minecraft-town-v2": { label: "Town V2", url: "/assets/media/background/minecraft-town-v2.webp" },
  "minecraft-town": { label: "Town", url: "/assets/media/background/minecraft-town.webp" },
  "minecraft-underwater-foggy": { label: "Underwater Foggy", url: "/assets/media/background/minecraft-underwater-foggy.webp" },
  "minecraft-underwater-v2": { label: "Underwater V2", url: "/assets/media/background/minecraft-underwater-v2.webp" },
  "minecraft-underwater": { label: "Underwater", url: "/assets/media/background/minecraft-underwater.webp" },
  "minecraft-village": { label: "Village", url: "/assets/media/background/minecraft-village.webp" },
  "minecraft-wheat-mountain": { label: "Wheat Mountain", url: "/assets/media/background/minecraft-wheat-mountain.webp" },
};

window.backgroundUrlFor = key => (key && window.BACKGROUND_LIBRARY[key]?.url) || "";

Object.defineProperty(window, "isInTabMode", { get: () => Boolean(document.getElementById("frame-container")) });

function inShell() {
  return document.body?.dataset.shell === "true";
}

function reconstructSafeUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    const parsed = new URL(raw);
    const allowed = ["https:", "http:", "data:"];
    if (!allowed.includes(parsed.protocol)) return null;
    return parsed.href;
  } catch {
    if (typeof raw === "string" && !raw.includes(":")) return raw;
    return null;
  }
}

window.laceTitle = text => String(text ?? "");

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav-bar");

  if (nav) {
    nav.classList.add("ash-menubar");
    nav.innerHTML = `
      <a class="ash-brand" href="/home" aria-label="Ash Proxy home">
        <span class="ash-brand-mark" aria-hidden="true">A</span>
        <span class="ash-brand-name">ash<span>proxy</span></span>
      </a>
      <span class="ash-menubar-caption">A little more room to browse.</span>
      <span class="ash-menubar-status"><i aria-hidden="true"></i> Ready</span>`;

    const dock = document.createElement("nav");
    dock.className = "ash-dock";
    dock.setAttribute("aria-label", "Ash navigation");
    dock.innerHTML = `
      <a class="dock-item" href="/home" aria-label="Home" title="Home">
        <span class="dock-icon dock-home" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg></span><span class="dock-label">Home</span>
      </a>
      <a class="dock-item" href="/apps" aria-label="Apps" title="Apps">
        <span class="dock-icon dock-apps" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg></span><span class="dock-label">Apps</span>
      </a>
      <a class="dock-item" href="/games" aria-label="Games" title="Games">
        <span class="dock-icon dock-games" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.2 8.5h9.6a4.2 4.2 0 0 1 4.1 3.3l.7 3.1a2.2 2.2 0 0 1-3.6 2.1l-2.1-1.8H8.1L6 17a2.2 2.2 0 0 1-3.6-2.1l.7-3.1a4.2 4.2 0 0 1 4.1-3.3Z"/><path d="M7.5 10.9v3.2m-1.6-1.6h3.2" class="icon-cutout"/><circle cx="16.5" cy="12" r=".8" class="icon-cutout"/><circle cx="18.6" cy="14.1" r=".8" class="icon-cutout"/></svg></span><span class="dock-label">Games</span>
      </a>
      <a class="dock-item" href="/settings" aria-label="Settings" title="Settings">
        <span class="dock-icon dock-settings" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="11" cy="18" r="2"/></svg></span><span class="dock-label">Settings</span>
      </a>`;

    for (const item of dock.querySelectorAll(".dock-item")) {
      const itemUrl = new URL(item.href, window.location.href);
      if (itemUrl.pathname === window.location.pathname || (itemUrl.pathname.endsWith("/home") && window.location.pathname === "/")) {
        item.classList.add("is-active");
        item.setAttribute("aria-current", "page");
      }
    }
    document.body.appendChild(dock);
  }

  // Favicon and Name Logic.
  const icon = document.getElementById("tab-favicon");
  const title = document.getElementById("page-title");
  const defaultTitle = title?.textContent ?? "";
  const defaultIcon = icon?.getAttribute("href") ?? "";
  function applyCloak() {
    const cloakName = store.get("CustomName") || store.get("name");
    const cloakIcon = store.get("CustomIcon") || store.get("icon");
    if (title) title.textContent = laceTitle(cloakName || defaultTitle);
    const safeIcon = cloakIcon ? reconstructSafeUrl(cloakIcon) : null;
    if (icon) icon.setAttribute("href", safeIcon || defaultIcon);
  }
  applyCloak();
  if (inShell()) window.addEventListener("storage", applyCloak);

  const DEFAULT_PANIC_KEYS = ["`"];
  const DEFAULT_PANIC_LINK = "https://classroom.google.com/";

  let panicKeysRaw;
  let panicKeys = DEFAULT_PANIC_KEYS;
  function currentPanicKeys() {
    const raw = store.get("eventKey");
    if (raw !== panicKeysRaw) {
      panicKeysRaw = raw;
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
      panicKeys = Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_PANIC_KEYS;
    }
    return panicKeys;
  }

  function currentPanicLink() {
    return reconstructSafeUrl(store.get("pLink") || DEFAULT_PANIC_LINK) ?? DEFAULT_PANIC_LINK;
  }

  const panicAnchor = document.createElement("a");
  panicAnchor.style.display = "none";
  document.body.appendChild(panicAnchor);

  let pressedKeys = [];
  document.addEventListener("keydown", event => {
    const keys = currentPanicKeys();
    pressedKeys.push(event.key);
    if (pressedKeys.length > keys.length) pressedKeys = pressedKeys.slice(-keys.length);
    if (pressedKeys.length === keys.length && keys.every((key, i) => key === pressedKeys[i])) {
      panicAnchor.href = currentPanicLink();
      panicAnchor.target = "_top";
      panicAnchor.click();
      pressedKeys = [];
    }
  });

  for (const key of ["backgroundImage", "backgroundKey", "backgroundMode", "backgroundImageMode", "backgroundBlur", "gradientStyle", "particles"]) {
    store.remove(key);
  }
  delete document.body.dataset.background;
  delete document.body.dataset.gradient;
  delete document.body.dataset.customBackground;
  document.body.style.removeProperty("--custom-background-image");
  document.body.style.removeProperty("--background-blur");

  // Pointer Effects — cursor.js is only loaded when an effect is active
  const CURSOR_EFFECTS = [
    "rainbow-stars",
    "white-orbs",
    "rainbow-trail",
    "blue-orbs-trail",
    "blue-orbs-cursor",
    "the-sims",
    "curly-cursor",
    "rainbow-ribbon",
    "fairy-dust",
    "echo-trail",
    "chasing-cursors",
    "dot-trail",
    "bubble-trail",
    "snowflake-trail",
    "afterglow",
    "magnetic-trail",
    "magnetic-cursor",
    "color-trail",
    "falling-stars",
    "tubes-trail",
    "pixel-cursor",
    "pixel-trail",
    "pixel-reveal",
    "drawing-trail",
    "tidal-trail",
    "fluid-trail",
    "particle-dots",
    "spring-cursor",
    "inverted-cursor",
    "spotlight-cursor",
    "spring-squash",
  ];

  function anyCursorEffectActive() {
    const activePointer = store.get("pointer");
    const activeTrail = store.get("pointerTrail") || (activePointer === "blue-orbs" || store.get("pointerCustom") === "blue-orbs" ? "blue-orbs-trail" : CURSOR_EFFECTS.includes(activePointer) ? activePointer : "default");
    const activeCustom = store.get("pointerCustom") || "default";
    const activeClickEffect = store.get("pointerClickEffect") || "none";
    const idlePointerMotion = store.get("pointerIdleMotion") === "true";
    return CURSOR_EFFECTS.includes(activeTrail) || CURSOR_EFFECTS.includes(activeCustom) || CURSOR_EFFECTS.includes(activeClickEffect) || idlePointerMotion;
  }

  let cursorScriptLoad = null;
  function loadCursorScript() {
    if (inShell()) return Promise.resolve();
    if (!cursorScriptLoad) {
      cursorScriptLoad = new Promise((resolve, reject) => {
        const cursorScript = document.createElement("script");
        cursorScript.src = "/assets/js/cursor.js";
        cursorScript.onload = resolve;
        cursorScript.onerror = reject;
        document.head.appendChild(cursorScript);
      });
    }
    return cursorScriptLoad;
  }

  window.applyCursorEffects = () => {
    if (!anyCursorEffectActive()) {
      window.destroyCursorEffects?.();
      return Promise.resolve();
    }
    return loadCursorScript()
      .then(() => window.refreshCursorEffects())
      .catch(() => {});
  };

  window.applyCursorEffects();
});
