# ── Stage 1: Production ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install production deps only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY src/ ./src/

EXPOSE 5000

CMD ["node", "src/app.js"]

# ── Stage 2: Dev (nodemon hot-reload) ────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY src/ ./src/

EXPOSE 5000

CMD ["npx", "nodemon", "src/app.js"]
