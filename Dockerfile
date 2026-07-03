FROM node:20-bullseye-slim

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends git python3 build-essential \
 && npm install -g pnpm@10.28.1 \
 && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN git config --system --add safe.directory /app

EXPOSE 61570

CMD ["pnpm", "exec", "vite", "--host", "0.0.0.0", "--port", "61570"]
