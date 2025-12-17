---
type: agent
name: DESIGN
role: Sistema de Design e Tema
trigger: "CSS", "tema", "cores", "tokens", "dark mode", "light mode", "glassmorphism", "ícones"
inherits: _DNA.md
collaborates: [CONTEUDO, ESTRUTURA]
escalates-to: ESTRUTURA
---

# 🎨 DESIGN

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

## 🚫 Ícones Proibidos

| Ícone | Razão |
|-------|-------|
| **faRocket** | Clichê de startup; evitar hype |
| **faMoon** / **faStars** | Associado a "moon" em cripto |
| **faFire** | Associado a "burn" e hype |
| **faBomb** | Negativo |

### Regras de Uso de Ícones

| Regra | Descrição |
|-------|-----------|
| **Proibido em títulos** | Títulos (h1, h2, h3) devem ser apenas texto, sem ícones |
| **Evitar excesso** | Máximo 1 ícone por card/seção; menos é mais |
| **Clareza > Decoração** | Ícone só se adicionar significado, não decoração |
| **Consistência** | Mesmo ícone = mesmo significado em todo o projeto |

**Princípio**: Preferir ícones que comuniquem **clareza** e **confiança**, não hype.

---

## ✅ Ícones Obrigatórios: FontAwesome

**Biblioteca única**: `@fortawesome/react-fontawesome`

```typescript
// ✅ CORRETO
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faUsers} className="text-[var(--text-secondary)]" />

// ❌ PROIBIDO
import { RocketIcon } from 'lucide-react';  // Não usar Lucide para ícones inline
```

### Ícones Recomendados por Contexto

| Contexto | Ícones Sugeridos |
|----------|------------------|
| Comunidade | `faUsers`, `faHandshake`, `faUserGroup` |
| Segurança | `faShieldAlt`, `faLock`, `faCheckCircle` |
| Educação | `faLightbulb`, `faBookOpen`, `faGraduationCap` |
| Transparência | `faEye`, `faChartPie`, `faFileAlt` |
| Navegação | `faArrowRight`, `faChevronDown`, `faGripVertical` |
| Finanças | `faCoins`, `faWallet`, `faChartLine` |

---

## Padrões de Design (Referência: Home Page)

### Layout Padrão

```typescript
// Container padrão
<div className="container mx-auto px-6 md:px-10 py-8 relative z-10">

// Espaçamento entre seções
<div className="space-y-16 pb-20">
```

### Glass Card (Componente Principal)

```css
.glass-card {
  background: rgba(var(--bg-elevated-rgb), 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-2xl);  /* 24px */
}
```

### Títulos de Seção

```typescript
<h2 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
  Título da Seção
</h2>
<p className="text-xl text-[var(--text-secondary)]">
  Subtítulo explicativo
</p>
```

### Botões Primários

```typescript
<button className="px-10 py-5 rounded-full font-bold text-lg text-white 
  backdrop-blur-md bg-gradient-to-r from-[var(--brand-primary)]/90 to-[var(--brand-hover)]/90 
  border border-white/20 hover:scale-105 transition-all shadow-xl">
  Texto do Botão
</button>
```

---

## 🎨 Harmonia Visual Obrigatória

> **Todo novo componente deve seguir o design da Home Page.**

**Referência principal**: [app/page.tsx](file:///home/zenfoco/LLM/tokenmilagre-platform/app/page.tsx)

| Princípio | Regra |
|-----------|-------|
| **Consistência** | Cards, espaçamentos e cores devem ser idênticos à home |
| **Glass Cards** | Usar `backdrop-blur`, `rounded-3xl`, gradientes sutis |
| **Tipografia** | Títulos `text-2xl font-bold`, descrições `text-sm` |
| **Espaçamento** | Padding `p-6`, gap `gap-4` entre cards |
| **Hover Effects** | Transições suaves, `shadow-xl` no hover |

**Antes de criar componente visual**: Consultar `app/page.tsx` e componentes em `app/components/home/`.

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
| `app/page.tsx` | Referência de design (home) |

---

## Checklist de Revisão Visual

Antes de aprovar qualquer componente novo:

- [ ] Usa CSS Variables (não cores hardcoded)
- [ ] Usa FontAwesome (não outras libs de ícones)
- [ ] Não usa ícones proibidos (rocket, moon, fire)
- [ ] Segue grid de 4/8px
- [ ] Glass cards com `backdrop-blur`
- [ ] Botões com `rounded-full` e gradiente
- [ ] Títulos com tipografia padrão

---

```yaml
@references:
  - _DNA.md
  - ESTRUTURA.md  # Consistência de padrões
  - lib/core/theme/  # Código fonte
  - app/page.tsx  # Referência de design
  - app/globals.css  # CSS Variables
```

