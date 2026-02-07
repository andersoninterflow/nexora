# Ecossistema Digital NEXORA

**Slogan:** Onde tudo se conecta.

Monorepo (pnpm workspaces) com:
- **API**: Node.js + TypeScript + Fastify + Prisma (PostgreSQL) + JWT + RBAC
- **Web Admin**: Next.js (painel mínimo de validação)
- **Infra local**: Docker Compose (Postgres + Redis + API + Web)

## Quickstart (local)

1. Clone
```bash
git clone https://github.com/andersoninterflow/nexora.git
cd nexora
```

2. Suba tudo com Docker
```bash
docker compose up --build
```

3. Links
- API health: `http://localhost:3000/v1/health`
- Docs OpenAPI: `http://localhost:3000/docs`
- Web: `http://localhost:3001`

## Seed (admin)
- email: `admin@nexora.local`
- senha: `admin123`

## Documentação
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/SECURITY.md`
- `docs/DEPLOY_GITHUB.md`

## Licença
MIT (veja `LICENSE`).
