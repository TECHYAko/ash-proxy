FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

RUN chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 3000

USER node

CMD ["npm", "start"]
