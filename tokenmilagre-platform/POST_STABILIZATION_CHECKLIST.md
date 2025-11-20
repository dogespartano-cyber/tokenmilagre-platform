# Checklist de Manutenção e Evolução (Pós-Estabilização)

**Objetivo:** Garantir a saúde, estabilidade e evolução sustentável do projeto.
**Frequência:** Semanalmente ou antes de iniciar grandes features.

## 1. Rotina de Higiene de Código
- [ ] **Lint Check:** Rodar `npm run lint`.
    - **Meta:** Manter erros < 400.
    - **Regra:** NUNCA aumentar o número de erros sem justificativa técnica robusta.
- [ ] **Type Check:** Rodar `npx tsc --noEmit`.
    - **Objetivo:** Flaggar erros TypeScript que podem estar suprimidos pelo build do Next.js.
- [ ] **Dependências Prisma:** Verificar versões com `npm list prisma @prisma/client`.
    - **Regra:** Devem estar EXATAMENTE na mesma versão.

## 2. Scripts e Automação
- [ ] **Teste Manual de Scripts:** Validar execução de scripts críticos (ex: `watch-articles.js`) após updates de bibliotecas.
- [ ] **Limpeza:** Arquivar ou remover scripts `.js` antigos em `scripts/` que não são usados há mais de 2 sprints.

## 3. Segurança e Sincronia de Schema
- [ ] **Verificação de Drift:** Rodar `npx prisma migrate status`.
    - **Objetivo:** Garantir que o banco local está alinhado ao `schema.prisma`.
- [ ] **Backup Sempre:** Fazer backup do banco de dados (dump) ANTES de rodar `prisma db push` ou migrações.

## 4. Preparação para Migração v2
- [ ] **Branch de Migração:** Mudanças para v2 devem ocorrer EXCLUSIVAMENTE na branch `feat/schema-v2`. Nunca no `main`.
- [ ] **Schema Paralelo:** Manter `prisma/schema-v2.prisma` atualizado com correções feitas no schema v1 durante a transição.
- [ ] **Dry Run de Migração:** Testar scripts de migração em um banco clonado (Staging) antes de tocar em produção.
- [ ] **Validação de Data Migration:** Auditar o plano e a execução da transição de dados para novos campos (`categoryId`, `status`, enums).

## 5. CI/CD e Build
- [ ] **Monitoramento de Build:** Verificar logs do GitHub Actions.
    - **Ação:** Se o tempo de build aumentar significativamente, cachear dependências e dividir jobs.
- [ ] **Cobertura e Teste:** Manter cobertura adequada e garantir que `npm run test` seja parte do pipeline sempre que possível.

---

## Instruções para Devs e Equipes

> [!IMPORTANT]
> **Nunca remover regras de lint apenas "para passar o CI".**
> Trate warnings progressivamente seguindo a "Boy Scout Rule" (deixe o código melhor do que encontrou).

> [!WARNING]
> **Priorize a Estabilidade.**
> Scripts de rollback e backups devem estar definidos e testados ANTES de qualquer migração de schema.

*   **Documentação:** Registre decisões e mudanças críticas no `README.md` ou `MIGRATION_PLAN.md`.
*   **Staging:** Use ambientes de staging/testing para validar qualquer passo arriscado antes do deploy.
