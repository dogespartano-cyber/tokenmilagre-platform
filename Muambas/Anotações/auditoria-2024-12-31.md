# 🔍 Auditoria Completa - TokenMilagre Platform

> **Data:** 2024-12-31  
> **Status:** Em andamento

---

## Contexto

Auditoria forense para identificar código ativo vs dormante, com segregação para pasta `/Muambas`.

**Stack:** Next.js 15 + TypeScript + Prisma + Tailwind  
**Tipo:** Single-package (App Router)

---

## Progresso da Auditoria

### ✅ FASE 1: Reconhecimento (Concluída)

- [x] 525 arquivos de código mapeados
- [x] Entry points identificados
- [x] Configurações catalogadas

### ✅ FASE 2: Análise de Dependências (Concluída)

- [x] 5 componentes órfãos identificados
- [x] 4 SVGs órfãos identificados
- [x] 10 scripts avulsos identificados
- [x] `/app/lab` sem navegação (4 páginas)

### ✅ FASE 3: Classificação (Concluída)

- [x] 5 componentes DORMANTE_CONFIRMADO
- [x] 13 arquivos de log (~620KB) para deleção
- [x] `/app/lab` experimental identificado

### ⏳ FASE 4-6: Pendente

- [ ] Detecção de código oculto
- [ ] Movimentação para Muambas
- [ ] Integração Graphiti

---

## Itens Identificados

### Componentes Órfãos (5)

| Arquivo | Status |
|---------|--------|
| `components/ui/AnimatedLogo.tsx` | Zero imports |
| `components/layout/SectionNav.tsx` | Só no barrel |
| `components/layout/AnimatedBackground.tsx` | Só no barrel |
| `components/shared/ThemeCard.tsx` | Só no barrel |
| `components/shared/NovelEditor.tsx` | Só no barrel |

### Assets Órfãos (4)

- `public/next.svg`
- `public/globe.svg`
- `public/window.svg`
- `public/file.svg`

### Arquivos de Log (~620KB)

```
lint_full_output.txt (228K)
lint_after_entities.txt (224K)
lint_output.txt (88K)
tsc_output.txt (40K)
debug-impermanent.txt
build.log
tsc_output_v2.txt
server_3002.log
models_output.txt
jest_output.txt
dev_server.log
build_output.txt
build_log.txt
```

### Diretório Experimental

- `app/lab/editor/page.tsx`
- `app/lab/blocks/page.tsx`
- `app/lab/converters/page.tsx`
- `app/lab/template/page.tsx`

---

## Estrutura Muambas

```
/Muambas
├── /dormant_components    # Componentes sem uso
├── /unused_utils          # Utilitários órfãos
├── /dead_routes           # Rotas não acessíveis
├── /orphan_assets         # Assets não referenciados
├── /deprecated_features   # Features desabilitadas
├── /Anotações             # Esta documentação
└── /MANIFEST.md           # Registro detalhado
```

---

## Protocolo de Movimentação

1. ☐ Confirmar zero conexões com entry points
2. ☐ Verificar imports dinâmicos (`import()`)
3. ☐ Checar configurações de build
4. ☐ Registrar no MANIFEST.md antes de mover

---

## Restrições

**NUNCA mover:**
- `*.d.ts` (declarações de tipos)
- Arquivos em `/prisma`
- Configurações raiz
- Código de auth/segurança

**MARCAR para revisão:**
- Lógica de negócio complexa
- Integrações externas
- Código de pagamentos

---

## Verificação Pós-Limpeza

```bash
npm run build
npm run type-check
npm test
```

---

## Áreas Prioritárias

| Diretório | Children | Prioridade |
|-----------|----------|------------|
| `/components` | 87 | Alta |
| `/lib` | 176 | Média |
| `/app/lab` | 4 | Alta |
| `/public` | 33 | Média |
