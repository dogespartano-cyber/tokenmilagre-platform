# 🗂️ Muambas - Registro de Código Movido

> Código identificado como dormante/órfão durante auditoria forense.

---

## Sumário

| Métrica | Valor |
|---------|-------|
| **Data da auditoria** | 2024-12-31 |
| **Total de itens identificados** | 38 |
| **Status** | ✅ Concluído (Fase 1) |

---

## 🔴 Itens Identificados

### 1. Componentes Órfãos (5) - MOVIDOS PARA /Muambas/dormant_components

| Arquivo | Motivo | Data Movi. |
|---------|--------|------------|
| `components/ui/AnimatedLogo.tsx` | Zero imports | 2024-12-31 |
| `components/layout/SectionNav.tsx` | Só no barrel | 2024-12-31 |
| `components/layout/AnimatedBackground.tsx` | Só no barrel | 2024-12-31 |
| `components/shared/ThemeCard.tsx` | Só no barrel | 2024-12-31 |
| `components/shared/NovelEditor.tsx` | Só no barrel | 2024-12-31 |

### 2. Assets Órfãos (4) - MOVIDOS PARA /Muambas/orphan_assets

- `public/next.svg`, `public/globe.svg`, `public/window.svg`, `public/file.svg`

### 3. Arquivos de Log (~620KB) - DELETADOS

`lint_full_output.txt`, `lint_after_entities.txt`, `lint_output.txt`, `tsc_output.txt`, `debug-impermanent.txt`, `build.log`, `tsc_output_v2.txt`, `server_3002.log`, `models_output.txt`, `jest_output.txt`, `dev_server.log`, `build_output.txt`, `build_log.txt`

### 4. Diretório Experimental `/app/lab` (4 páginas)

- `editor/page.tsx`, `blocks/page.tsx`, `converters/page.tsx`, `template/page.tsx`

### 5. Scripts Avulsos (10)

Scripts em `/scripts` sem registro no package.json - verificar necessidade.

---

## Próximas Ações

1. [ ] **REVISÃO**: `/app/lab/*` - decidir destino
2. [ ] **DELETAR**: 13 arquivos de log
3. [ ] **MOVER**: componententes/assets órfãos
