# Toolshop — system under test

The tests run against [`testsmith-io/practice-software-testing`](https://github.com/testsmith-io/practice-software-testing),
run locally via Docker Compose, **pinned to release `2.4`** so the API surface
and DB schema stay stable across the whole portfolio.

`docker-compose.yml` here is a trimmed version of upstream's own
`docker-compose.prod.yml` (prebuilt images instead of building from source):
`laravel-api`, `angular-ui`, `web` (nginx, proxies to the API) and `mariadb`.
`cron` (order-status transitions, invoice generation) is dropped until a
module needs it.

## Usage

```bash
bun run sut:up       # start API + Angular + MySQL, wait for health
bun run sut:logs     # follow logs
bun run sut:down     # stop and wipe volumes
```

Requires Docker Desktop running locally.

## Migrations run on every `sut:up`

Upstream's prebuilt images don't migrate the DB automatically — confirmed
against their own CI, which runs `migrate:refresh --seed` by hand after
waiting on MariaDB. `laravel-api` here does the same on every start
(`migrate:fresh --seed --force` before `php-fpm`), so one command is enough
and every run starts from the same seeded state. `sut:down -v` wipes the
MySQL volume for the same reason — there's no persistent state to reuse.

## URLs & credentials

| | |
|---|---|
| API base | `http://localhost:8091` (no `/api` prefix — Laravel serves it at the docroot) |
| Angular UI | `http://localhost:4200` |
| MySQL | `localhost:3306` / `root` / `root` / db `toolshop` |
| Admin user | `admin@practicesoftwaretesting.com` / `welcome01` |
| Customer user | `customer@practicesoftwaretesting.com` / `welcome01` |

These match `.env.example` — nothing extra to configure.
