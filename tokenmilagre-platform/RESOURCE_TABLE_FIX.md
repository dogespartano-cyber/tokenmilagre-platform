# Fix: Resource Table Missing

## Problema

A tabela `Resource` não existe no banco de dados, causando erro na home page ao tentar carregar "Ferramentas Essenciais".

**Erro visto:**
- Home page mostra "Carregando recursos..." infinitamente
- Console do servidor mostra erro: `relation "Resource" does not exist`

## Causa

O schema Prisma define o model `Resource`, mas a tabela nunca foi criada no banco de dados através de uma migração.

## Soluções

### Solução 1: Executar Migração Automática (Recomendado)

```bash
cd tokenmilagre-platform
npx prisma migrate deploy
```

### Solução 2: Sincronizar Schema com DB Push

```bash
cd tokenmilagre-platform
npx prisma db push
```

### Solução 3: Executar SQL Manualmente

Se as soluções acima não funcionarem (ex: problemas de permissão ou versão do Prisma):

```bash
# Conectar ao banco de dados e executar o SQL
psql $DATABASE_URL < prisma/manual-migration-resource-table.sql
```

Ou execute diretamente o SQL em:
- `prisma/migrations/20251121000000_add_resource_table/migration.sql`
- `prisma/manual-migration-resource-table.sql` (versão com verificação se já existe)

## Arquivos Criados

1. **Migração SQL**:
   - `prisma/migrations/20251121000000_add_resource_table/migration.sql`
   - Cria a tabela Resource com todos os campos necessários

2. **SQL Manual** (com verificação):
   - `prisma/manual-migration-resource-table.sql`
   - Verifica se a tabela existe antes de criar
   - Pode ser executado múltiplas vezes sem erro

## Verificação

Após aplicar qualquer uma das soluções:

1. Restart o servidor Next.js
2. Acesse a home page
3. Verifique se "Ferramentas Essenciais" carrega corretamente
4. Verifique os logs do servidor - não deve mais mostrar erro

## Estrutura da Tabela Resource

A tabela contém os seguintes campos principais:

- **Identificação**: id, slug, name, category
- **Conteúdo**: shortDescription, officialUrl, platforms, tags
- **Seções da página**: heroTitle, heroDescription, features, howToStartSteps
- **Avaliação**: pros, cons, faq, securityTips
- **Metadados**: verified, views, createdAt, updatedAt

## Contexto do Bug

- **Data**: 2025-11-21
- **Sessão**: claude/skill-review-verification-01Vc8iNrX4QCpWqQXpU2faRa
- **Commit anterior**: 63b8520
- **Correções relacionadas**:
  - fix: corrigir validação Zod na criação de artigos
  - fix: corrigir erro de acesso ao dashboard

## Documentação

Veja também:
- `.claude/skills/core/tokenmilagre-database/SKILL.md` - Skill atualizada com este bugfix
- `docs/TROUBLESHOOTING.md` - Troubleshooting geral do projeto
