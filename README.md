# Portfolio — QA Engineering

A hands-on QA/SDET portfolio: **API**, **UI**, and **DB** testing against a
single realistic system, built module by module. Each module is one concept,
one pull request, and one short writeup — so the commit history itself shows
the progression.

## System under test — Toolshop

[`testsmith-io/practice-software-testing`](https://github.com/testsmith-io/practice-software-testing),
an e-commerce practice app with a real, documented surface on every layer:

| Layer    | Tech                                     |
| -------- | ---------------------------------------- |
| Frontend | Angular SPA                             |
| API      | REST (Laravel/PHP), OpenAPI 3 spec       |
| Database | MySQL                                    |

It runs locally via Docker Compose, which is what makes deterministic DB
testing possible.

## Stack

| Concern            | Tool                                             |
| ------------------ | ----------------------------------------------- |
| Runner (all layers)| `@playwright/test`                              |
| UI                 | Playwright browser APIs, role-based locators     |
| API                | Playwright `APIRequestContext`                   |
| Contract           | `ajv` vs Toolshop's OpenAPI schema              |
| DB                 | `mysql2` connection pool                         |
| Test data          | `@faker-js/faker` + hand-written builders        |
| Report             | Allure (history/trends published to Pages)       |
| Lint / format / types | ESLint (`@antfu`), Prettier, `tsc --noEmit`   |
| Runtime / package manager | Bun                                      |

## Architecture

```
  .env ──► src/config ──► everything (no env read anywhere else)

  src/api  (request builders, no assertions) ─┐
  src/ui   (page objects, no assertions)      ├─► src/fixtures (test.extend) ─► tests/**  (assertions here)
  src/db   (mysql2 pool + query helpers)      ─┘
  src/data (faker factories, pure)

  tests/api   tests/ui   tests/db   tests/integration
```

## Running it

```bash
cp .env.example .env       # adjust if your local ports differ
bun install
bunx playwright install --with-deps chromium

bun run sut:up             # start Toolshop (Docker Compose)
bun run test               # all layers
bun run sut:down           # stop and wipe

bun run test:api           # one layer
bun run test:ui
bun run test:db
```

## Modules

The full plan is in [`docs/design/2026-09-08-portfolio-qa-pivot.md`](docs/design/2026-09-08-portfolio-qa-pivot.md).
Writeups land in [`docs/modules/`](docs/modules/) as each module ships.

| Phase | Modules | Focus |
| ----- | ------- | ----- |
| 1     | 01–08   | API testing — HTTP basics, auth, CRUD, contract testing, test design, negative paths, data-driven, architecture |
| 2     | 09–16   | UI automation — locators, POM, E2E flow, fixtures, test data, the hard parts, cross-cutting checks, flake hunting |
| 3     | 17–22   | DB testing — state verification, data integrity, seeding/teardown, UI↔DB consistency, schema awareness |
| 4     | 23–24   | Integration trifecta + CI hardening and polish |

## License

MIT — see [LICENSE](LICENSE).
