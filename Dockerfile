# Development Dockerfile for Gisto (frontend / web dev)
# Notes:
# - This container runs the Vite dev server for the web frontend.
# - Tauri (native desktop builds) require host OS integration and are NOT packaged here.
# - Mount the project directory as a volume to get hot-reload and local edits reflected.

FROM node:20-bullseye-slim AS base

LABEL maintainer="Gisto"

# install pnpm via corepack
ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl git build-essential python3 make gcc g++ \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare pnpm@latest --activate

# Copy lockfile and package manifest first to leverage caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prefer-offline

# Copy rest of the project
COPY --chown=node:node . .

# Use a non-root user for safety
USER node

# Vite's default port in this project is 61570 (see package.json)
EXPOSE 61570

# Default command runs the dev server and binds to 0.0.0.0 for external access
# Run via shell to ensure arguments are passed correctly by pnpm inside containers
ENV HOST=0.0.0.0
# Run vite directly through pnpm exec to avoid argument passthrough issues
CMD ["sh", "-c", "pnpm exec vite --port 61570 --host 0.0.0.0"]
