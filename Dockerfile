# Arty Affairs — Next.js 16 (standalone output) for Dokploy or any Docker host.
# Build:  docker build -t artyaffairs --build-arg NEXT_PUBLIC_SITE_URL=https://artyaffairs.in .
# Run:    docker run -p 3000:3000 -e INQUIRY_WEBHOOK_URL=... artyaffairs

# 1) Install dependencies (cached until package*.json changes)
FROM node:24-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# 2) Build
FROM node:24-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Public URL — baked into canonical links, sitemap.xml and structured data at build time.
ARG NEXT_PUBLIC_SITE_URL=https://artyaffairs.in
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Run — only the standalone server, static assets and public files
FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
