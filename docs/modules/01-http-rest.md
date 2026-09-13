# Module 01 — First API test: `GET /products`

**Goal:** pin the Toolshop SUT to a real release, bring it up via Compose, and
write the first real test — proving the whole chain (config → SUT →
Playwright → assertions) actually works.

## What changed

- **`sut/docker-compose.yml`** — added, pinned to Toolshop **`2.4`**.
  Trimmed from upstream's own `docker-compose.prod.yml` (prebuilt images
  instead of building from source): `mariadb`, `laravel-api`, `web` (nginx,
  proxies to the API), `angular-ui`. `cron` (order-status transitions,
  invoice generation) is dropped until a module needs it.
- **`src/config`, `.env.example`, `.env`** — fixed `SUT_API_URL`. It was
  `http://localhost:8091/api`, carried over from Day 0 as a generic
  assumption. The live SUT proved that wrong: Laravel's
  `RouteServiceProvider` registers `routes/api.php` with no `/api` prefix —
  the API lives at the docroot. Confirmed against the running container
  (`route:list`, then a direct `curl`) before touching the test.
- **`tests/api/products.spec.ts`** — added. Uses Playwright's built-in
  `request` fixture directly (no custom fixture yet — that starts in module
  02 with `authedRequest`). Asserts status, `content-type`, the pagination
  envelope (`current_page`/`data`/`last_page`/`per_page`/`total`), and the
  shape of every item in `data`. Field list and types came from the actual
  `ProductResponse` OpenAPI schema in the Toolshop source at `2.4`, not
  guessed.
- **`package.json`** — dropped `--pass-with-no-tests` from `test:api` now
  that it has a real test. Left on `test` and the other `test:*` scripts —
  `ui`/`db`/`integration` are still empty.

## Decisions

- **Pin `2.4`, not `latest`.** Reproducible runs; a version bump is its own
  deliberate PR (already the plan in the design doc's risk table).
- **Prebuilt images (`docker-compose.prod.yml`), not the dev compose.**
  Upstream's own `docker-compose.yml` builds from source and expects their
  full monorepo checkout (a `${SPRINT}` path, their own `.git` mounted) — not
  something an external consumer can run standalone.
- **Migrations run on every `sut:up`.** The prebuilt images don't migrate
  automatically — confirmed against Toolshop's own CI, which runs
  `migrate:refresh --seed` by hand after polling MariaDB. `laravel-api`'s
  `command` here does the same on every start, so one `bun run sut:up` is
  enough and every run starts from the same seeded state. `sut:down -v`
  already wiped the MySQL volume, for the same reason.
- **Raw `request` fixture, no client class yet.** Module 01 is about HTTP
  basics with `APIRequestContext`; a `ProductsClient` wrapper would hide the
  thing being taught. Request builders land in module 08.

## What I'd do differently

- The Angular UI image only publishes `linux/arm64` — it runs emulated
  (QEMU) on this amd64 host. Harmless for now (nginx logs a benign
  `io_setup() failed` from an unsupported AIO syscall under emulation), but
  worth knowing before module 09 leans on it for real UI runs — if it's
  slow or flaky there, that's why.
- Healthchecks use `127.0.0.1`, not `localhost`, on purpose: the `nginx`
  image binds IPv4 only, and `wget` inside the container resolved
  `localhost` to `::1` first, so the healthcheck failed with "connection
  refused" even though the service was up and reachable from the host.

## Verification

- `bun run sut:up` — all four services healthy
- `bun run test:api` — 1 passed
- `bun run lint`, `bun run types:check` — clean
