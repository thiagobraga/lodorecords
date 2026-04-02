FROM oven/bun:1-alpine AS base
WORKDIR /app

# Dev stage
FROM base AS development
COPY --chown=bun:bun .docker/entrypoint.sh /entrypoint.sh
COPY --chown=bun:bun . .
RUN apk add --no-cache su-exec libstdc++ \
  && chmod +x /entrypoint.sh \
  && bun i \
  && chown -R bun:bun .
USER bun
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "dev"]

# Production stage
FROM base AS production
COPY --chown=bun:bun package.json bun.lockb* ./
RUN bun install --production --frozen-lockfile
COPY --chown=bun:bun . .
USER bun
EXPOSE 5000
CMD ["bun", "run", "start"]
