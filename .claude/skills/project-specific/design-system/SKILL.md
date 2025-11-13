---
name: design-system
description: Use this skill when styling pages, creating components, working with CSS variables, design patterns, or applying the Token Milagre visual identity. Contains spacing rules, color system, card effects, and component patterns.
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Design System Skill

This skill provides all design standards, CSS variables, component patterns, and visual guidelines for the Token Milagre Platform.

---

## 🎨 Padrões de Design

### Espaçamento e Layout

- **Sidebar**: 272px de largura fixa
- **Espaçamento do conteúdo**: 55px à esquerda da sidebar (`paddingLeft: '55px'`)
- **Largura máxima do conteúdo**: `max-w-4xl` (artigos), `max-w-6xl` (recursos)
- **Índice lateral**: 256px (w-64), visível apenas em XL+ screens

### Cores e Temas

**Modo Claro**:
- Fundo primário: `#f5f4f6` (levemente off-white para conforto visual)
- Bordas quase invisíveis: `#F5F5F7`
- Sombras sutis: `0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.02)`

**Modo Escuro**:
- Bordas sutis: `#34547A`
- Sombras mais pronunciadas: `0 2px 8px 0 rgba(0, 0, 0, 0.25), 0 1px 4px 0 rgba(0, 0, 0, 0.15)`

**CSS Variables** (usar sempre para adaptação ao tema):
  - `var(--text-primary)` - Texto principal
  - `var(--text-secondary)` - Texto secundário
  - `var(--text-tertiary)` - Texto terciário
  - `var(--bg-primary)` - Fundo primário
  - `var(--bg-secondary)` - Fundo secundário
  - `var(--bg-elevated)` - Fundos elevados (cards)
  - `var(--brand-primary)` - Cor primária da marca
  - `var(--brand-hover)` - Hover da cor primária
  - `var(--border-light)` - Bordas claras (quase invisíveis)
  - `var(--border-medium)` - Bordas médias
  - `var(--shadow-md)` - Sombra média (cards)
  - `var(--shadow-lg)` - Sombra grande (hover)

### Cards e Efeitos

**Padrão Minimalista** (páginas: Home, Educação, Notícias, Manifesto):
- Borda: `border` (1px) com cor `--border-light` (quase invisível)
- Sombra: `shadow-md` (sutil e harmônica)
- Hover: `hover:-translate-y-1 hover:shadow-lg`
- Transição: `transition-all duration-500 ease-out`
- Background: `var(--bg-elevated)`
- Border radius: `rounded-2xl`

**Padrão Gradiente** (página Recursos):
- Background: Gradiente linear baseado na categoria
- Cores por categoria:
  - 🟠 Wallets: `linear-gradient(135deg, #F6851B 0%, #E2761B 100%)`
  - 🟡 Exchanges: `linear-gradient(135deg, #F3BA2F 0%, #EAA42D 100%)`
  - 🔴 DeFi: `linear-gradient(135deg, #FF007A 0%, #E6006E 100%)`
  - 🔵 Explorers: `linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)`
  - 🟢 Tools: `linear-gradient(135deg, #10B981 0%, #059669 100%)`
  - 🟣 Default: `linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)`
- Overlay: `bg-black/10` → `bg-black/5` no hover
- Texto: Branco com badges translúcidos
- Hover: `hover:-translate-y-2 hover:shadow-2xl`
- Transição: `duration-500`

### Ícones

- **Regra geral**: Evitar ícones excessivos, manter design clean
- **Ícones permitidos**:
  - 📖 Tempo de leitura (único ícone nos cards de educação)
  - Ícones de navegação (setas, menu, etc)
  - Números em círculos (substituindo emojis decorativos)
- **Ícones removidos**:
  - ❌ Ícones de categorias nos cards
  - ❌ Ícones de níveis (🌱, 🚀, 💎) → Substituídos por números (1, 2, 3)
  - ❌ Ícones de busca/filtros (🔍)
  - ❌ Ícones de plataformas nos recursos

### Breadcrumbs

- Adicionar em todas as páginas principais
- Componente: `<Breadcrumbs />`
- Localização: Topo da página, antes do conteúdo

---

## 🔧 Componentes e Padrões

### Busca e Filtros (Padrão Unificado)

```jsx
<div className="backdrop-blur-lg rounded-2xl p-6 border-2 shadow-xl">
  <div className="flex items-center justify-between mb-4">
    <h3>🔍 Busca e Filtros {badge contador}</h3>
    <div>
      {botão limpar tudo}
      {botão toggle mobile}
    </div>
  </div>

  {campo de busca}

  <div className={mobile toggle}>
    {filtros de categoria}
    {outros filtros específicos}
    {contador de resultados}
  </div>
</div>
```

### Scroll to Top Button

- Aparece após 400px de scroll
- Posição: `fixed bottom-8 right-8`
- Cor: `var(--brand-primary)`
- Ícone: Seta para cima

### Theme Toggle

- Ícone: 🌙 (modo escuro) / ☀️ (modo claro)
- Localização: Sidebar + Header desktop
- Sempre usar CSS variables para cores

---

## 🚫 Design - O Que Evitar

1. **Ícones excessivos**: Manter apenas essenciais
2. **Títulos duplicados**: Nunca repetir H1 no conteúdo (artigos e notícias)
3. **Notas de transparência manuais**: Template adiciona automaticamente (notícias)
4. **Seções de fontes no markdown**: Template processa automaticamente (notícias)
5. **Complexidade visual**: Preferir design simples e minimalista
6. **Textos brancos no modo claro**: Sempre usar CSS variables
7. **Criar arquivos desnecessários**: Editar existentes quando possível
8. **Emojis sem solicitação**: Usar apenas quando pedido

---

**Skill criada por**: Claude Code
**Última atualização**: 2025-10-24
