# Security

## Data boundaries

This plugin suite runs **locally** on your machine:

- **Nothing is uploaded or collected.** There is no telemetry, no analytics,
  and no network calls except the ones the plugins' features explicitly make:
  - the usage plugin queries the official DeepSeek balance API
    (`api.deepseek.com/user/balance`) **from your machine** using your own
    API key; the key is resolved through the DSH credentials seam and never
    leaves the host process
  - the marketplace shallow-clones plugin repositories you explicitly ask
    for, and runs their build scripts locally
- **API keys** are stored where DeepSeek Harness stores them
  (`$DSH_HOME/.credentials.yaml` or the environment) — not inside this
  repository. The desktop shell never persists your key.
- **Conversation data** stays in DSH's own session storage
  (`$DSH_HOME/sessions`). This repository contains no conversation data.
- Plugin packages are installed into `$DSH_HOME/profiles` at runtime; nothing
  about your profile, sessions, or credentials is committed to this repo.

## Install-time trust

Installing a third-party plugin executes its code and its dependency build
scripts on your machine. Only install plugins you trust, from sources you
know — the same trust model as installing any npm package.

## Reporting a vulnerability

For now, open an issue on this repository with a private description, or
contact the maintainers directly. Do not include API keys or real
conversation contents in public reports.
