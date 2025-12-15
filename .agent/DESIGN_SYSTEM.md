---
type: agent
name: DESIGN_SYSTEM
role: Sistema de Design e Tema
trigger: "CSS", "tema", "cores", "tokens", "dark mode", "light mode", "glassmorphism"
inherits: _DNA.md
collaborates: [CONTENT_ARCHITECT, FRACTAL_GUARDIAN]
escalates-to: FRACTAL_GUARDIAN
---

# 🎨 DESIGN_SYSTEM

> Guardião das regras visuais e do sistema de tema.

---

## Resumo Executivo

O projeto usa **TRÊS mecanismos** em paralelo:
1. `data-theme="dark"` — CSS Variables
2. `.dark` class — Tailwind `dark:` prefix
3. `data-accent="ocean"` — Variantes de cor

O `ThemeProvider` sincroniza todos automaticamente.

---

## Regras Obrigatórias

### 1. Import único
```typescript
import { useTheme, tokens, cssVar } from '@/lib/core/theme';
```

### 2. Nunca hardcode cores
```typescript
// ✅ CORRETO
<div style={{ backgroundColor: tokens.bg.primary }} />
<div className="bg-theme-primary text-theme-secondary" />

// ❌ PROIBIDO (ESLint alertará)
<div style={{ backgroundColor: '#0b0e11' }} />
```

### 3. Hydration safety
```typescript
const { theme, mounted } = useTheme();
if (!mounted) return <Skeleton />;
```

---

## Tokens Principais

| Categoria | Tokens |
|-----------|--------|
| `bg` | primary, secondary, tertiary, elevated, modal |
| `text` | primary, secondary, tertiary, muted, inverse |
| `border` | light, medium, strong, focus |
| `brand` | primary, hover, light, bg |
| `accent` | primary, hover, gradient.start/end |
| `states` | success, error, warning, info (.base/.light/.bg) |

---

## 6 Temas Disponíveis

| Base | Variante | Característica |
|------|----------|----------------|
| Light | default | Teal (#0D9488) |
| Dark | default | Gold (#FFD700) |
| Light/Dark | ocean | Blue (#0EA5E9) |
| Light/Dark | forest | Emerald (#10B981) |
| Light/Dark | sunset | Orange (#F97316) |

---

## Arquivos Críticos

| Arquivo | Função |
|---------|--------|
| `lib/core/theme/ThemeProvider.tsx` | Provider unificado |
| `lib/core/theme/tokens.ts` | Tokens semânticos |
| `lib/core/theme/accents/*.css` | Variantes de cor |
| `app/globals.css` | CSS Variables base |

---

```yaml
@references:
  - _DNA.md
  - FRACTAL_GUARDIAN.md  # Consistência de padrões
  - lib/core/theme/  # Código fonte
```
