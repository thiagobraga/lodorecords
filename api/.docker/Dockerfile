FROM oven/bun:1-alpine AS base
WORKDIR /app

# Dev stage
FROM base AS development
# COPY --chown=bun:bun package.json bun.lockb* ./
COPY --chown=bun:bun package.json ./
RUN bun install
COPY --chown=bun:bun . .
USER bun
EXPOSE 5000
CMD ["bun", "run", "dev"]

# Production stage
FROM base AS production
COPY --chown=bun:bun package.json bun.lockb* ./
RUN bun install --production --frozen-lockfile
COPY --chown=bun:bun . .
USER bun
EXPOSE 5000
CMD ["bun", "run", "start"]
