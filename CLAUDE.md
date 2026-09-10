# CLAUDE.md

Context for AI assistants working in this repo.

## What this is

A personal QA/SDET portfolio. It tests the **Toolshop** practice app
(`testsmith-io/practice-software-testing` — Angular SPA + Laravel REST API +
MySQL) across three disciplines: **API**, **UI**, and **DB**.

It is built as a sequence of small modules. Each module teaches one concept,
ships running tests plus a short writeup in `docs/modules/`, and lands through
its own pull request. The design and full curriculum live in
`docs/design/2026-09-08-portfolio-qa-pivot.md`.

## Stack

Playwright + TypeScript + Bun, one runner for all layers. `ajv` for contract
checks against the OpenAPI spec, `mysql2` for DB assertions, `@faker-js/faker`
for data, Allure for the report.

## Run the SUT first

Tests need Toolshop running locally:

```
bun run sut:up      # docker compose up, waits for health
bun run sut:down     # stop and wipe volumes
```

Copy `.env.example` to `.env` first.

## Layout

- `src/config` — the only place that reads env; everything else imports `config`
- `src/api` — request builders / clients, no assertions
- `src/ui` — page objects, no assertions
- `src/db` — mysql2 pool + query helpers, return null/[] on no match
- `src/data` — faker factories and builders, pure
- `src/fixtures` — `test.extend` wiring the above together
- `tests/{api,ui,db,integration}` — specs; all assertions live here

## Commands

Read `package.json` scripts. Common ones: `bun run test`, `bun run test:api`,
`bun run test:ui`, `bun run lint`, `bun run types:check`.

## Conventions

- Conventional commit messages (`feat:`, `fix:`, `test:`, `chore:`, `docs:`).
- No AI attribution in commits or PRs. Commits are human-authored.
- One branch per module: `module/NN-slug`. Squash-merge to `main` via PR.
- Never push straight to `main`.
- No hard-coded URLs or credentials outside `src/config` and `.env`.
