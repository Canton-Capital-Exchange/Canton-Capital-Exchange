# Production build of the CCX terminal, served by nginx with /v2/* proxied
# to the Canton sandbox container (see nginx.default.conf.template and
# CANTON_UPSTREAM in docker-compose.yml).

FROM node:22-bookworm-slim AS build

WORKDIR /app
# npm workspaces (src/generated/daml.js/*, the dpm codegen-js output) must
# already be present on disk before `npm ci` resolves the workspace graph,
# so the full context is copied in before install rather than layering
# package.json first for cache reuse.
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.default.conf.template /etc/nginx/templates/default.conf.template

ENV CANTON_UPSTREAM=127.0.0.1:7575

EXPOSE 80
