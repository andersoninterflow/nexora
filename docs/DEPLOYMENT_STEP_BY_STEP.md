# NEXORA - Passo a passo (Rebuild v2)

Este guia recria o projeto do zero (como monorepo), roda localmente com Docker e ensina como publicar no GitHub no repositório:
https://github.com/andersoninterflow/nexora

## 1) Requisitos
- Node.js 18+
- pnpm 9+ (via Corepack)
- Docker + Docker Compose
- Git (configurado com sua conta)

## 2) Baixar o projeto (ZIP) e abrir a pasta
Baixe o pacote do rebuild e extraia em uma pasta, por exemplo:
- Windows: `C:\\dev\\nexora`
- Linux/macOS: `~/dev/nexora`

## 3) Configurar variáveis de ambiente
Copie `.env.example` para `.env` e ajuste se necessário.

## 4) Subir tudo com Docker
Na raiz do projeto:
```bash
docker compose up --build
```

O Compose sobe:
- Postgres (porta 5432)
- Redis (porta 6379)
- API (porta 3000)
- Web (porta 3001)

Após subir:
- Health: http://localhost:3000/v1/health
- Docs API: http://localhost:3000/docs
- Admin Web: http://localhost:3001

## 5) Seed do admin
O docker-compose executa `prisma db push` e roda o seed.
Credenciais padrão (dev):
- `admin@nexora.local`
- `admin123`

## 6) Rodar fora do Docker (opcional)
```bash
pnpm install
pnpm --filter @nexora/api dev
pnpm --filter @nexora/web dev
```

## 7) Publicar no GitHub (commit + push)
ATENCAO: eu não consigo fazer commit/push por você (exige seu login no GitHub), mas aqui vai o procedimento exato.

### 7.1) Clonar o repo oficial
```bash
git clone https://github.com/andersoninterflow/nexora.git
cd nexora
```

### 7.2) Substituir o conteúdo pelo rebuild
Copie TODOS os arquivos do rebuild para dentro da pasta `nexora/` (sobrescrevendo).

### 7.3) Commit e push
```bash
git status
git add -A
git commit -m "rebuild: monorepo NEXORA v2 (api+web+docker+docs)"
git push origin main
```

## 8) Atualizar a máquina local
Para manter sincronizado:
```bash
git pull --rebase
pnpm install
docker compose up --build
```

## 9) Checklist rápido
- [ ] `docker compose up --build` sem erros
- [ ] `/v1/health` retorna ok
- [ ] `/docs` abre o Swagger
- [ ] Login no web retorna token
- [ ] CI no GitHub roda (Actions)
