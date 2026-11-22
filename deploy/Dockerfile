# Build context is the repository root (see docker-compose.yml)
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
# --ignore-scripts: the nuxt "postinstall" needs the sources, which are not copied yet
RUN bun install --frozen-lockfile --ignore-scripts
COPY . .
ENV NITRO_PRESET=bun
RUN bunx --bun nuxt build

FROM oven/bun:1-slim
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    DATA_DIR=/data
COPY --from=build /app/.output ./.output
# /data holds the SQLite database and uploaded files (mount a volume here)
RUN mkdir -p /data && chown -R bun:bun /data
USER bun
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD bun -e "fetch('http://127.0.0.1:3000/api/content').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["bun", "run", ".output/server/index.mjs"]
