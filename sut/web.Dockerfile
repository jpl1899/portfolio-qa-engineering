# Upstream's own `web` image (testsmith/practice-software-testing-web) is
# published for linux/arm64 only. Emulated via QEMU it survives locally but
# exits (255) on GitHub Actions' amd64 runners — running a trivial nginx
# reverse proxy emulated is fragile for no reason. Built natively instead,
# from the same vhost config upstream ships (sprint5/_docker/vhost.conf at
# tag 2.4, unmodified — it already targets `laravel-api:9000`, matching our
# service name).
FROM nginx:1.23.3-alpine
COPY vhost.conf /etc/nginx/conf.d/default.conf
