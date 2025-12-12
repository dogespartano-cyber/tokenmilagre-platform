---
description: Regras obrigatórias para o sistema de temas (light/dark mode) - v2.1 Multi-Theme
---

# 🎨 Regras de Design: Sistema de Tema (v2.1)

> **Prioridade: CRÍTICA** - Seguir estas regras evita bugs visuais intermitentes.

## Módulo Unificado de Tema

O sistema de tema está centralizado em `lib/core/theme/`. Este é o **ÚNICO** local para gerenciamento de tema.

```
lib/core/theme/
├── index.ts          # Re-exports (ponto de entrada)
├── ThemeProvider.tsx # Provider unificado (theme + accent)
├── tokens.ts         # Tokens semânticos escaláveis
├── constants.ts      # Constantes
├── types.ts          # Types (Theme, ThemeAccent, ThemeConfig)
└── accents/          # 🆕 Variantes de tema completas
    ├── index.css     # Aggregator de imports
    ├── ocean.css     # Ocean Dark + Light
    ├── forest.css    # Forest Dark + Light
    └── sunset.css    # Sunset Dark + Light
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
| `--accent-primary` | Cor de acento (sobrescrita por variantes) |
| `--gradient-start/end` | Cores de gradiente |
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

## Sistema de Variantes (v2.1)

### 6 Temas Completos Disponíveis

| Variante | Modo Claro | Modo Escuro |
|----------|------------|-------------|
| **Padrão** | Teal (#0D9488) | Gold (#FFD700) |
| **Ocean** 🔵 | Sky Blue (#F0F9FF bg) | Deep Blue (#020617 bg) |
| **Forest** 🟢 | Emerald (#ECFDF5 bg) | Deep Green (#020A07 bg) |
| **Sunset** 🟠 | Orange (#FFF7ED bg) | Wine Dark (#0A0506 bg) |

### Usando setAccent

```typescript
const { theme, setTheme, accent, setAccent } = useTheme();

// Mudar modo (light/dark)
setTheme('light');
setTheme('dark');

// Mudar variante de cor
setAccent('ocean');   // Aplica tema Ocean (funciona em light E dark)
setAccent('forest');  // Aplica tema Forest
setAccent('sunset');  // Aplica tema Sunset  
setAccent('default'); // Retorna ao tema padrão
```

### Estrutura CSS das Variantes

```css
/* Cada variante tem DUAS regras: Dark + Light */

/* Dark mode variant */
[data-theme="dark"][data-accent="ocean"] {
  --bg-primary: #020617;
  --text-primary: #F0F9FF;
  --brand-primary: #0EA5E9;
  /* ... todas as 50+ variáveis */
}

/* Light mode variant */
[data-theme="light"][data-accent="ocean"] {
  --bg-primary: #F0F9FF;
  --text-primary: #0C4A6E;
  --brand-primary: #0284C7;
  /* ... todas as 50+ variáveis */
}
```

### Criando Nova Variante

1. Criar arquivo `lib/core/theme/accents/nova-variante.css`
2. Definir `[data-theme="dark"][data-accent="nova"]` com TODAS as variáveis
3. Definir `[data-theme="light"][data-accent="nova"]` com TODAS as variáveis
4. Importar em `accents/index.css`
5. Adicionar tipo em `types.ts`: `ThemeAccent`
6. Adicionar cor no seletor em `CustomUserButton.tsx`

## ESLint: Regra no-hardcoded-colors

O plugin `eslint-plugins/theme.mjs` previne hardcodes:

```
warning  Cor hardcoded "#ff0000" detectada. 
         Use CSS variable ou Tailwind dark:
```

**Cores permitidas:** Discord, Telegram, Bitcoin, Ethereum, Solana (identidade visual).

## Por que estas regras?

O sistema usa **TRÊS** mecanismos em paralelo:
1. `data-theme="dark"` - Para CSS Variables (light/dark base)
2. `.dark` class - Para Tailwind `dark:` prefix
3. `data-accent="ocean"` - Para variantes de cor (sobrescreve brand/accent)

O `ThemeProvider` sincroniza todos automaticamente. Quebrar esta sincronização causa bugs visuais.

## Arquivos Relacionados

- [ThemeProvider.tsx](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/ThemeProvider.tsx)
- [tokens.ts](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/tokens.ts)
- [types.ts](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/types.ts)
- [accents/](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/accents/) 🆕
- [globals.css](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/app/globals.css)
- [CustomUserButton.tsx](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/components/shared/CustomUserButton.tsx)
- [eslint-plugins/theme.mjs](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/eslint-plugins/theme.mjs)

---

*Última atualização: 12/12/2025 - v2.1 Multi-Theme*

