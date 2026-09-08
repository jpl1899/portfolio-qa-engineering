# Design — Portfolio QA Engineering (KATA boilerplate → lean QA/SDET portfolio)

- **Date:** 2026-09-08
- **Status:** Approved (brainstorming)
- **Author:** Juan Leites (`jpl1899`)
- **Supersedes:** the agentic-qa-boilerplate / KATA setup currently in this repo

---

## 1. Problem & Goal

This repo currently holds the `agentic-qa-boilerplate` (KATA — "Component Action Test
Architecture" — plus a full Jira/Xray/skills orchestration layer). That machinery is
house-specific, unrecognised in the job market, and noise to an external reviewer.

**Goal:** turn this repo into a lean, self-explanatory **QA/SDET portfolio** that an
interviewer can read end-to-end in ~10 minutes and that demonstrates real competence in
three disciplines against a single realistic system:

1. **API testing**
2. **UI automation**
3. **DB testing**

The portfolio is built **"from zero to 100"** as a sequence of daily modules. Each module
teaches one concept, is built collaboratively (professor / tech-lead mode), ships running
tests plus a short written lesson, and is merged to `main` via its own Pull Request. The
**PR history is itself part of the portfolio** — it shows a visible learning progression.

### Non-goals

- Not keeping KATA naming or the Jira/Xray/skills layer.
- Not building or maintaining the System Under Test (we use an existing one).
- Not a tutorial series for others — it is a personal portfolio; the writeups are concise
  engineering notes, not blog posts.
- Not multi-language. One stack (see §4).

---

## 2. System Under Test — Toolshop

**`testsmith-io/practice-software-testing`** ("Toolshop"), an e-commerce practice app:

| Layer | Tech |
|---|---|
| Frontend | Angular SPA |
| API | REST, Laravel/PHP, OpenAPI 3 spec at `/api/documentation` |
| Database | MySQL |

**Why Toolshop:** one coherent domain (catalog, cart, checkout, coupons, admin/customer
roles, invoices, favourites) rich enough to derive non-trivial test cases (equivalence
partitioning on prices, state transitions on order status, decision tables on discount
rules); all three layers are real (documented REST API, real SPA, real relational DB); it
runs locally via Docker Compose so DB testing is deterministic; and it is an
industry-recognised QA practice target a reviewer understands instantly.

### How we run it

- **Primary:** local via `docker-compose` pinned to a specific Toolshop release, under
  `sut/`. Required for DB testing and for deterministic, isolated runs.
- **Secondary (optional):** the hosted API `https://api-v2.practicesoftwaretesting.com`
  for read-only smoke checks only. Never for write/DB scenarios.
- **Prerequisite:** Docker Desktop on the dev machine and a MySQL-capable service in CI.
  Verified before Day 0 implementation starts.

---

## 3. Repository home & git strategy

### Home

The portfolio must live under the author's **personal** GitHub account, not the
`upex-galaxy` org.

- New repo: **`github.com/jpl1899/portfolio-qa-engineering`**.
- `origin` is repointed to the new repo. History starts fresh at Day 0 (see §5).
- The existing `upex-galaxy/jpl-bunkai-qa-engineering` repo is left untouched.

### Branching & PR flow

- `main` is the only long-lived branch and is protected.
- One branch per module: `module/NN-slug` (e.g. `module/04-contract-testing`).
- Each module ships **one PR** containing: the test code, the module writeup
  (`docs/modules/NN-*.md`), and any fixture/helper it introduces.
- **Squash merge** to `main`. Conventional commit messages. **No AI attribution.**
- Pushing to `main` directly is not done — everything lands through a PR.

### Day-0 safety net

Before any deletion: `git tag archive/kata-boilerplate` on the current tip and push that
tag to the new remote (and/or keep it on the old remote). Nothing is lost; the full
boilerplate remains recoverable from the tag.

---

## 4. Tooling stack

**Single stack: Playwright + TypeScript + Bun**, with Allure as the unified report.

| Concern | Tool |
|---|---|
| Test runner (all layers) | `@playwright/test` |
| UI automation | Playwright browser APIs, role-based locators, web-first assertions |
| API testing | Playwright `APIRequestContext` (same runner, same report) |
| Contract testing | `ajv` validating responses against Toolshop's OpenAPI schema |
| DB testing | `mysql2` client (connection pool) against the Compose MySQL |
| Test data | `@faker-js/faker` + hand-written builders/factories |
| Reporting | `allure-playwright` → Allure HTML, history/trends published to GitHub Pages |
| Lint / format / types | ESLint (`@antfu/eslint-config`), Prettier, `tsc --noEmit` |
| Pre-commit | Husky + lint-staged: lint + typecheck only |
| Package manager / runtime | Bun |

Rationale: one language and one runner is the most marketable and the easiest to explain
in an interview; API + UI + DB share fixtures and a single report; the whole suite runs as
one job in CI.

---

## 5. Day 0 — repository reset

### 5.1 Remove from `main`

Directories/files that are boilerplate machinery, not portfolio:

- `.agents/`, `.context/`, `cli/`, `.claude/skills/`, `.claude/commands/`, `packages/`,
  `api/` (boilerplate OpenAPI pipeline), `.template/`, `.session/`, `.backups/`
- `kata-manifest.json`, `scripts/kata-manifest.ts`
- `INSTALLER.md`, `CONTEXT.md`, `dbhub.toml`, `opencode.jsonc`
- `docs/**` UPEX method content: `agentic-quality-engineering.md`, `ai-personality.md`,
  `architectures/`, `methodology/`, `qa-standard/`, `onboarding.html`, `workflows/`,
  `setup/`, `mcp/`, `testing/` — the whole tree is replaced (see §6).
- All Jira/Xray wiring: `scripts/sync-jira-*.ts`, `scripts/check-jira-setup.ts`,
  `cli/xray/`, `.agents/jira-*` and the matching `package.json` script keys
  (`jira:*`, `xray`, `kata:manifest*`, `skills:*`, `vars:*`, `agents:setup`, `up`,
  `onboarding`, `setup*`, `api:*`, `test:sync`).
- `tests/**` — delete the 5 practice specs (`example.spec.ts`,
  `firstChallangue.test.ts`, `portfolioLogin.test.ts`, `2-addTaskFeature.test.ts`,
  `APis/regres-users.spec.ts`). The KATA `tests/components|data|e2e|integration|setup|teardown|utils`
  are already deleted in the working tree — commit that.

### 5.2 Replace / rewrite

| File | New content |
|---|---|
| `CLAUDE.md` | Minimal: project purpose, stack, "run the SUT first", commands, git flow. ~40 lines. |
| `README.md` | Portfolio front page: narrative, architecture diagram, module index, how to run. |
| `playwright.config.ts` | Clean config for Bun: `testDir: ./tests`, projects for `api` / `ui` / `db` / `integration`, an `auth-setup` project for UI storage state, Allure + list reporters, trace/screenshot/video on failure, `webServer` omitted (SUT is external via Compose), sensible timeouts, `forbidOnly` on CI. |
| `package.json` | Trim scripts to: `test`, `test:api`, `test:ui`, `test:db`, `test:integration`, `test:headed`, `test:ui-mode`, `test:report`, `lint`, `lint:fix`, `format`, `types:check`, `sut:up`, `sut:down`, `sut:logs`, `allure:generate`, `allure:open`. Drop all boilerplate deps not used by the new stack; add `ajv`, `mysql2`. |
| `.husky/pre-commit` | `bunx lint-staged` + `bun run types:check` only. |
| `.husky/pre-push` | `bun run lint && bun run types:check`. |
| `.github/workflows/ci.yml` | Rewritten for Bun (see §9). Delete `playwright.yml`. |
| `allurerc.mjs` | Strip UPEX-specific config; keep a minimal Allure 3 setup. |
| `.env.example` | Only: `SUT_WEB_URL`, `SUT_API_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CUSTOMER_EMAIL`, `CUSTOMER_PASSWORD`. |

### 5.3 Result

`main` after Day 0 is a lean skeleton that lints, type-checks, and has a green (empty)
Playwright run plus a CI pipeline that builds. This is the first PR: `module/00-repo-setup`.

---

## 6. Target repository structure

```
portfolio-qa-engineering/
  README.md                       # narrative + architecture + module index
  CLAUDE.md                       # minimal AI/context notes
  docs/
    design/
      2026-09-08-portfolio-qa-pivot.md   # this document
    architecture.md               # how the framework is wired (fixtures, layers, CI)
    modules/                      # 00-repo-setup.md, 01-http-rest.md, ...  one per module
  sut/
    docker-compose.yml            # Toolshop pinned to a release
    README.md                     # how to bring the SUT up/down, seeded credentials
  src/
    config/                       # env loading, base URLs, credentials (from .env only)
    api/                          # service clients / request builders (no assertions)
    ui/                           # page objects (no assertions)
    db/                           # mysql2 pool + typed query helpers (return null on miss)
    data/                         # builders + faker factories
    fixtures/                     # test.extend: apiRequest, authedRequest, db, seededUser, storageState
  tests/
    api/
    ui/
    db/
    integration/                  # the trifecta (DB seed → API act → UI + DB verify)
  .github/workflows/ci.yml
  playwright.config.ts
  package.json
```

### Layer contract

| Unit | Does | Depends on | Rule |
|---|---|---|---|
| `src/config` | resolves env → typed config object | `.env` | no hard-coded URLs/creds anywhere else |
| `src/api/*Client` | one class per API resource; builds + sends requests, returns parsed bodies | `apiRequest` fixture, `config` | fail fast on transport errors; **no test assertions** |
| `src/ui/*Page` | one class per page/area; locators + actions | Playwright `page` | **no assertions**; locators inline unless reused |
| `src/db/*` | connection pool + query helpers | `config` | helpers return `null`/`[]` on no-match, never throw for "not found" |
| `src/data` | builders producing valid/invalid domain objects | `faker` | pure; no I/O |
| `src/fixtures` | `test.extend` wiring the above into tests | all of the above | one fixture = one responsibility; teardown always closes resources |
| `tests/**` | orchestrate fixtures + clients + pages; **all assertions live here** | fixtures | one spec file = one feature/endpoint area |

---

## 7. Fixtures (technical core)

Defined in `src/fixtures/`, composed into a single `test` export used by all specs.

| Fixture | Scope | Provides | Teardown |
|---|---|---|---|
| `apiRequest` | worker | `APIRequestContext` bound to `SUT_API_URL` | dispose context |
| `authedRequest` | worker | `apiRequest` variant carrying a Bearer token from `POST /users/login`; token cached per worker | dispose context |
| `db` | worker | `mysql2` pool bound to the Compose MySQL | `pool.end()` |
| `seededUser` | test | a customer created via API, unique per test | delete the user (API or DB) |
| `storageState` | project (`auth-setup`) | authenticated browser storage state for UI specs | file persisted under `.auth/` (git-ignored) |

UI specs consume `{ page }` (+ `storageState` via project dependency). API specs consume
`{ apiRequest }` or `{ authedRequest }` — **no browser**. DB specs consume `{ db }`.
Integration specs consume `{ authedRequest, db, page }`.

---

## 8. Curriculum — "from zero to 100"

~24 modules across 4 phases. Each module = one PR = one `docs/modules/NN-*.md` writeup +
its tests. Order is pedagogical: each builds on the previous.

### Phase 1 — API testing (modules 01–08)

| # | Module | Concept taught |
|---|---|---|
| 01 | First API test — `GET /products` | HTTP/REST basics, `APIRequestContext`, status/headers/body-shape assertions |
| 02 | Authentication | `POST /users/login`, Bearer tokens, `authedRequest` fixture, negative (bad creds → 401) |
| 03 | CRUD lifecycle | create → read → update → delete on one resource, response assertions, cleanup discipline |
| 04 | Contract testing | validate responses against Toolshop's OpenAPI with `ajv`; catch schema drift |
| 05 | Test design for APIs | equivalence partitioning + boundary value analysis on pagination / price filters / search |
| 06 | Negative & error paths | 400/401/403/404/422, malformed payloads, error-guessing, consistent error envelopes |
| 07 | Data-driven tests | parametrised specs, faker payloads, builders, valid/invalid matrices |
| 08 | API architecture | service clients / request builders, DRY without over-abstraction, review of Phase 1 |

### Phase 2 — UI automation (modules 09–16)

| # | Module | Concept taught |
|---|---|---|
| 09 | Locators & the golden rules | role-based / user-facing locators, auto-waiting, first UI test on the catalog |
| 10 | Page Object Model, done right | one POM (login), actions vs assertions separation, locators inside the POM |
| 11 | End-to-end flow | register → login → browse → add to cart → checkout, web-first assertions |
| 12 | Custom fixtures for UI | `auth-setup` project, `storageState`, extending `test` |
| 13 | Test-data strategy for UI | seed via API (fast), verify via UI (real); avoid UI-driven setup |
| 14 | The hard parts | `waitForResponse`, dynamic content, dialogs, file upload/download, no `waitForTimeout` |
| 15 | Cross-cutting checks | accessibility smoke with `axe-core`, `@smoke`/`@critical` tags, trace/video on failure |
| 16 | Flake hunting | retry policy, test isolation, deterministic data, root-causing instead of masking |

### Phase 3 — DB testing (modules 17–22)

| # | Module | Concept taught |
|---|---|---|
| 17 | Why DB testing | gaps API/UI can't see; `db` fixture, connecting to the Compose MySQL |
| 18 | State verification | API creates a product → assert the row exists with correct columns/types |
| 19 | Data integrity | FK constraints, cascade deletes, unique constraints — triggered via API, checked in DB |
| 20 | Seeding & teardown via DB | deterministic fixtures, truncate-and-reseed, transaction rollback pattern |
| 21 | UI ↔ DB consistency | checkout writes `invoices` + line items correctly; totals match |
| 22 | Schema awareness | reading the schema, guarding against silent schema drift |

### Phase 4 — Integration & close-out (modules 23–24)

| # | Module | Concept taught |
|---|---|---|
| 23 | The trifecta in one test | seed via DB → act via API → verify via UI **and** DB |
| 24 | CI hardening & portfolio polish | sharding/parallelism, flaky quarantine, Allure history on Pages, README architecture diagram, "what I'd do next" |

The roadmap is a guide, not a contract: modules can be split, merged, or reordered as we
go, but the phase order (API → UI → DB → integration) is fixed.

---

## 9. CI/CD — GitHub Actions

File: `.github/workflows/ci.yml`. Runner: `ubuntu-latest`. Runtime: Bun.

**Triggers:** `push` to any branch, `pull_request` targeting `main`.

**Jobs:**

1. **`lint-types`** — `oven-sh/setup-bun`, `bun install`, `bun run lint`, `bun run types:check`.
2. **`test`** — needs `lint-types`.
   - Start the SUT: `docker compose -f sut/docker-compose.yml up -d --wait` (Toolshop API +
     Angular + MySQL). Health-check the API before proceeding.
   - `bun install`, cache + install Playwright browsers (`bunx playwright install --with-deps chromium`).
   - `bun run test` (all projects: api, ui, db, integration).
   - Always upload `allure-results/` and the Playwright HTML report as artifacts.
3. **`report`** — needs `test`, only on `push` to `main`.
   - `bunx allure generate` merging previous history, publish to GitHub Pages
     (`gh-pages` branch or Pages action). History/trends accumulate across merges.

**Hardening (added incrementally, finalised in module 24):** browser + Bun caching,
Playwright sharding matrix once the suite is large enough, a `@quarantine` grep excluded
from the required check.

---

## 10. Working mode — professor / tech-lead

Every module follows the same loop:

1. **Concept first.** Explain why the concept exists, what problem it solves, common
   misuse, and when *not* to use it — before any code.
2. **Design together.** Propose approaches with trade-offs; the author decides.
3. **Build & go green.** Write the test(s) and supporting fixtures/clients; run them.
4. **Write it up.** `docs/modules/NN-*.md`: what was learned, decisions made, what I'd do
   differently. Concise engineering notes.
5. **Ship.** Open the `module/NN-slug` PR, review, squash-merge, which deploys to
   `github.com/jpl1899/portfolio-qa-engineering`.

---

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Docker not available / SUT flaky locally | Pin Toolshop to a known-good release; document `sut:up`/`sut:down`; hosted API as read-only fallback for a subset of API modules |
| Toolshop schema/endpoints change on version bump | Version is pinned in `sut/docker-compose.yml`; a bump is its own deliberate PR |
| CI time balloons as suite grows | Sharding + caching in module 24; keep `@smoke` subset as the fast required check |
| DB tests coupling to internal schema (brittle) | Treat schema-coupled assertions as intentional "grey-box" checks, isolated in `tests/db/`, documented as such |
| Losing the boilerplate we might still want | `archive/kata-boilerplate` tag before any deletion |
| Portfolio reads as "AI-generated" | Professor-mode writeups in the author's voice; PR history shows incremental human decisions; no AI attribution in commits |

---

## 12. Open items (resolved before implementation)

- [ ] Create `github.com/jpl1899/portfolio-qa-engineering` (empty, no auto-README).
- [ ] Confirm Docker Desktop is installed and `docker compose` works locally.
- [ ] Pick the Toolshop release tag to pin.
- [ ] Decide GitHub Pages publishing mechanism (Pages Action vs `gh-pages` branch).

---

## 13. Definition of done (for the pivot as a whole)

- `main` on the new personal remote contains only portfolio-relevant files.
- `README.md` explains the project, stack, and how to run it, with an architecture diagram.
- All 24 modules merged, each with tests and a writeup.
- CI green on `main`; Allure report published and linked from the README.
- `archive/kata-boilerplate` tag preserved.
