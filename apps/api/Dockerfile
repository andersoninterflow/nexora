FROM node:18-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN pnpm install
WORKDIR /app/apps/api
RUN pnpm exec prisma generate

EXPOSE 3000
CMD ["pnpm", "dev"]
