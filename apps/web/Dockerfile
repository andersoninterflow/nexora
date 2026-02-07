FROM node:18-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install
WORKDIR /app/apps/web

EXPOSE 3001
CMD ["pnpm", "dev"]
