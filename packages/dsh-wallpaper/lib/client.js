window.__ModuleLoader__.load({ id: '@local/dsh-wallpaper', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/locales.ts
var zh = {
  "wallpaper.title": "\u58C1\u7EB8",
  "wallpaper.choose": "\u9009\u62E9\u56FE\u7247",
  "wallpaper.remove": "\u79FB\u9664",
  "wallpaper.urlPlaceholder": "\u6216\u7C98\u8D34\u56FE\u7247\u7F51\u5740\uFF08http(s) / data\uFF09",
  "wallpaper.urlApply": "\u5E94\u7528",
  "wallpaper.urlInvalid": "\u8BF7\u4F7F\u7528 http(s) \u6216 data \u56FE\u7247\u5730\u5740\uFF08\u4E0D\u8981\u7528 blob\uFF09",
  "wallpaper.fit": "\u663E\u793A\u65B9\u5F0F",
  "wallpaper.fit.cover": "\u94FA\u6EE1",
  "wallpaper.fit.contain": "\u5B8C\u6574\u663E\u793A",
  "wallpaper.fit.stretch": "\u62C9\u4F38",
  "wallpaper.fit.tile": "\u5E73\u94FA",
  "wallpaper.opacity": "\u9762\u677F\u4E0D\u900F\u660E\u5EA6",
  "wallpaper.blur": "\u6A21\u7CCA",
  "wallpaper.errorTooLarge": "\u56FE\u7247\u592A\u5927\uFF0C\u5B58\u4E0D\u4E0B",
  "wallpaper.errorRead": "\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247",
  "wallpaper.errorSave": "\u4FDD\u5B58\u5931\u8D25\uFF08\u5B58\u50A8\u7A7A\u95F4\u4E0D\u8DB3\u6216\u6D4F\u89C8\u5668\u9650\u5236\uFF09",
  "wallpaper.errorBlob": "blob \u5730\u5740\u5237\u65B0\u540E\u4F1A\u5931\u6548\uFF0C\u8BF7\u4F7F\u7528 http(s) \u6216\u9009\u62E9\u672C\u5730\u56FE\u7247",
  "wallpaper.errorDead": "\u58C1\u7EB8\u5730\u5740\u5DF2\u5931\u6548\uFF0C\u5DF2\u6E05\u9664",
  "wallpaper.hint": "\u58C1\u7EB8\u663E\u793A\u5728\u4E3B\u5185\u5BB9\u533A\u548C\u4FA7\u8FB9\u680F\u4E4B\u540E\uFF1B\u9762\u677F\u534A\u900F\u660E\u914D\u5408\u6A21\u7CCA\u5F62\u6210\u6BDB\u73BB\u7483\u6548\u679C\uFF0C\u6D88\u606F\u6C14\u6CE1\u4FDD\u6301\u4E0D\u900F\u660E\u4EE5\u4FDD\u8BC1\u53EF\u8BFB\u6027"
};
var en = {
  "wallpaper.title": "Wallpaper",
  "wallpaper.choose": "Choose image",
  "wallpaper.remove": "Remove",
  "wallpaper.urlPlaceholder": "Or paste an image URL (http(s) / data)",
  "wallpaper.urlApply": "Apply",
  "wallpaper.urlInvalid": "Use an http(s) or data image URL (not blob)",
  "wallpaper.fit": "Fit",
  "wallpaper.fit.cover": "Cover",
  "wallpaper.fit.contain": "Contain",
  "wallpaper.fit.stretch": "Stretch",
  "wallpaper.fit.tile": "Tile",
  "wallpaper.opacity": "UI wash",
  "wallpaper.blur": "Blur",
  "wallpaper.errorTooLarge": "Image is too large to save",
  "wallpaper.errorRead": "Could not read that image",
  "wallpaper.errorSave": "Could not save (storage full or blocked)",
  "wallpaper.errorBlob": "blob URLs die on reload \u2014 use http(s) or pick a local image",
  "wallpaper.errorDead": "Wallpaper URL was invalid and was cleared",
  "wallpaper.hint": "The wallpaper sits behind the main canvas and sidebar; translucent panels with blur form the frosted-glass look, while message bubbles stay opaque for readability"
};
var NS = "settings.wallpaper";

// src/client/persistence.ts
var STORAGE_KEYS = {
  image: "dsh-wallpaper:image",
  opacity: "dsh-wallpaper:opacity",
  blur: "dsh-wallpaper:blur",
  fit: "dsh-wallpaper:fit"
};
var DEFAULT_OPACITY = 0.8;
var DEFAULT_BLUR = 0;
var DEFAULT_FIT = "cover";
var FITS = ["cover", "contain", "stretch", "tile"];
var MAX_DATA_URL = 18e5;
function readStorage(key) {
  try {
    const value = window.localStorage.getItem(key);
    return typeof value === "string" ? value : null;
  } catch {
    return null;
  }
}
function writeStorage(key, value) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
function readWallpaper() {
  const value = readStorage(STORAGE_KEYS.image);
  return value === null || value.length === 0 ? null : value;
}
function readOpacity() {
  const value = Number(readStorage(STORAGE_KEYS.opacity));
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : DEFAULT_OPACITY;
}
function readBlur() {
  const value = Number(readStorage(STORAGE_KEYS.blur));
  return Number.isFinite(value) && value >= 0 && value <= 60 ? Math.round(value) : DEFAULT_BLUR;
}
function readFit() {
  const value = readStorage(STORAGE_KEYS.fit);
  return FITS.includes(value) ? value : DEFAULT_FIT;
}
function sanitizeWallpaperUrl(raw) {
  const value = String(raw ?? "").trim();
  if (value.length === 0) return null;
  if (/^blob:/i.test(value)) return null;
  if (/^(?:https?:|data:image\/)/i.test(value)) return value;
  return null;
}
function dataUrlTooLarge(value) {
  return value.startsWith("data:") && value.length > MAX_DATA_URL;
}

// src/client/store.ts
var import_client = require("@deepseek-ai/dsh-client-runtime/client");
var wallpaperStore = (0, import_client.defineStore)({
  init: () => ({
    url: null,
    opacity: DEFAULT_OPACITY,
    blur: DEFAULT_BLUR,
    fit: DEFAULT_FIT,
    error: null,
    revision: -1
  }),
  actions: {
    sync(draft, url, opacity, blur, fit, error, revision) {
      if (revision <= draft.revision) return;
      draft.url = url;
      draft.opacity = opacity;
      draft.blur = blur;
      draft.fit = fit;
      draft.error = error;
      draft.revision = revision;
    }
  }
});

// src/client/wallpaper.ts
var OVERRIDE_SOURCE = "dsh-wallpaper";
var BUILTIN_BASE = {
  light: "rgb(255, 255, 255)",
  dark: "rgb(21, 21, 23)"
};
function toRgba(color, alpha) {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color.trim());
  if (hex !== null) {
    let digits = hex[1];
    if (digits.length === 3) digits = digits.split("").map((char) => char + char).join("");
    const n = parseInt(digits, 16);
    return `rgba(${n >> 16 & 255}, ${n >> 8 & 255}, ${n & 255}, ${alpha})`;
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i.exec(color.trim());
  if (rgb !== null) return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${alpha})`;
  return color.trim();
}
function backgroundStyle(fit) {
  if (fit === "contain") return { size: "contain", repeat: "no-repeat", position: "center" };
  if (fit === "stretch") return { size: "100% 100%", repeat: "no-repeat", position: "center" };
  if (fit === "tile") return { size: "auto", repeat: "repeat", position: "left top" };
  return { size: "cover", repeat: "no-repeat", position: "center" };
}
var WallpaperController = class {
  el = null;
  disposeOverride = null;
  lastSignature = null;
  applying = false;
  /**
   * Render (or clear) the wallpaper layer and its token shading from the
   * current persisted settings.
   * @param ctx - client context (theme service access).
   */
  apply(ctx) {
    if (this.applying) return;
    if (typeof document === "undefined" || document.body === null) return;
    this.applying = true;
    try {
      const url = readWallpaper();
      if (url === null) {
        this.clear();
        return;
      }
      const fit = readFit();
      const blur = readBlur();
      const nextFilter = blur > 0 ? `blur(${blur}px)` : "none";
      const signature = `${url}|${fit}|${nextFilter}`;
      if (this.el === null || !document.body.contains(this.el)) {
        const el = document.createElement("div");
        el.className = "dsh-wallpaper-layer";
        el.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none;background-size:cover;background-position:center;background-repeat:no-repeat;";
        this.el = el;
        document.body.prepend(el);
        this.lastSignature = null;
      }
      if (this.lastSignature !== signature) {
        const bg = backgroundStyle(fit);
        this.el.style.backgroundImage = `url("${url}")`;
        this.el.style.filter = nextFilter;
        this.el.style.backgroundSize = bg.size;
        this.el.style.backgroundRepeat = bg.repeat;
        this.el.style.backgroundPosition = bg.position;
        this.lastSignature = signature;
      }
      this.shadeTokens(ctx);
    } finally {
      this.applying = false;
    }
  }
  /** Remove the wallpaper layer and its token overrides (fiber unload). */
  dispose() {
    this.clear();
  }
  /** The current wallpaper URL (for previews and removal buttons). */
  get currentUrl() {
    return this.el === null || this.lastSignature === null ? null : readWallpaper();
  }
  /** Remove the layer and the override layer; forget the applied signature. */
  clear() {
    this.el?.remove();
    this.el = null;
    this.lastSignature = null;
    this.disposeOverride?.();
    this.disposeOverride = null;
  }
  /**
   * Stack the wallpaper's token override layer: the main canvas
   * (--dsw-alias-bg-base) and the sidebar (--dsw-specific-sidebar-fill)
   * become translucent at the configured wash. Re-calling with the same
   * source replaces the whole layer (per the ThemeRuntime contract).
   */
  shadeTokens(ctx) {
    const snapshot = ctx.theme.getTheme();
    const alpha = readOpacity();
    const sidebarAlpha = Math.min(1, alpha + 0.1);
    const base = snapshot.active.tokens["--dsw-alias-bg-base"];
    const baseLight = typeof base === "string" ? base : BUILTIN_BASE.light;
    const baseDark = typeof base === "string" ? base : BUILTIN_BASE.dark;
    const overrides = {
      "--dsw-alias-bg-base": {
        light: toRgba(baseLight, alpha),
        dark: toRgba(baseDark, alpha)
      },
      "--dsw-specific-sidebar-fill": {
        light: toRgba(baseLight, sidebarAlpha),
        dark: toRgba(baseDark, sidebarAlpha)
      }
    };
    this.disposeOverride?.();
    this.disposeOverride = ctx.theme.overrideTokens(OVERRIDE_SOURCE, overrides);
  }
};

// src/client/WallpaperRow.tsx
var import_react = require("react");

// src/client/image.ts
function compressImage(image, maxSide, quality) {
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("canvas 2d context unavailable");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}
function readImageAsDataUrl(file, onDone, maxBytes) {
  const reader = new FileReader();
  reader.onerror = () => onDone(null);
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => onDone(null);
    image.onload = () => {
      try {
        let dataUrl = compressImage(image, 1600, 0.75);
        if (dataUrl.length > maxBytes) dataUrl = compressImage(image, 1e3, 0.6);
        if (dataUrl.length > maxBytes) dataUrl = compressImage(image, 800, 0.5);
        if (dataUrl.length > maxBytes) onDone(null);
        else onDone(dataUrl);
      } catch {
        onDone(null);
      }
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
}

// src/client/WallpaperRow.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var styles = {
  group: {
    borderBottom: "1px solid var(--dsw-alias-border-l2)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "16px 0"
  },
  title: {
    color: "var(--dsw-alias-label-primary)",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "22px"
  },
  hint: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "12px",
    lineHeight: "18px"
  },
  error: {
    color: "var(--dsw-alias-state-error-primary)",
    fontSize: "12px",
    lineHeight: "18px"
  },
  actionRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  preview: {
    width: "56px",
    height: "40px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid var(--dsw-alias-border-l1)",
    flex: "0 0 auto"
  },
  button: {
    color: "var(--dsw-alias-label-primary)",
    background: "var(--dsw-alias-bg-layer-2)",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "4px 10px",
    cursor: "pointer"
  },
  buttonDanger: {
    color: "var(--dsw-alias-state-error-primary)"
  },
  urlRow: {
    display: "flex",
    gap: "8px"
  },
  urlInput: {
    flex: 1,
    minWidth: 0,
    color: "var(--dsw-alias-label-primary)",
    background: "var(--dsw-alias-bg-layer-2)",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "4px 8px"
  },
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  sliderLabel: {
    color: "var(--dsw-alias-label-secondary)",
    fontSize: "12px",
    lineHeight: "18px",
    flex: "0 0 84px"
  },
  slider: {
    flex: 1,
    minWidth: 0,
    accentColor: "var(--dsw-alias-brand-primary)"
  },
  sliderValue: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "12px",
    lineHeight: "18px",
    flex: "0 0 44px",
    textAlign: "right"
  },
  fitRow: {
    display: "flex",
    gap: "6px",
    flex: 1
  },
  fitButton: {
    color: "var(--dsw-alias-label-secondary)",
    background: "transparent",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "3px 8px",
    cursor: "pointer"
  },
  fitButtonSelected: {
    color: "var(--dsw-alias-label-primary)",
    borderColor: "var(--dsw-alias-brand-primary)"
  }
};
function errorKey(code) {
  if (code === "tooLarge") return "wallpaper.errorTooLarge";
  if (code === "read") return "wallpaper.errorRead";
  if (code === "save") return "wallpaper.errorSave";
  if (code === "blob") return "wallpaper.errorBlob";
  if (code === "dead") return "wallpaper.errorDead";
  return "wallpaper.urlInvalid";
}
function Slider({ label, value, min, max, step, format, onChange }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.sliderRow, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.sliderLabel, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        type: "range",
        min,
        max,
        step,
        value,
        style: styles.slider,
        onChange: (event) => onChange(Number(event.target.value))
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.sliderValue, children: format(value) })
  ] });
}
function WallpaperRow({ t, setWallpaper, setOpacity, setBlur, setFit, setError, useStore }) {
  const url = useStore((state) => state.url);
  const opacity = useStore((state) => state.opacity);
  const blur = useStore((state) => state.blur);
  const fit = useStore((state) => state.fit);
  const error = useStore((state) => state.error);
  const inputRef = (0, import_react.useRef)(null);
  const [urlInput, setUrlInput] = (0, import_react.useState)("");
  const onPick = () => inputRef.current?.click();
  const onFile = (event) => {
    const file = event.target.files?.[0];
    if (file === void 0) return;
    event.target.value = "";
    readImageAsDataUrl(file, (dataUrl) => {
      if (dataUrl === null) setError("read");
      else setWallpaper(dataUrl);
    }, MAX_DATA_URL);
  };
  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (/^blob:/i.test(trimmed)) {
      setError("blob");
      return;
    }
    const sanitized = sanitizeWallpaperUrl(trimmed);
    if (sanitized === null) {
      setError("invalid");
      return;
    }
    if (dataUrlTooLarge(sanitized)) {
      setError("tooLarge");
      return;
    }
    setWallpaper(sanitized);
    setUrlInput("");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.group, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.title, children: t("wallpaper.title") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.actionRow, children: [
      url !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: url, alt: "", referrerPolicy: "no-referrer", style: styles.preview }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: styles.button, onClick: onPick, children: t("wallpaper.choose") }),
      url !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: { ...styles.button, ...styles.buttonDanger }, onClick: () => setWallpaper(null), children: t("wallpaper.remove") }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ref: inputRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: onFile })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.urlRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          type: "text",
          value: urlInput,
          placeholder: t("wallpaper.urlPlaceholder"),
          style: styles.urlInput,
          onChange: (event) => setUrlInput(event.target.value),
          onKeyDown: (event) => {
            if (event.key === "Enter") applyUrl();
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: styles.button, onClick: applyUrl, children: t("wallpaper.urlApply") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.sliderRow, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.sliderLabel, children: t("wallpaper.fit") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.fitRow, children: FITS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "button",
        {
          type: "button",
          "aria-pressed": fit === value,
          onClick: () => setFit(value),
          style: { ...styles.fitButton, ...fit === value ? styles.fitButtonSelected : {} },
          children: t(`wallpaper.fit.${value}`)
        },
        value
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Slider,
      {
        label: t("wallpaper.opacity"),
        value: Math.round(opacity * 100),
        min: 0,
        max: 100,
        step: 1,
        format: (value) => `${value}%`,
        onChange: setOpacity
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Slider,
      {
        label: t("wallpaper.blur"),
        value: blur,
        min: 0,
        max: 60,
        step: 1,
        format: (value) => `${value}px`,
        onChange: setBlur
      }
    ),
    error !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.error, children: t(errorKey(error)) }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.hint, children: t("wallpaper.hint") })
  ] });
}

// src/client/index.ts
var inject = ["slots", "locale", "theme"];
function apply(ctx) {
  const controller = new WallpaperController();
  let revision = 0;
  let error = null;
  const store = wallpaperStore;
  let bound;
  const syncRow = () => {
    revision += 1;
    bound?.sync(readWallpaper(), readOpacity(), readBlur(), readFit(), error, revision);
  };
  let applyRaf = null;
  const scheduleApply = () => {
    if (applyRaf !== null) return;
    applyRaf = requestAnimationFrame(() => {
      applyRaf = null;
      controller.apply(ctx);
    });
  };
  controller.apply(ctx);
  syncRow();
  ctx.on("theme/change", () => {
    if (readWallpaper() !== null) scheduleApply();
  });
  ctx.effect(() => () => {
    controller.dispose();
    if (applyRaf !== null) cancelAnimationFrame(applyRaf);
  }, "dsh-wallpaper: layer cleanup");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-wallpaper: dictionaries");
  const injected = (actions) => {
    bound = actions;
    syncRow();
    return {
      setWallpaper: (url) => {
        if (url === null) {
          writeStorage(STORAGE_KEYS.image, null);
          error = null;
          syncRow();
          scheduleApply();
          return;
        }
        const sanitized = sanitizeWallpaperUrl(url);
        if (sanitized === null) {
          error = /^blob:/i.test(String(url).trim()) ? "blob" : "invalid";
          syncRow();
          return;
        }
        if (dataUrlTooLarge(sanitized)) {
          error = "tooLarge";
          syncRow();
          return;
        }
        if (!writeStorage(STORAGE_KEYS.image, sanitized)) {
          error = "save";
          syncRow();
          return;
        }
        error = null;
        syncRow();
        scheduleApply();
      },
      setOpacity: (percent) => {
        const value = Math.min(1, Math.max(0, percent / 100));
        if (!writeStorage(STORAGE_KEYS.opacity, String(value))) {
          error = "save";
          syncRow();
          return;
        }
        syncRow();
        scheduleApply();
      },
      setBlur: (px) => {
        const value = Math.min(60, Math.max(0, Math.round(px)));
        if (!writeStorage(STORAGE_KEYS.blur, String(value))) {
          error = "save";
          syncRow();
          return;
        }
        syncRow();
        scheduleApply();
      },
      setFit: (fit) => {
        if (!writeStorage(STORAGE_KEYS.fit, fit)) {
          error = "save";
          syncRow();
          return;
        }
        syncRow();
        scheduleApply();
      },
      setError: (code) => {
        error = code;
        syncRow();
      }
    };
  };
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "wallpaper",
    order: 30,
    store,
    locale: NS,
    inject: injected
  }, WallpaperRow));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
