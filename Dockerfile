# ---- Base Stage ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies Stage ----
FROM base AS deps
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# ---- Builder Stage ----
FROM base AS builder
RUN npm install -g pnpm
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build

# ---- Production Stage ----
FROM base AS runner
WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD [ "node", "build" ]