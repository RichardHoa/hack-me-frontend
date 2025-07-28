FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm install -g pnpm # Ensure pnpm is available
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD [ "node", "build" ]