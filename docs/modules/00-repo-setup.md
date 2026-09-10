# Module 00 — Repo setup

**Goal:** turn the inherited KATA boilerplate into a lean skeleton that lints,
type-checks, and runs a green (empty) Playwright suite — the foundation every
later module builds on.

## What changed

- **Removed** the agentic-qa-boilerplate machinery: KATA test scaffold,
  Jira/Xray sync scripts, agent skills and commands, the OpenAPI pipeline,
  the installer, and the UPEX method docs. It stays recoverable from the
  `archive/kata-boilerplate` git tag.
- **Rewrote** the config surface for the new stack:
  - `package.json` — scripts trimmed to `test(:*)`, `lint`, `format`,
    `types:check`, `sut:*`, `allure:*`; deps cut to Playwright + Bun + ESLint
    + Prettier + Allure, plus `ajv` and `mysql2`.
  - `playwright.config.ts` — four projects (`api`, `db`, `ui`, `integration`)
    plus `auth-setup`; no `webServer` (the SUT is external via Compose);
    `list` + `allure-playwright` reporters.
  - `tsconfig.json` — path aliases `@config`, `@api`, `@ui`, `@db`, `@data`,
    `@fixtures`.
  - `.husky/pre-commit` → `lint-staged` + `types:check`;
    `.husky/pre-push` → `lint` + `types:check`.
  - `.github/workflows/ci.yml` — Bun, `lint-types` then `test`.
  - `.env.example` — only the Toolshop URLs, DB params, and seeded users.
- **Added** the empty structure: `src/{config,api,ui,db,data,fixtures}`,
  `tests/{api,ui,db,integration}`, `sut/`, `docs/modules/`. `src/config`
  ships as a real (minimal) env resolver so the layer contract holds from
  day one.

## Decisions

- **`sut/docker-compose.yml` is deferred to module 01.** Pinning it needs a
  chosen Toolshop release tag; that decision rides with the first real API
  test, which is what proves the SUT actually works.
- **CI runs the empty suite without the SUT.** Starting Compose in CI, browser
  caching, and sharding are added when there is something to run against them.
- **`src/config` has safe defaults.** Missing `.env` values fall back to the
  documented local Compose values rather than throwing, so a fresh clone can
  `bun run test` immediately.
- **`--pass-with-no-tests` on the `test` scripts** keeps the empty suite green.
  It comes off in module 01, when the first real test lands.

## Verification

- `bun install` — clean
- `bun run lint` — clean
- `bun run types:check` — clean
- `bun run test` — 0 tests, exit 0
