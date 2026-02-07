# Arquitetura (v2)

## Visão
- **Monorepo** com workspaces (pnpm)
- **apps/api**: API principal (Fastify) com autenticação JWT, refresh token e RBAC.
- **apps/web**: painel web (Next.js) para validar integração.
- **packages/shared**: tipos/contratos compartilhados.

## Decisões
- **PostgreSQL** como fonte de verdade.
- **Prisma** como ORM.
- **Zod** para validação de entrada.
- **Docker Compose** para ambiente local reprodutível.

## Próximos módulos (roadmap técnico)
- Filas/Jobs (BullMQ + Redis)
- Observabilidade (OpenTelemetry)
- Notificações (email/webhook/SMS provider)
- Multi-tenant (schema-per-tenant ou row-level)
