window.__ModuleLoader__.load({ id: '@local/dsh-market', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
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
  "market.actionLabel": "\u5E02\u573A",
  "market.actionAria": "\u6253\u5F00\u63D2\u4EF6\u5E02\u573A",
  "market.panelTitle": "\u63D2\u4EF6\u5E02\u573A",
  "market.refresh": "\u5237\u65B0",
  "market.close": "\u5173\u95ED",
  "market.loading": "\u52A0\u8F7D\u4E2D\u2026",
  "market.error": "\u52A0\u8F7D\u5931\u8D25\uFF1A{message}",
  "market.repo": "\u63D2\u4EF6\u4ED3\u5E93",
  "market.repoMissing": "\u672A\u914D\u7F6E\u63D2\u4EF6\u4ED3\u5E93\uFF08\u8BBE\u7F6E\u73AF\u5883\u53D8\u91CF DSH_MARKET_REPO\uFF09",
  "market.installed": "\u5DF2\u5B89\u88C5",
  "market.install": "\u5B89\u88C5",
  "market.uninstall": "\u5378\u8F7D",
  "market.notBuilt": "\u7F3A\u5C11\u6784\u5EFA\u4EA7\u7269",
  "market.empty": "\u4ED3\u5E93\u4E2D\u6682\u65E0\u63D2\u4EF6",
  "market.urlPlaceholder": "Git \u4ED3\u5E93\u5730\u5740\uFF08https://\u2026\uFF09",
  "market.urlInstall": "\u5B89\u88C5",
  "market.urlInvalid": "\u8BF7\u8F93\u5165 https:// \u5F00\u5934\u7684\u5730\u5740",
  "market.restartHint": "\u5B89\u88C5\u6216\u5378\u8F7D\u540E\u9700\u91CD\u542F dsh web \u624D\u751F\u6548",
  "market.autobuildHint": "\u7F3A\u5C11\u6784\u5EFA\u4EA7\u7269\u7684\u63D2\u4EF6\uFF0C\u5B89\u88C5\u65F6\u4F1A\u81EA\u52A8\u6267\u884C pnpm install \u548C\u6784\u5EFA\uFF08\u53EF\u80FD\u9700\u8981\u51E0\u5206\u949F\uFF09",
  "market.busy": "\u5904\u7406\u4E2D\u2026"
};
var en = {
  "market.actionLabel": "Market",
  "market.actionAria": "Open plugin marketplace",
  "market.panelTitle": "Plugin marketplace",
  "market.refresh": "Refresh",
  "market.close": "Close",
  "market.loading": "Loading\u2026",
  "market.error": "Failed to load: {message}",
  "market.repo": "Plugin repository",
  "market.repoMissing": "No plugin repository configured (set DSH_MARKET_REPO)",
  "market.installed": "Installed",
  "market.install": "Install",
  "market.uninstall": "Uninstall",
  "market.notBuilt": "No built artifacts",
  "market.empty": "No plugins in the repository",
  "market.urlPlaceholder": "Git repository URL (https://\u2026)",
  "market.urlInstall": "Install",
  "market.urlInvalid": "Use a URL starting with https://",
  "market.restartHint": "Installing or uninstalling takes effect after restarting dsh web",
  "market.autobuildHint": "Plugins without built artifacts are auto-built on install (pnpm install + build; may take a few minutes)",
  "market.busy": "Working\u2026"
};
var NS = "market";

// src/client/MarketPanel.tsx
var import_react = require("react");
var import_react_dom = require("react-dom");
var import_jsx_runtime = require("react/jsx-runtime");
var styles = {
  action: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "var(--dsw-alias-label-secondary)",
    background: "transparent",
    border: "0",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "4px 8px",
    cursor: "pointer",
    flex: "0 0 auto"
  },
  actionActive: {
    color: "var(--dsw-alias-label-primary)",
    background: "var(--dsw-alias-interactive-bg-active)"
  },
  actionIcon: {
    fontSize: "14px",
    lineHeight: "16px"
  },
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.35)",
    zIndex: 9990
  },
  drawer: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(440px, 92vw)",
    zIndex: 9991,
    display: "flex",
    flexDirection: "column",
    background: "var(--dsw-alias-bg-layer-1)",
    borderLeft: "1px solid var(--dsw-alias-border-l2)",
    boxShadow: "-12px 0 32px rgba(0, 0, 0, 0.25)",
    // Clear the desktop shell's frosted title bar so the header controls
    // stay reachable (no-op in a plain browser).
    paddingTop: 36
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "14px 16px",
    borderBottom: "1px solid var(--dsw-alias-border-l1)"
  },
  headerTitle: {
    flex: 1,
    color: "var(--dsw-alias-label-primary)",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px"
  },
  button: {
    color: "var(--dsw-alias-label-secondary)",
    background: "transparent",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "6px",
    fontSize: "12px",
    lineHeight: "16px",
    padding: "3px 10px",
    cursor: "pointer"
  },
  buttonPrimary: {
    color: "var(--dsw-alias-label-primary)",
    borderColor: "var(--dsw-alias-brand-primary)"
  },
  buttonDanger: {
    color: "var(--dsw-alias-state-error-primary)"
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "default"
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  repoRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  repoLabel: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "11px",
    lineHeight: "16px",
    flex: "0 0 auto"
  },
  repoValue: {
    color: "var(--dsw-alias-label-secondary)",
    fontSize: "12px",
    lineHeight: "16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    background: "var(--dsw-alias-bg-layer-2)",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "8px"
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "2px"
  },
  rowTitle: {
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  rowName: {
    color: "var(--dsw-alias-label-primary)",
    fontSize: "13px",
    fontWeight: 500,
    lineHeight: "18px"
  },
  badge: {
    color: "var(--dsw-alias-state-success-primary)",
    fontSize: "11px",
    lineHeight: "16px",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "4px",
    padding: "0 5px"
  },
  badgeWarn: {
    color: "var(--dsw-alias-state-warn-primary)"
  },
  rowDesc: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "12px",
    lineHeight: "16px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  rowMeta: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "11px",
    lineHeight: "16px"
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
  status: {
    color: "var(--dsw-alias-label-secondary)",
    fontSize: "12px",
    lineHeight: "18px"
  },
  statusError: {
    color: "var(--dsw-alias-state-error-primary)"
  },
  statusOk: {
    color: "var(--dsw-alias-state-success-primary)"
  },
  note: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "11px",
    lineHeight: "16px"
  },
  empty: {
    color: "var(--dsw-alias-label-tertiary)",
    fontSize: "12px",
    lineHeight: "18px",
    padding: "8px 0"
  }
};
async function fetchCatalog() {
  const response = await fetch("/api/dsh-market/catalog", { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}
async function postAction(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store"
  });
  const result = await response.json();
  if (!response.ok && result.message === void 0) throw new Error(`HTTP ${response.status}`);
  return result;
}
function MarketPanel({ wide, t }) {
  const [open, setOpen] = (0, import_react.useState)(false);
  const [catalog, setCatalog] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(null);
  const [feedback, setFeedback] = (0, import_react.useState)(null);
  const [url, setUrl] = (0, import_react.useState)("");
  const timerRef = (0, import_react.useRef)(null);
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCatalog(await fetchCatalog());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  };
  const openPanel = () => {
    setOpen(true);
    void load();
  };
  const closePanel = () => {
    setOpen(false);
    setFeedback(null);
  };
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", onKey);
    timerRef.current = window.setInterval(() => {
      void load();
    }, 3e4);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [open]);
  const run = async (label, action2) => {
    setBusy(label);
    setFeedback(null);
    try {
      const result = await action2();
      setFeedback({ kind: result.ok ? "ok" : "error", text: result.message ?? (result.ok ? "OK" : "\u5931\u8D25") });
      await load();
    } catch (actionError) {
      setFeedback({ kind: "error", text: actionError instanceof Error ? actionError.message : String(actionError) });
    } finally {
      setBusy(null);
    }
  };
  const installFromRepo = (plugin) => {
    if (busy !== null) return;
    void run(plugin.name, () => postAction("/api/dsh-market/install", { kind: "repo", id: plugin.name }));
  };
  const installFromUrl = () => {
    if (busy !== null) return;
    const trimmed = url.trim();
    if (!/^https:\/\//.test(trimmed)) {
      setFeedback({ kind: "error", text: t("market.urlInvalid") });
      return;
    }
    setUrl("");
    void run(trimmed, () => postAction("/api/dsh-market/install", { kind: "git", url: trimmed }));
  };
  const uninstall = (plugin) => {
    if (busy !== null) return;
    void run(plugin.name, () => postAction("/api/dsh-market/uninstall", { id: plugin.id }));
  };
  const action = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      type: "button",
      style: { ...styles.action, ...open ? styles.actionActive : {} },
      "aria-label": t("market.actionAria"),
      "aria-pressed": open,
      onClick: openPanel,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.actionIcon, "aria-hidden": true, children: "\u{1F6D2}" }),
        wide ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("market.actionLabel") }) : null
      ]
    }
  );
  if (!open) return action;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    action,
    (0, import_react_dom.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.backdrop, onClick: closePanel }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { style: styles.drawer, role: "dialog", "aria-label": t("market.panelTitle"), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.header, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.headerTitle, children: t("market.panelTitle") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: styles.button, onClick: () => {
              void load();
            }, children: t("market.refresh") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: styles.button, onClick: closePanel, children: t("market.close") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.body, children: [
            error !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { ...styles.status, ...styles.statusError }, children: t("market.error", { message: error }) }) : null,
            catalog !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.repoRow, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.repoLabel, children: t("market.repo") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.repoValue, title: catalog.repo ?? void 0, children: catalog.repo ?? t("market.repoMissing") })
              ] }),
              catalog.plugins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.empty, children: t("market.empty") }) : catalog.plugins.map((plugin) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.row, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.rowMain, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.rowTitle, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.rowName, children: plugin.name }),
                    plugin.installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: styles.badge, children: t("market.installed") }) : null,
                    !plugin.built ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { ...styles.badge, ...styles.badgeWarn }, children: t("market.notBuilt") }) : null
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.rowDesc, children: plugin.description }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.rowMeta, children: [
                    "v",
                    plugin.version
                  ] })
                ] }),
                plugin.installed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: { ...styles.button, ...styles.buttonDanger, ...busy !== null ? styles.buttonDisabled : {} }, disabled: busy !== null, onClick: () => uninstall(plugin), children: t("market.uninstall") }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: { ...styles.button, ...styles.buttonPrimary, ...busy !== null ? styles.buttonDisabled : {} }, disabled: busy !== null, onClick: () => installFromRepo(plugin), children: t("market.install") })
              ] }, plugin.id)),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.urlRow, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    type: "text",
                    value: url,
                    placeholder: t("market.urlPlaceholder"),
                    style: styles.urlInput,
                    onChange: (event) => setUrl(event.target.value),
                    onKeyDown: (event) => {
                      if (event.key === "Enter") installFromUrl();
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", style: { ...styles.button, ...styles.buttonPrimary, ...busy !== null ? styles.buttonDisabled : {} }, disabled: busy !== null, onClick: installFromUrl, children: t("market.urlInstall") })
              ] }),
              busy !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: styles.status, children: [
                t("market.busy"),
                "\uFF08",
                busy,
                "\uFF09"
              ] }) : null,
              feedback !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { ...styles.status, ...feedback.kind === "ok" ? styles.statusOk : styles.statusError }, children: feedback.text }) : null,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.note, children: t("market.autobuildHint") }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.note, children: t("market.restartHint") })
            ] }) : null,
            loading && catalog === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: styles.empty, children: t("market.loading") }) : null
          ] })
        ] })
      ] }),
      document.body
    )
  ] });
}

// src/client/index.ts
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-market: dictionaries");
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "market",
    order: 5,
    locale: NS
  }, MarketPanel));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
