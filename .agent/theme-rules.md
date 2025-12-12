---
description: Regras obrigatórias para o sistema de temas (light/dark mode) - v2.0 Escalável
---

# 🎨 Regras de Design: Sistema de Tema (v2.0)

> **Prioridade: CRÍTICA** - Seguir estas regras evita bugs visuais intermitentes.

## Módulo Unificado de Tema

O sistema de tema está centralizado em `lib/core/theme/`. Este é o **ÚNICO** local para gerenciamento de tema.

```
lib/core/theme/
├── index.ts          # Re-exports (ponto de entrada)
├── ThemeProvider.tsx # Provider unificado
├── tokens.ts         # 🆕 Tokens semânticos escaláveis
├── constants.ts      # Constantes
└── types.ts          # Types (Theme, ThemeAccent, ThemeConfig)
```

## Regras Obrigatórias

### 1. Sempre importe de `@/lib/core/theme`

```typescript
// ✅ CORRETO
import { useTheme, ThemeProvider, tokens, cssVar } from '@/lib/core/theme';

// ⚠️ LEGADO (ainda funciona, mas evitar em código novo)
import { useTheme } from '@/contexts/ThemeContext';

// ❌ NUNCA criar novo contexto de tema
```

### 2. Use Tokens ou CSS Variables para cores

```typescript
// ✅ MELHOR - Tokens semânticos (v2.0)
import { tokens, cssVar } from '@/lib/core/theme';

<div style={{ backgroundColor: tokens.bg.primary }} />
<div style={{ color: cssVar('text.secondary') }} />

// ✅ CORRETO - CSS Variables diretas
<div style={{ backgroundColor: 'var(--bg-primary)' }} />
<div className="bg-theme-primary text-theme-secondary" />

// ⚠️ ACEITÁVEL - Tailwind dark: prefix (menos manutenível)
<div className="bg-white dark:bg-gray-900" />

// ❌ NUNCA - Cores hardcoded (ESLint irá alertar)
<div style={{ backgroundColor: '#0b0e11' }} />
```

### 3. Tokens Disponíveis (tokens.ts)

| Categoria | Tokens |
|-----------|--------|
| `tokens.bg` | `primary`, `secondary`, `tertiary`, `elevated`, `modal` |
| `tokens.text` | `primary`, `secondary`, `tertiary`, `muted`, `inverse`, `link` |
| `tokens.border` | `light`, `medium`, `strong`, `focus` |
| `tokens.brand` | `primary`, `hover`, `light`, `bg` |
| `tokens.accent` | `primary`, `hover`, `light`, `gradient.start/end` |
| `tokens.states` | `success/error/warning/info` (cada um com `.base`, `.light`, `.bg`, `.border`) |
| `tokens.shadow` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` |
| `tokens.icon` | `default`, `muted`, `inverse` |

### 4. CSS Variables (fonte: globals.css)

| Variable | Uso |
|----------|-----|
| `--bg-primary` | Background principal |
| `--bg-secondary` | Background de cards |
| `--bg-elevated` | Cards elevados |
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundário |
| `--brand-primary` | Cor da marca |
| `--accent-primary` | 🆕 Cor de acento (para temas alternativos) |
| `--gradient-start/end` | 🆕 Cores de gradiente (escalável) |
| `--border-light` | Bordas suaves |

### 5. Evitar Hydration Mismatch

```typescript
const { theme, mounted } = useTheme();

// Sempre verificar mounted antes de renderizar conteúdo theme-aware
if (!mounted) {
  return <Skeleton />;
}

return <div>{theme === 'dark' ? '🌙' : '☀️'}</div>;
```

### 6. Classes Utilitárias

Definidas em `globals.css`:

- `.glass` / `.glass-card` - Glassmorphism
- `.zenith-card` / `.zenith-featured` - Cards do design Zenith
- `.bg-theme-*` / `.text-theme-*` - Cores adaptativas
- `.shadow-theme-*` - Sombras adaptativas

## Escalabilidade (Temas Alternativos)

O sistema está preparado para temas alternativos via ThemeAccent:

```typescript
type ThemeAccent = 'default' | 'ocean' | 'forest' | 'sunset';

// Futuro: no CSS
[data-accent="ocean"] {
  --accent-primary: #0EA5E9;
  --gradient-start: #0EA5E9;
  --gradient-end: #06B6D4;
}
```

## ESLint: Regra no-hardcoded-colors

O plugin `eslint-plugins/theme.mjs` previne hardcodes:

```
warning  Cor hardcoded "#ff0000" detectada. 
         Use CSS variable ou Tailwind dark:
```

**Cores permitidas:** Discord, Telegram, Bitcoin, Ethereum, Solana (identidade visual).

## Por que estas regras?

O sistema usa **DOIS** mecanismos em paralelo:
1. `data-theme="dark"` - Para CSS Variables
2. `.dark` class - Para Tailwind `dark:` prefix

O `ThemeProvider` sincroniza ambos automaticamente. Quebrar esta sincronização causa bugs visuais.

## Arquivos Relacionados

- [ThemeProvider.tsx](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/ThemeProvider.tsx)
- [tokens.ts](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/tokens.ts) 🆕
- [types.ts](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/types.ts)
- [globals.css](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/app/globals.css)
- [GlobalBackground.tsx](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/components/layout/GlobalBackground.tsx)
- [eslint-plugins/theme.mjs](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/eslint-plugins/theme.mjs) 🆕

---

*Última atualização: 12/12/2025 - v2.0 Escalável*
