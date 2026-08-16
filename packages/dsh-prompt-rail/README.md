# dsh-prompt-rail

Vertical quick-jump rail for the DeepSeek Harness web conversation view
(**dsh web**): one mark per user prompt and per finalized assistant message,
hover / focus shows a preview bubble, click jumps to that message.

Fork of [Zzzzkd/dsh-prompt-rail](https://github.com/Zzzzkd/dsh-prompt-rail)
(MIT), extended with:

- **Assistant markers** — assistant messages get shorter, dimmer marks, so the
  rail shows the full conversation rhythm, not just prompts
- **Fuller previews** — summaries carry up to 400 chars and the preview bubble
  shows a 4-line excerpt with a role label
- **Tapered hover** — the active mark grows to a dark 28px bar, neighbors
  taper 20 / 14 / 10px; the selected mark stays brand-colored

## Prerequisite: harness patch

The `conversation.chat.navigator` slot does not exist in upstream
deepseek-harness (verified against `master` @ 47f943859b). This plugin ships
the slot patch in `compat/patches/harness-navigator-slot.patch` — an extended
version of the original prompt-rail patch (user + assistant rows, 400-char
summaries). Apply it to the harness checkout and rebuild the conversation
bundle:

```powershell
# in the DeepSeek Harness checkout (clean tree):
git apply <repo-root>\packages\dsh-prompt-rail\compat\patches\harness-navigator-slot.patch
pnpm --filter @deepseek-ai/dsh-client-ui-conversation run bundle
```

## Install

```powershell
cd <repo-root>\packages\dsh-prompt-rail
pnpm run check                      # typecheck + build
node <repo-root>\scripts\install-plugin.mjs <repo-root>\packages\dsh-prompt-rail
```

Restart dsh web and hard-refresh the browser (Ctrl+F5).

## Implementation

- Host half: no-op loader entry (`cordis.patch.yml`)
- Browser half: registers `MessageJumpRail` into the session-scoped
  `conversation.chat.navigator` list slot; the chat view owns which loaded
  rows are addressable and the row-scroll operation, the rail owns all visual
  treatment (styles injected under the `dsh-` prefix)

## License

MIT (original rail by Zzzzkd, MIT)
