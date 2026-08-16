window.__ModuleLoader__.load({ id: '@local/dsh-prompt-rail', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
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

// src/client/MessageJumpRail.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function MessageJumpRail({ items, jumpTo, t }) {
  const [activeKey, setActiveKey] = (0, import_react.useState)(null);
  const [selectedKey, setSelectedKey] = (0, import_react.useState)(null);
  if (items.length === 0) return null;
  const activeIndex = activeKey === null ? -1 : items.findIndex((item) => item.key === activeKey);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "nav",
    {
      className: "dsh_messageJumpRail_nav",
      "aria-label": t("navigator.aria"),
      onPointerLeave: () => {
        setActiveKey(null);
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh_messageJumpRail_items", children: items.map(({ key, kind, summary }, index) => {
        const distance = activeIndex < 0 ? void 0 : Math.min(3, Math.abs(index - activeIndex));
        const kindLabel = kind === "assistant" ? t("navigator.assistant") : t("navigator.user");
        const previewKind = kind === "assistant" ? t("navigator.previewAssistant") : t("navigator.previewUser");
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: "dsh_messageJumpRail_item",
            "data-kind": kind,
            "data-distance": distance,
            "data-preview-active": activeKey === key || void 0,
            "data-selected": selectedKey === key || void 0,
            "aria-label": `${kindLabel} \u2014 ${t("navigator.item", { summary })}`,
            "aria-current": selectedKey === key || void 0,
            onPointerEnter: () => {
              setActiveKey(key);
            },
            onFocus: () => {
              setActiveKey(key);
            },
            onBlur: () => {
              setActiveKey(null);
            },
            onClick: () => {
              setSelectedKey(key);
              jumpTo(key);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_messageJumpRail_mark", "aria-hidden": true }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh_messageJumpRail_preview", "aria-hidden": true, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_messageJumpRail_previewKind", children: previewKind }),
                summary
              ] })
            ]
          },
          key
        );
      }) })
    }
  );
}

// src/client/locales.ts
var zh = {
  "navigator.aria": "\u6D88\u606F\u8DF3\u8F6C",
  "navigator.item": "\u8DF3\u8F6C\u5230\u6D88\u606F\uFF1A{summary}",
  "navigator.user": "\u7528\u6237",
  "navigator.assistant": "\u52A9\u624B",
  "navigator.previewUser": "\u7528\u6237\u6D88\u606F",
  "navigator.previewAssistant": "\u52A9\u624B\u6D88\u606F"
};
var en = {
  "navigator.aria": "Message navigation",
  "navigator.item": "Jump to message: {summary}",
  "navigator.user": "User",
  "navigator.assistant": "Assistant",
  "navigator.previewUser": "User message",
  "navigator.previewAssistant": "Assistant message"
};
var NS = "message-jump-rail";

// src/client/styles.ts
var STYLE_ID = "dsh-prompt-rail-style";
var cssText = `
.dsh_messageJumpRail_nav {
  position: sticky;
  z-index: 9;
  top: 50%;
  left: 8px;
  width: 56px;
  height: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  pointer-events: none;
}
.dsh_messageJumpRail_items {
  display: flex;
  flex-direction: column;
  width: 100%;
  transform: translateY(-50%);
  pointer-events: none;
}
.dsh_messageJumpRail_item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 56px;
  height: 10px;
  flex: 0 0 10px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  pointer-events: auto;
}
.dsh_messageJumpRail_mark {
  display: block;
  width: 8px;
  height: 3px;
  border-radius: 2px;
  background: var(--dsw-alias-label-tertiary);
  opacity: 0.55;
  transition: width 120ms ease, opacity 120ms ease;
}
.dsh_messageJumpRail_item[data-kind='assistant'] .dsh_messageJumpRail_mark {
  width: 4px;
  height: 2px;
  opacity: 0.35;
}
.dsh_messageJumpRail_item[data-distance='0'] .dsh_messageJumpRail_mark {
  width: 28px;
  background: var(--dsw-alias-label-primary);
  opacity: 0.9;
}
.dsh_messageJumpRail_item[data-kind='assistant'][data-distance='0'] .dsh_messageJumpRail_mark {
  width: 20px;
  opacity: 0.8;
}
.dsh_messageJumpRail_item[data-distance='1'] .dsh_messageJumpRail_mark {
  width: 20px;
}
.dsh_messageJumpRail_item[data-kind='assistant'][data-distance='1'] .dsh_messageJumpRail_mark {
  width: 12px;
}
.dsh_messageJumpRail_item[data-distance='2'] .dsh_messageJumpRail_mark {
  width: 14px;
}
.dsh_messageJumpRail_item[data-distance='3'] .dsh_messageJumpRail_mark {
  width: 10px;
}
.dsh_messageJumpRail_item[data-selected] .dsh_messageJumpRail_mark {
  background: var(--dsw-alias-brand-primary);
  opacity: 1;
}
.dsh_messageJumpRail_preview {
  display: none;
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  max-width: 340px;
  min-width: 160px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-overlay);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 18px;
  white-space: pre-wrap;
  word-break: break-word;
  pointer-events: none;
}
.dsh_messageJumpRail_item[data-preview-active] .dsh_messageJumpRail_preview {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.dsh_messageJumpRail_previewKind {
  display: block;
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 16px;
  margin-bottom: 2px;
}
`;
function adoptStyles() {
  const existing = document.getElementById(STYLE_ID);
  if (existing !== null) {
    existing.textContent = cssText;
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = cssText;
  document.head.appendChild(style);
}

// src/client/index.ts
var inject = ["slots", "locale"];
function apply(ctx) {
  adoptStyles();
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-prompt-rail: dictionaries");
  ctx.slots.inject("conversation.chat.navigator", () => ctx.slots.register({
    name: "conversation.chat.navigator",
    id: "message-jump-rail",
    order: 0,
    locale: NS
  }, MessageJumpRail));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
