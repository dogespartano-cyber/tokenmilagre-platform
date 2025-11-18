# Rotas Desabilitadas

Esta pasta contém rotas API que foram desabilitadas devido à migração para o Prisma Schema v2.

## Rotas Desabilitadas

### 1. `/api/project-map`
- **Motivo**: Model `ProjectMap` removido no schema v2
- **Status**: Funcionalidade descontinuada
- **Ação futura**: Reimplementar se necessário com novo schema

### 2. `/api/social-projects`
- **Motivo**: Model `SocialProject` removido no schema v2
- **Status**: Funcionalidade descontinuada
- **Ação futura**: Reimplementar se necessário com novo schema

### 3. `/api/user-progress`
- **Motivo**: Field `UserProgress.badges` removido no schema v2
- **Status**: Gamificação simplificada
- **Ação futura**: Reimplementar badges com novo schema de gamificação

### 4. `/api/articles/import`
- **Motivo**: Ferramenta de importação legada
- **Status**: Pode ter incompatibilidades com schema v2
- **Ação futura**: Atualizar para schema v2 se importação for necessária

## Modelos Removidos do Schema v2

Os seguintes models foram removidos na migração v1 → v2:
- `SocialProject` - Projetos sociais
- `ProjectMap` - Mapa de projetos
- `WarningAlert` - Alertas de aviso
- `ImpactStory` - Histórias de impacto
- `UserProgress.badges` - Sistema de badges (campo)

## Decisões Tomadas

### ✅ Removidas Permanentemente
- `migrate-database` - Migração Neon→Supabase (concluída)
- `setup-supabase-schema` - Setup inicial (concluído)
- `validate-migration` - Validação de migração (concluída)

### ⚠️ Mantidas para Referência Futura
- Rotas listadas acima podem ser reimplementadas se necessário
- Código mantido como referência para futura reimplementação

## Como Reativar uma Rota

1. Adicionar model necessário ao `prisma/schema.prisma`
2. Rodar `npx prisma generate`
3. Atualizar código da rota para schema v2
4. Mover de `_DISABLED_ROUTES/` para `app/api/`
5. Testar extensivamente
6. Atualizar documentação
