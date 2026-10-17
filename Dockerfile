FROM node:22-bookworm-slim

WORKDIR /app

COPY . .

RUN corepack enable \
  && pnpm install --frozen-lockfile \
  && pnpm build \
  && pnpm prune --prod \
  && mkdir -p /app/data \
  && chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 8080

USER node

CMD ["node", "src/server.js"]