# Design Tokens Reference

Esta documentação descreve o sistema de design tokens do Token Milagre, incluindo cores, tipografia, espaçamento, bordas, sombras e muito mais.

## 📋 Índice

- [Cores](#cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Bordas e Raios](#bordas-e-raios)
- [Sombras](#sombras)
- [Z-Index](#z-index)
- [Tema Claro vs Escuro](#tema-claro-vs-escuro)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🎨 Cores

### Cores de Fundo (Background)

```css
--bg-primary      /* Fundo principal da página */
--bg-secondary    /* Fundo secundário, cards, containers */
--bg-tertiary     /* Fundo terciário, áreas de destaque */
--bg-elevated     /* Fundo elevado, modais, dropdowns */
--bg-overlay      /* Overlay para modais */
```

**Exemplo de uso:**
```tsx
<div style={{ backgroundColor: 'var(--bg-elevated)' }}>
  <p>Conteúdo em fundo elevado</p>
</div>

// Ou com utility class
<div className="bg-theme-elevated">
  <p>Conteúdo em fundo elevado</p>
</div>
```

### Cores de Texto

| Token | Propósito | Contraste (WCAG) |
|-------|-----------|------------------|
| `--text-primary` | Texto principal, títulos | AAA (>7:1) |
| `--text-secondary` | Texto secundário, subtítulos | AAA (>7:1) |
| `--text-tertiary` | Texto terciário, metadados | AAA (>7:1) |
| `--text-muted` | Texto esmaecido, placeholders | AA (>4.5:1) |
| `--text-inverse` | Texto em fundos escuros/claros | AAA |
| `--text-disabled` | Texto desabilitado | - |

**Exemplo de uso:**
```tsx
<h1 className="text-theme-primary">Título Principal</h1>
<p className="text-theme-secondary">Descrição secundária</p>
<span className="text-theme-muted">Metadados</span>
```

### Cores da Marca ($MILAGRE)

```css
--brand-primary    /* #0D9488 (Teal 600) - Cor principal da marca */
--brand-hover      /* #0F766E (Teal 700) - Estado hover */
--brand-light      /* #14B8A6 (Teal 500) - Variação clara */
--brand-lighter    /* #5EEAD4 (Teal 300) - Muito clara */
--brand-bg         /* #F0FDFA (Teal 50) - Fundo da marca */
--brand-border     /* #99F6E4 (Teal 200) - Bordas */
```

**Exemplo de uso:**
```tsx
<button
  className="bg-brand-primary hover:bg-brand-hover"
  style={{
    backgroundColor: 'var(--brand-primary)',
    color: 'white'
  }}
>
  Comprar $MILAGRE
</button>
```

### Cores Funcionais

#### Sucesso (Success)
```css
--success          /* Cor principal de sucesso */
--success-light    /* Variação clara */
--success-bg       /* Fundo de sucesso */
--success-border   /* Borda de sucesso */
```

#### Erro (Error)
```css
--error            /* Cor principal de erro */
--error-light      /* Variação clara */
--error-bg         /* Fundo de erro */
--error-border     /* Borda de erro */
```

#### Aviso (Warning)
```css
--warning          /* Cor principal de aviso */
--warning-light    /* Variação clara */
--warning-bg       /* Fundo de aviso */
--warning-border   /* Borda de aviso */
```

#### Informação (Info)
```css
--info             /* Cor principal de informação */
--info-light       /* Variação clara */
--info-bg          /* Fundo de informação */
--info-border      /* Borda de informação */
```

**Exemplo de uso:**
```tsx
// Alerta de sucesso
<div className="bg-success-bg border-success" style={{
  backgroundColor: 'var(--success-bg)',
  borderColor: 'var(--success-border)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)'
}}>
  <p className="text-success">Operação realizada com sucesso!</p>
</div>

// Alerta de erro
<div className="bg-error-bg border-error">
  <p className="text-error">Erro ao processar a solicitação</p>
</div>
```

---

## 📝 Tipografia

### Famílias de Fonte

```css
--font-sans   /* Sistema sans-serif (padrão) */
--font-mono   /* Fonte monoespaçada (código) */
```

### Escala de Tamanhos (Type Scale)

Baseado na escala Perfect Fourth (1.333):

| Token | Tamanho | Uso Recomendado |
|-------|---------|-----------------|
| `--text-xs` | 12px | Badges, metadados muito pequenos |
| `--text-sm` | 14px | Textos secundários, labels |
| `--text-base` | 16px | Texto padrão de corpo |
| `--text-lg` | 18px | Texto de destaque |
| `--text-xl` | 20px | Subtítulos pequenos |
| `--text-2xl` | 24px | Subtítulos médios |
| `--text-3xl` | 30px | Títulos de seção |
| `--text-4xl` | 36px | Títulos de página |
| `--text-5xl` | 48px | Títulos principais |
| `--text-6xl` | 60px | Títulos hero |

**Exemplo de uso:**
```tsx
<h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: 'var(--font-bold)' }}>
  Bem-vindo ao Token Milagre
</h1>
<p style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>
  Conteúdo do parágrafo
</p>
```

### Altura de Linha (Line Height)

```css
--leading-none      /* 1 */
--leading-tight     /* 1.25 - Títulos */
--leading-snug      /* 1.375 - Subtítulos */
--leading-normal    /* 1.5 - Padrão */
--leading-relaxed   /* 1.625 - Textos longos */
--leading-loose     /* 2 - Muito espaçado */
```

### Pesos de Fonte (Font Weight)

```css
--font-light        /* 300 */
--font-normal       /* 400 - Padrão */
--font-medium       /* 500 */
--font-semibold     /* 600 */
--font-bold         /* 700 */
--font-extrabold    /* 800 */
```

---

## 📏 Espaçamento

Sistema baseado em grade de 4px/8px:

| Token | Valor | Pixels | Uso Comum |
|-------|-------|--------|-----------|
| `--space-0` | 0 | 0px | Reset |
| `--space-1` | 0.25rem | 4px | Espaçamento muito pequeno |
| `--space-2` | 0.5rem | 8px | Espaçamento pequeno |
| `--space-3` | 0.75rem | 12px | Entre ícones e texto |
| `--space-4` | 1rem | 16px | Padrão, padding de botões |
| `--space-5` | 1.25rem | 20px | - |
| `--space-6` | 1.5rem | 24px | Entre seções pequenas |
| `--space-8` | 2rem | 32px | Entre seções médias |
| `--space-10` | 2.5rem | 40px | - |
| `--space-12` | 3rem | 48px | Entre seções grandes |
| `--space-16` | 4rem | 64px | - |
| `--space-20` | 5rem | 80px | - |
| `--space-24` | 6rem | 96px | Seções hero |

**Exemplo de uso:**
```tsx
<div style={{
  padding: 'var(--space-4)',
  marginBottom: 'var(--space-8)'
}}>
  <h2 style={{ marginBottom: 'var(--space-3)' }}>Título</h2>
  <p>Conteúdo</p>
</div>
```

---

## 🔲 Bordas e Raios

### Cores de Borda

```css
--border-light      /* Borda clara, sutil */
--border-medium     /* Borda média, padrão */
--border-strong     /* Borda forte, destaque */
--border-focus      /* Borda de foco (acessibilidade) */
```

### Border Radius

| Token | Valor | Pixels | Uso |
|-------|-------|--------|-----|
| `--radius-none` | 0 | 0px | Sem arredondamento |
| `--radius-sm` | 0.25rem | 4px | Pequeno |
| `--radius-md` | 0.5rem | 8px | Médio (padrão) |
| `--radius-lg` | 0.75rem | 12px | Grande |
| `--radius-xl` | 1rem | 16px | Muito grande |
| `--radius-2xl` | 1.5rem | 24px | Extra grande |
| `--radius-full` | 9999px | - | Circular/pílula |

**Exemplo de uso:**
```tsx
<button style={{
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-medium)'
}}>
  Botão com borda arredondada
</button>
```

---

## 🌑 Sombras

Sombras em camadas para criar profundidade natural:

| Token | Uso |
|-------|-----|
| `--shadow-xs` | Sombra muito sutil |
| `--shadow-sm` | Sombra pequena (cards) |
| `--shadow-md` | Sombra média (botões) |
| `--shadow-lg` | Sombra grande (dropdowns) |
| `--shadow-xl` | Sombra muito grande (modais) |
| `--shadow-2xl` | Sombra extra grande (popups) |
| `--shadow-inner` | Sombra interna |

**Exemplo de uso:**
```tsx
<div className="shadow-theme-md" style={{
  boxShadow: 'var(--shadow-md)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)'
}}>
  Card com sombra
</div>
```

---

## 📚 Z-Index

Escala de z-index para manter consistência em camadas:

```css
--z-base: 0              /* Base layer */
--z-dropdown: 1000       /* Dropdowns */
--z-sticky: 1020         /* Sticky elements */
--z-fixed: 1030          /* Fixed elements */
--z-modal-backdrop: 1040 /* Modal backdrops */
--z-modal: 1050          /* Modals */
--z-popover: 1060        /* Popovers */
--z-tooltip: 1070        /* Tooltips (mais alto) */
```

---

## 🌓 Tema Claro vs Escuro

### Modo Claro (Light Mode)

- Fundos: Tons de cinza claro (#F8F9FA, #FFFFFF)
- Textos: Tons escuros (#1A1A1A, #3D3D3D)
- Alto contraste para máxima legibilidade

### Modo Escuro (Dark Mode)

- Fundos: Tons de cinza escuro (#0F1419, #1A1F2E)
- Textos: Tons claros (#FFFFFF, #E2E8F0)
- Cores mais brilhantes para melhor visibilidade

### Ativando o Tema

O tema é controlado pelo atributo `data-theme` no elemento HTML:

```tsx
// Light mode
<html data-theme="light">

// Dark mode
<html data-theme="dark">
```

### Adaptação Automática

Todos os design tokens se adaptam automaticamente ao tema. Não é necessário alterar código:

```tsx
// Este componente funciona em ambos os temas
<div style={{
  backgroundColor: 'var(--bg-elevated)',
  color: 'var(--text-primary)'
}}>
  Conteúdo que se adapta ao tema
</div>
```

---

## 💡 Exemplos de Uso

### Card Completo

```tsx
<div
  className="bg-theme-elevated shadow-theme-lg"
  style={{
    backgroundColor: 'var(--bg-elevated)',
    boxShadow: 'var(--shadow-lg)',
    padding: 'var(--space-6)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--border-medium)'
  }}
>
  <h3 style={{
    fontSize: 'var(--text-2xl)',
    fontWeight: 'var(--font-bold)',
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-3)'
  }}>
    Título do Card
  </h3>
  <p style={{
    fontSize: 'var(--text-base)',
    color: 'var(--text-secondary)',
    lineHeight: 'var(--leading-relaxed)'
  }}>
    Descrição do card com texto secundário
  </p>
</div>
```

### Botão Primário

```tsx
<button
  className="bg-brand-primary shadow-theme-md focus-ring"
  style={{
    backgroundColor: 'var(--brand-primary)',
    color: 'white',
    padding: 'var(--space-3) var(--space-6)',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-semibold)',
    boxShadow: 'var(--shadow-md)',
    border: 'none',
    cursor: 'pointer'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--brand-hover)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = 'var(--brand-primary)';
  }}
>
  Ação Principal
</button>
```

### Alert de Sucesso

```tsx
<div
  className="bg-success-bg border-success"
  style={{
    backgroundColor: 'var(--success-bg)',
    border: '1px solid var(--success-border)',
    padding: 'var(--space-4)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: 'var(--space-4)'
  }}
>
  <p style={{
    color: 'var(--success)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
    margin: 0
  }}>
    ✓ Operação realizada com sucesso!
  </p>
</div>
```

---

## 📱 Responsividade

Os design tokens são valores absolutos que funcionam em todas as telas. Para responsividade, use media queries:

```css
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--text-4xl); /* Ao invés de --text-6xl */
    padding: var(--space-6);    /* Ao invés de --space-12 */
  }
}
```

---

## ♿ Acessibilidade

Todos os tokens de cor foram testados para conformidade com WCAG AAA:

- **Contraste de texto**: Mínimo de 7:1 para texto normal
- **Cores funcionais**: Sempre acompanhadas de ícones
- **Focus states**: Outline visível com `--border-focus`
- **Espaçamento mínimo**: Botões e alvos de toque com min 44x44px

---

## 🔗 Referências

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Type Scale Generator](https://type-scale.com/)

---

**Última atualização**: 2025-11-19
