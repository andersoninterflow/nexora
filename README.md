# Ecossistema Digital NEXORA

O **Ecossistema Digital NEXORA** é um monorepo que reúne a API principal, serviços de suporte e um painel web para administração.  Este repositório foi criado para servir como ponto de partida de um ecossistema modular, com foco em boas práticas de segurança, testes automatizados e documentação clara.

## Visão Geral

O objetivo do projeto é oferecer uma base robusta para aplicações que exijam autenticação, autorização por papéis (RBAC), notificações e observabilidade.  A API foi construída em **Node.js** com **TypeScript** e **Fastify**, utilizando **Prisma** como ORM para o banco de dados **PostgreSQL**.  O frontend é construído com **Next.js**.  A infraestrutura local é provida via **Docker Compose**.

Este monorepo utiliza workspaces para organizar os códigos em apps e pacotes compartilhados:

- `apps/api` – backend principal (Fastify + Prisma)
- `apps/web` – painel administrativo (Next.js)
- `packages/shared` – tipos e utilitários reutilizáveis
- `packages/config` – configurações compartilhadas de ESLint/Prettier/TypeScript
- `packages/logger` – logger estruturado
- `packages/sdk` – cliente para consumir a API

## Funcionalidades Principais

- **Autenticação e Autorização**: geração de tokens JWT de acesso e refresh, armazenamento seguro de senhas e controle de acesso baseado em papéis (RBAC).
- **Notificações**: serviço para envio de e‑mails e webhooks.  A configuração de SMS é opcional e pode ser habilitada via provider externo.
- **Observabilidade**: logs estruturados em JSON, métricas e tracing prontos para integração com ferramentas externas.
- **Teste Automatizado**: incluem testes unitários e de integração utilizando **Vitest** e **Supertest**.
- **CI/CD**: pipeline via **GitHub Actions** que roda lint, testes e build a cada commit.

## Quickstart

### Pré‑requisitos

- **Node.js** >= 18
- **pnpm** (utilizamos [pnpm](https://pnpm.io) como gerenciador de pacotes, mas você pode usar npm/yarn adaptando scripts)
- **Docker** e **Docker Compose** instalados

### Passos iniciais

1. **Clone o repositório**

   ```bash
   git clone https://github.com/andersoninterflow/nexora.git
   cd nexora
   ```

2. **Instale as dependências**

   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**

   Copie o arquivo `.env.example` para `.env` e preencha as variáveis com seus próprios valores.

   ```bash
   cp .env.example .env
   ```

4. **Suba os serviços via Docker Compose**

   ```bash
   docker-compose up --build
   ```

   Esse comando inicializará o PostgreSQL, Redis e a API.  Após o primeiro start, o Prisma rodará as migrações automaticamente.

5. **Acesse a aplicação**

   - API: `http://localhost:3000/v1/health` – rota de saúde.
   - Documentação OpenAPI: `http://localhost:3000/docs` (exposta pelo Fastify Swagger).
   - Painel administrativo: `http://localhost:3001` (caso a app web esteja configurada).

6. **Rodar os testes**

   Execute os testes unitários e de integração:

   ```bash
   pnpm test
   ```

7. **Seed de desenvolvimento**

   Para gerar um usuário administrador padrão, rode:

   ```bash
   pnpm --filter @nexora/api prisma db seed
   ```

## Estrutura de Pastas

```
├── apps
│   ├── api
│   │   ├── src
│   │   │   ├── main.ts
│   │   │   ├── routes
│   │   │   │   ├── auth.ts
│   │   │   │   └── user.ts
│   │   │   ├── plugins
│   │   │   │   └── auth.ts
│   │   │   └── utils
│   │   ├── prisma
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── tests
│   └── web
│       └── ... (Next.js)
├── packages
│   ├── shared
│   ├── config
│   ├── logger
│   └── sdk
├── docs
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   └── API.md
├── .github
│   └── workflows
├── .env.example
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── LICENSE
```

## Suposições e Decisões

Este projeto fornece uma base inicial e **não contém segredos reais**.  Para ambientes de produção, recomenda‑se utilizar um serviço de gerenciamento de segredos (como AWS Secrets Manager ou HashiCorp Vault) em vez de variáveis de ambiente simples.  Da mesma forma, o serviço de notificações implementa apenas o envio de e‑mails via terminal; adapte para seu provedor.

## Troubleshooting

- **Erro de conexão com o banco**: verifique se as variáveis `DATABASE_URL` no `.env` e no `docker-compose.yml` apontam para as credenciais corretas.  O container `db` do Docker Compose expõe a porta 5432.
- **As migrações do Prisma não rodam**: execute `pnpm prisma migrate dev` dentro de `apps/api` para gerar/rodar as migrações.
- **CORS**: ajuste a variável `CORS_ORIGIN` conforme o domínio de seu frontend.

## Licença

Distribuído sob a licença MIT.  Consulte o arquivo `LICENSE` para mais detalhes.
