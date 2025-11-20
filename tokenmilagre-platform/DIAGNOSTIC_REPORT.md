# Relatório de Diagnóstico: Falhas de Build e Instabilidade

**Data:** 20 de Novembro de 2025
**Status:** CRÍTICO
**Versão do Schema Ativa:** v1 (baseado em `prisma/schema.prisma` e uso no código)
**Versão Alvo:** v2 (baseado em `MIGRATION_PLAN.md` e `prisma/schema-v2.prisma`)

## 1. Resumo Executivo

O projeto encontra-se em um estado de **inconsistência arquitetural**. Embora o código da aplicação (`app/`) e o schema principal (`prisma/schema.prisma`) estejam alinhados na versão v1, a presença de artefatos da versão v2 e a supressão de erros de lint (`ignoreDuringBuilds: true`) mascaram uma dívida técnica severa (~2800 erros de lint).

O build local passa apenas porque as verificações de qualidade estão desligadas. Em um ambiente de CI/CD rigoroso, ou se a flag de ignore for removida, o build falhará imediatamente. Além disso, há risco iminente de "drift" de schema se comandos de migração v2 forem executados acidentalmente.

## 2. Análise de Causas-Raiz

### A. Incompatibilidade de Schema (Latente)
*   **Estado Atual:** O código consome campos da v1 (`published: Boolean`, `category: String`).
*   **Risco:** Existem arquivos `prisma/schema-v2.prisma` e scripts de migração. Se um desenvolvedor ou pipeline rodar `prisma generate --schema=prisma/schema-v2.prisma`, o `node_modules/@prisma/client` será atualizado para v2, quebrando **toda** a aplicação (pois v2 remove `published` e muda `category`).
*   **Evidência:** `app/api/news/route.ts` acessa `article.published` e `article.category` (string), que não existem na v2.

### B. Qualidade de Código e Linting
*   **Erro:** `npm run lint` falha com **2886 problemas** (944 erros, 1942 warnings).
*   **Impacto:** O arquivo `next.config.ts` está configurado com `eslint: { ignoreDuringBuilds: true }`. Isso permite que código com erros de importação, tipos incorretos ou variáveis não utilizadas chegue a produção.
*   **Principais Erros:**
    *   `@typescript-eslint/no-require-imports`: Uso de `require()` em arquivos TS/JS modernos.
    *   `@typescript-eslint/no-unused-vars`: Variáveis declaradas e não usadas (poluição de código).
    *   Possíveis erros de tipo mascarados pelo lint desligado.

### C. Dependências e Configuração
*   **Prisma:** A versão do client gerada pode estar dessincronizada se não houver um hook `postinstall` estrito apontando para o schema correto.
*   **CI/CD:** A falta de um pipeline que enforce `lint` e `type-check` antes do build permite que a instabilidade se propague.

## 3. Mapeamento de Impacto

| Componente | Status | Impacto |
| :--- | :--- | :--- |
| **Build Local** | ⚠️ Passa (Falso Positivo) | Passa apenas por supressão de erros. Código frágil. |
| **Linting** | ❌ Falha Crítica | ~2800 erros impedem verificação de qualidade real. |
| **API Routes** | ⚠️ Risco Alto | Funcionam com v1, quebrariam instantaneamente com client v2. |
| **Database** | ⚠️ Risco Médio | Dados podem ficar inconsistentes se migrations v2 forem rodadas parcialmente. |

## 4. Recomendações Imediatas

1.  **Travar Schema v1:** Garantir que `package.json` e scripts de build usem explicitamente `prisma/schema.prisma` (v1) até que a migração de código esteja pronta.
2.  **Saneamento de Lint:** Executar correções automáticas (`eslint --fix`) e corrigir manualmente erros críticos de importação.
3.  **CI Strict:** Implementar check de lint no CI para impedir regressão.
4.  **Planejamento v2:** Só migrar o banco para v2 **após** refatorar o código para suportar os novos campos (estratégia de *Expand and Contract*).
