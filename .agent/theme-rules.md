---
description: Regras obrigatórias para o sistema de temas (light/dark mode)
---

# 🎨 Regras de Design: Sistema de Tema

> **Prioridade: CRÍTICA** - Seguir estas regras evita bugs visuais intermitentes.

## Módulo Unificado de Tema

O sistema de tema está centralizado em `lib/core/theme/`. Este é o **ÚNICO** local para gerenciamento de tema.

```
lib/core/theme/
├── index.ts          # Re-exports
├── ThemeProvider.tsx # Provider unificado
├── constants.ts      # Constantes
└── types.ts          # Types
```

## Regras Obrigatórias

### 1. Sempre importe de `@/lib/core/theme`

```typescript
// ✅ CORRETO
import { useTheme, ThemeProvider } from '@/lib/core/theme';

// ⚠️ LEGADO (ainda funciona, mas evitar em código novo)
import { useTheme } from '@/contexts/ThemeContext';

// ❌ NUNCA criar novo contexto de tema
```

### 2. Use CSS Variables para cores

```typescript
// ✅ CORRETO - Responde ao tema automaticamente
<div style={{ backgroundColor: 'var(--bg-primary)' }} />
<div className="bg-theme-primary text-theme-secondary" />

// ⚠️ EVITAR - Tailwind dark: prefix (funciona, mas menos manutenível)
<div className="bg-white dark:bg-gray-900" />

// ❌ NUNCA - Cores hardcoded
<div style={{ backgroundColor: '#0b0e11' }} />
```

### 3. CSS Variables disponíveis (fonte: globals.css)

| Variable | Uso |
|----------|-----|
| `--bg-primary` | Background principal |
| `--bg-secondary` | Background secundário |
| `--bg-elevated` | Cards elevados |
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundário |
| `--brand-primary` | Cor da marca |
| `--border-light` | Bordas suaves |

### 4. Evitar Hydration Mismatch

```typescript
const { theme, mounted } = useTheme();

// Sempre verificar mounted antes de renderizar conteúdo theme-aware
if (!mounted) {
  return <Skeleton />;
}

return <div>{theme === 'dark' ? '🌙' : '☀️'}</div>;
```

### 5. Classes utilitárias disponíveis

Definidas em `globals.css`:

- `.glass` / `.glass-card` - Glassmorphism
- `.zenith-card` / `.zenith-featured` - Cards do design Zenith
- `.bg-theme-*` / `.text-theme-*` - Cores adaptativas
- `.shadow-theme-*` - Sombras adaptativas

## Por que estas regras?

O sistema usa **DOIS** mecanismos em paralelo:
1. `data-theme="dark"` - Para CSS Variables
2. `.dark` class - Para Tailwind `dark:` prefix

O `ThemeProvider` sincroniza ambos automaticamente. Quebrar esta sincronização causa bugs visuais.

## Arquivos Relacionados

- [ThemeProvider.tsx](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/lib/core/theme/ThemeProvider.tsx)
- [globals.css](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/app/globals.css)
- [GlobalBackground.tsx](file:///home/zenfoco/LLM/tokenmilagre-platform/tokenmilagre-platform/components/layout/GlobalBackground.tsx)
