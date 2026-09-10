# Toolshop — system under test

The tests run against [`testsmith-io/practice-software-testing`](https://github.com/testsmith-io/practice-software-testing),
run locally via Docker Compose.

## Status

`docker-compose.yml` is added in **module 01**, pinned to a specific Toolshop
release so the API surface and DB schema stay stable. Until then, bring the
app up from its own repo if you want to explore.

## Once it exists

```bash
bun run sut:up      # start API + Angular + MySQL, wait for health
bun run sut:logs     # follow logs
bun run sut:down     # stop and wipe volumes
```

Seeded credentials and exact ports will be documented here alongside the
Compose file.
