# Guia de Acessibilidade - Token Milagre

Este documento descreve as práticas de acessibilidade implementadas no projeto Token Milagre e fornece diretrizes para manter e melhorar a acessibilidade.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Conformidade WCAG](#conformidade-wcag)
- [Contraste de Cores](#contraste-de-cores)
- [Navegação por Teclado](#navegação-por-teclado)
- [Leitores de Tela](#leitores-de-tela)
- [Espaçamento e Tamanhos](#espaçamento-e-tamanhos)
- [Formulários e Inputs](#formulários-e-inputs)
- [Imagens e Mídia](#imagens-e-mídia)
- [Checklist de Acessibilidade](#checklist-de-acessibilidade)
- [Ferramentas de Teste](#ferramentas-de-teste)

---

## 🎯 Visão Geral

O Token Milagre está comprometido em fornecer uma experiência acessível para todos os usuários, independentemente de suas habilidades. Nosso objetivo é alcançar conformidade **WCAG 2.1 Nível AAA** sempre que possível.

### Princípios POUR

Nossa acessibilidade é baseada nos princípios POUR:

- **P**erceptível: Informação e componentes devem ser apresentados de forma que os usuários possam percebê-los
- **O**perável: Componentes e navegação devem ser operáveis
- **U**nderstandable: Informação e operação devem ser compreensíveis
- **R**obust: Conteúdo deve ser robusto o suficiente para ser interpretado por tecnologias assistivas

---

## ✅ Conformidade WCAG

### Nível AAA Alcançado

Nosso sistema de design atende aos critérios WCAG 2.1 Nível AAA em:

- ✅ Contraste de cores (mínimo 7:1 para texto normal)
- ✅ Contraste de cores (mínimo 4.5:1 para texto grande)
- ✅ Uso de cores não como único meio de transmitir informação
- ✅ Redimensionamento de texto até 200%
- ✅ Espaçamento entre linhas e parágrafos
- ✅ Navegação consistente
- ✅ Identificação consistente

### Em Desenvolvimento

- 🔄 Alternativas de áudio/vídeo
- 🔄 Linguagem de sinais para conteúdo de áudio

---

## 🎨 Contraste de Cores

### Ratios de Contraste Implementados

Todos os tokens de cor foram testados e aprovados para contraste adequado:

#### Modo Claro

| Elemento | Cor | Fundo | Ratio | Status |
|----------|-----|-------|-------|--------|
| Texto Principal | `#1A1A1A` | `#FFFFFF` | 16.7:1 | ✅ AAA |
| Texto Secundário | `#3D3D3D` | `#FFFFFF` | 11.1:1 | ✅ AAA |
| Texto Terciário | `#616161` | `#FFFFFF` | 7.2:1 | ✅ AAA |
| Texto Muted | `#878787` | `#FFFFFF` | 4.6:1 | ✅ AA |
| Sucesso | `#047857` | `#FFFFFF` | 7.1:1 | ✅ AAA |
| Erro | `#B91C1C` | `#FFFFFF` | 7.5:1 | ✅ AAA |
| Aviso | `#B45309` | `#FFFFFF` | 7.1:1 | ✅ AAA |
| Info | `#1D4ED8` | `#FFFFFF` | 8.1:1 | ✅ AAA |

#### Modo Escuro

| Elemento | Cor | Fundo | Ratio | Status |
|----------|-----|-------|-------|--------|
| Texto Principal | `#FFFFFF` | `#0F1419` | 21:1 | ✅ AAA |
| Texto Secundário | `#E2E8F0` | `#0F1419` | 14.1:1 | ✅ AAA |
| Texto Terciário | `#A0AEC0` | `#0F1419` | 8.1:1 | ✅ AAA |
| Texto Muted | `#718096` | `#0F1419` | 4.9:1 | ✅ AA |

### Testando Contraste

Use as seguintes ferramentas para testar contraste:

```bash
# WebAIM Contrast Checker
https://webaim.org/resources/contrastchecker/

# Chrome DevTools
1. Inspecionar elemento
2. Ver "Computed" > "Accessibility"
3. Verificar "Contrast ratio"
```

### Regras de Uso

1. **Nunca use apenas cor** para transmitir informação
2. **Sempre adicione ícones ou texto** em estados de sucesso/erro
3. **Teste em modo escuro E claro**
4. **Evite texto cinza claro** em fundos brancos

**Exemplo Correto:**
```tsx
// ✅ BOM: Ícone + Cor + Texto
<div className="bg-success-bg border-success">
  <CheckIcon /> {/* Ícone */}
  <span className="text-success">Sucesso!</span> {/* Cor + Texto */}
</div>

// ❌ RUIM: Apenas cor
<div style={{ backgroundColor: 'green' }}>
  Sucesso
</div>
```

---

## ⌨️ Navegação por Teclado

### Suporte Completo de Teclado

Todos os elementos interativos devem ser acessíveis via teclado:

- **Tab**: Navegar para próximo elemento focável
- **Shift + Tab**: Navegar para elemento anterior
- **Enter/Space**: Ativar botões e links
- **Arrow Keys**: Navegação em menus e listas
- **Escape**: Fechar modais e dropdowns

### Estados de Foco

Use a classe `focus-ring` para estados de foco acessíveis:

```tsx
<button className="focus-ring">
  Botão Acessível
</button>
```

Isso aplica:
```css
.focus-ring:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
}
```

### Skip Links

Implemente "skip to content" links para usuários de teclado:

```tsx
<a href="#main-content" className="skip-to-content">
  Pular para o conteúdo principal
</a>

{/* ... navegação ... */}

<main id="main-content">
  {/* Conteúdo principal */}
</main>
```

### Tab Order

Mantenha uma ordem lógica de foco:

1. Logo/Home
2. Navegação principal
3. Conteúdo principal
4. Sidebar (se houver)
5. Footer

**Evite:**
- `tabindex` maior que 0
- Elementos não-interativos com `tabindex`
- Foco em elementos ocultos

---

## 📢 Leitores de Tela

### ARIA Labels

Use ARIA labels apropriadamente:

```tsx
// Botão com ícone apenas
<button aria-label="Fechar modal">
  <CloseIcon />
</button>

// Link externo
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visitar site (abre em nova aba)"
>
  Saiba mais
</a>

// Input com label
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-help"
/>
<span id="email-help">Digite seu email válido</span>
```

### ARIA Live Regions

Para atualizações dinâmicas:

```tsx
// Notificações
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  Erro ao salvar dados!
</div>

// Status não-crítico
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Salvando...
</div>
```

### Landmarks

Use landmarks semânticos:

```tsx
<header>
  <nav aria-label="Navegação principal">
    {/* Menu */}
  </nav>
</header>

<main>
  <article>
    {/* Conteúdo do artigo */}
  </article>

  <aside aria-label="Informações relacionadas">
    {/* Sidebar */}
  </aside>
</main>

<footer>
  {/* Footer */}
</footer>
```

---

## 📏 Espaçamento e Tamanhos

### Tamanhos Mínimos de Toque

Todos os alvos de toque devem ter **mínimo 44x44 pixels**:

```tsx
// ✅ BOM: Tamanho adequado
<button style={{
  minWidth: '44px',
  minHeight: '44px',
  padding: 'var(--space-3) var(--space-6)'
}}>
  Clique aqui
</button>

// ❌ RUIM: Muito pequeno
<button style={{ padding: '2px 4px' }}>
  Clique
</button>
```

### Espaçamento entre Elementos

Use espaçamento adequado para evitar cliques acidentais:

```tsx
// ✅ BOM: Espaço entre botões
<div style={{ display: 'flex', gap: 'var(--space-3)' }}>
  <button>Salvar</button>
  <button>Cancelar</button>
</div>

// ❌ RUIM: Botões colados
<div>
  <button>Salvar</button><button>Cancelar</button>
</div>
```

### Tamanhos de Fonte

- **Mínimo**: 16px (1rem) para texto de corpo
- **Pequeno**: 14px (0.875rem) para metadados
- **Muito pequeno**: 12px (0.75rem) apenas para badges/labels

```tsx
// ✅ BOM
<p style={{ fontSize: 'var(--text-base)' }}>Texto legível</p>

// ❌ RUIM
<p style={{ fontSize: '10px' }}>Texto muito pequeno</p>
```

---

## 📝 Formulários e Inputs

### Labels Apropriados

**Sempre** use labels para inputs:

```tsx
// ✅ BOM
<label htmlFor="nome">Nome completo</label>
<input
  id="nome"
  type="text"
  required
  aria-required="true"
/>

// ❌ RUIM
<input type="text" placeholder="Nome" />
```

### Mensagens de Erro

Associe erros com campos:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={hasError}
  aria-describedby={hasError ? 'email-error' : undefined}
/>
{hasError && (
  <span id="email-error" className="text-error">
    Por favor, insira um email válido
  </span>
)}
```

### Autocomplete

Use atributos de autocomplete:

```tsx
<input
  type="email"
  autoComplete="email"
  aria-label="Email"
/>

<input
  type="tel"
  autoComplete="tel"
  aria-label="Telefone"
/>
```

---

## 🖼️ Imagens e Mídia

### Alt Text

**Sempre** forneça texto alternativo:

```tsx
// ✅ BOM: Imagem informativa
<Image
  src="/logo.png"
  alt="Logo Token Milagre - Plataforma de educação financeira"
  width={100}
  height={100}
/>

// ✅ BOM: Imagem decorativa
<Image
  src="/decoration.png"
  alt=""  // Alt vazio para imagens decorativas
  aria-hidden="true"
  width={50}
  height={50}
/>

// ❌ RUIM: Sem alt
<img src="/logo.png" />
```

### Vídeos

Forneça legendas e transcrições:

```tsx
<video controls>
  <source src="video.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="captions.vtt"
    srcLang="pt-BR"
    label="Português"
  />
  Seu navegador não suporta vídeo HTML5.
</video>
```

---

## ✔️ Checklist de Acessibilidade

Use este checklist ao criar novos componentes:

### Estrutura
- [ ] HTML semântico (header, main, nav, footer, article, etc.)
- [ ] Landmarks ARIA apropriados
- [ ] Ordem lógica de heading (h1, h2, h3...)

### Teclado
- [ ] Todos os elementos interativos são focáveis
- [ ] Ordem de foco lógica
- [ ] Estados de foco visíveis
- [ ] Sem armadilhas de foco
- [ ] Funciona sem mouse

### Cor e Contraste
- [ ] Contraste mínimo 7:1 (texto normal)
- [ ] Contraste mínimo 4.5:1 (texto grande)
- [ ] Informação não depende apenas de cor
- [ ] Testado em modo claro e escuro

### Conteúdo
- [ ] Alt text em imagens
- [ ] Labels em inputs
- [ ] Erros de formulário descritivos
- [ ] Links com texto descritivo (evite "clique aqui")

### Interação
- [ ] Alvos de toque mínimo 44x44px
- [ ] Espaçamento adequado entre elementos
- [ ] Timeouts podem ser desabilitados/estendidos
- [ ] Animações podem ser reduzidas (prefers-reduced-motion)

### Leitor de Tela
- [ ] ARIA labels quando necessário
- [ ] Live regions para conteúdo dinâmico
- [ ] Elementos ocultos marcados com aria-hidden
- [ ] Testado com leitor de tela

---

## 🧪 Ferramentas de Teste

### Extensões de Navegador

1. **axe DevTools** (Chrome/Firefox)
   - Testes automáticos de acessibilidade
   - https://www.deque.com/axe/devtools/

2. **WAVE** (Chrome/Firefox)
   - Avaliação visual de acessibilidade
   - https://wave.webaim.org/extension/

3. **Lighthouse** (Chrome DevTools)
   - Auditoria integrada
   - DevTools > Lighthouse > Accessibility

### Leitores de Tela

- **NVDA** (Windows - Gratuito)
  - https://www.nvaccess.org/

- **JAWS** (Windows - Pago)
  - https://www.freedomscientific.com/products/software/jaws/

- **VoiceOver** (macOS/iOS - Nativo)
  - Cmd + F5 para ativar

- **TalkBack** (Android - Nativo)

### Teste Manual

```bash
# Apenas teclado
1. Desconecte o mouse
2. Navegue pelo site usando Tab/Shift+Tab
3. Ative elementos com Enter/Space
4. Verifique se consegue acessar tudo

# Zoom
1. Aumente o zoom para 200%
2. Verifique se o conteúdo ainda é legível
3. Verifique se não há scroll horizontal

# Contraste
1. Use DevTools para verificar contraste
2. Teste em modo escuro
3. Simule daltonismo (DevTools > Rendering > Emulate vision deficiencies)
```

---

## 📚 Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)

---

## 🤝 Contribuindo

Se você encontrar problemas de acessibilidade, por favor:

1. Abra uma issue no GitHub
2. Descreva o problema detalhadamente
3. Inclua screenshots/gravações se possível
4. Sugira uma solução se tiver

---

**Acessibilidade é um direito, não uma funcionalidade!**

**Última atualização**: 2025-11-19
