# Checklist de Saúde do Build e Deploy

Use esta lista antes de cada deploy ou merge para main.

## 1. Ambiente Local
- [ ] **Dependências Limpas**: `npm ci` (instalação limpa baseada no lockfile).
- [ ] **Schema Sincronizado**: `npx prisma generate` (deve usar `prisma/schema.prisma`).
- [ ] **Verificação de Tipos**: `npx tsc --noEmit` (sem erros de TypeScript).
- [ ] **Linting**: `npm run lint` (sem erros ou warnings críticos).
- [ ] **Build Local**: `npm run build` (sucesso sem flags de ignore).

## 2. Banco de Dados
- [ ] **Schema Match**: O schema do banco de produção corresponde ao `prisma/schema.prisma`?
- [ ] **Migrations**: `npx prisma migrate status` retorna "Database schema is up to date"?

## 3. Testes
- [ ] **Unitários**: `npm run test` (se houver).
- [ ] **Smoke Test**: Rodar aplicação localmente e acessar `/api/news` e Home Page.

## 4. Pre-Deploy
- [ ] **Variáveis de Ambiente**: Todas as variáveis novas estão configuradas na Vercel?
- [ ] **Branch**: Estou na branch correta (`main` ou `staging`)?

## 5. Comandos de Emergência (Rollback)
- **Reverter Commit**: `git revert HEAD`
- **Redeploy Vercel**: `vercel rollback` (ou via dashboard)
- **Restaurar Banco**: Ter dump recente disponível.
