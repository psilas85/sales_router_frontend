#sales_router_frontend/Dockerfile

# ============================================================
# 🏗 STAGE 1 — BASE (para DEV e BUILD)
# ============================================================
FROM node:20 AS base
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# ============================================================
# 🧪 STAGE 2 — DEV MODE
# ============================================================
FROM base AS dev

ENV NODE_ENV=development

# mantém node_modules dentro do container
CMD ["npm", "run", "dev"]


# ============================================================
# 🚀 STAGE 3 — PROD BUILD
# ============================================================
FROM base AS builder

ENV NODE_ENV=production

RUN npm run build


# ============================================================
# 🔥 STAGE 4 — PROD RUNTIME
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/.env.local .env.local

# instala apenas runtime deps
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]


