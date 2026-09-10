# Architecture

How the framework is wired. This grows as modules land; the shape is fixed by
`docs/design/2026-09-08-portfolio-qa-pivot.md` §6–§7.

## Layer contract

| Unit          | Does                                              | Rule                                              |
| ------------- | ------------------------------------------------ | ------------------------------------------------ |
| `src/config`  | resolves env → typed `config` object             | the only place that reads `process.env`           |
| `src/api/*`   | builds and sends requests, returns parsed bodies | fail fast on transport errors; no test assertions |
| `src/ui/*`    | page objects — locators + actions                | no assertions; locators inline unless reused      |
| `src/db/*`    | mysql2 pool + query helpers                       | return `null` / `[]` on no match, never throw     |
| `src/data/*`  | builders producing valid/invalid domain objects  | pure, no I/O                                      |
| `src/fixtures`| `test.extend` wiring the above into a `test`      | one fixture = one responsibility; always teardown |
| `tests/**`    | orchestrate fixtures/clients/pages                | all assertions live here                          |

## Fixtures

Defined in `src/fixtures/`, composed into a single `test` export. Planned set
(built across modules 02–13):

| Fixture         | Scope              | Provides                                             |
| --------------- | ----------------- | -------------------------------------------------- |
| `apiRequest`    | worker             | `APIRequestContext` bound to `SUT_API_URL`          |
| `authedRequest` | worker             | `apiRequest` carrying a Bearer token, cached/worker |
| `db`            | worker             | `mysql2` pool bound to the Compose MySQL            |
| `seededUser`    | test               | a customer created via API, unique per test         |
| `storageState`  | project (`auth-setup`) | authenticated browser storage state           |

## Playwright projects

`api`, `db`, `ui` (depends on `auth-setup`), `integration`. The SUT is
external — no `webServer` block; CI starts Docker Compose as a step.

## CI

`.github/workflows/ci.yml` — `lint-types` then `test`, on Bun. SUT startup,
browser caching, sharding, and the Allure Pages publish are added
incrementally (finalised in module 24).
