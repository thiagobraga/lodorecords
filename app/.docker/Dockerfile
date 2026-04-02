FROM oven/bun:1-alpine AS base
RUN mkdir -p /app && chown -R bun:bun /app
WORKDIR /app

# Dev stage
FROM base AS development
USER root
COPY --chown=bun:bun package.json ./
# Explicitly fix ownership of the workdir and any potential subdirs
RUN chown -R bun:bun /app
USER bun
RUN bun install
COPY --chown=bun:bun . .
EXPOSE 8080
CMD ["bun", "run", "dev"]

# Build stage
FROM base AS build
COPY --chown=bun:bun package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY --chown=bun:bun . .
USER bun
RUN bun run build
