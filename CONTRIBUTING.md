# Contributing

Thanks for your interest! This is a small, focused suite of plugins for
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness).

## Development setup

- This repository is a pnpm workspace; `pnpm install` at the root brings in
  the build toolchain (esbuild, typescript, electron for the desktop shell).
- Type-checking references the DeepSeek Harness checkout **sibling to this
  repo** (the `tsconfig.json` paths use `../../deepseek-harness/...`). Keep
  your harness checkout next to this repository:

  ```
  dev/
    deepseek-harness/     # upstream checkout
    dsh-plugin-suite/     # this repo
  ```

- Build a package: `pnpm -C packages/<name> run check` (typecheck + build).
- Install into the web profile for local testing:
  `node scripts/install-plugin.mjs packages/<name>`
- The prompt-rail plugin requires a small harness patch; see
  `packages/dsh-prompt-rail/README.md`.

## Conventions

- One plugin per package under `packages/`, following the existing layout:
  `src/index.ts` (host half), `src/client/` (browser half), prebuilt `lib/`
  committed so profile installs work without running builds.
- Keep the `@local/` package scope — it is the manual-install convention the
  marketplace and `install-plugin.mjs` rely on.
- Localized copy ships as `zh` + `en` dictionaries in `src/client/locales.ts`.
- Run `scripts/prepare-release.ps1` before publishing a release folder and
  verify the sanitized copy has no developer-machine paths.

## License

MIT — see LICENSE.
