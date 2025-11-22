# Guia de Integração - Eliminação de Roxo

Este guia contém instruções completas para integrar os novos componentes sem roxo no projeto Token Milagre.

## 📋 Checklist de Deploy Rápido

- [ ] 1. Importar design tokens no CSS global
- [ ] 2. Substituir componentes antigos pelos novos
- [ ] 3. Atualizar referências de cores no código
- [ ] 4. Executar testes de verificação
- [ ] 5. Revisar acessibilidade
- [ ] 6. Deploy e validação

---

## 🎨 1. Importar Design Tokens

### Opção A: Adicionar ao globals.css existente

Adicione no topo do arquivo `app/globals.css`:

```css
@import '../styles/design-tokens.css';
```

### Opção B: Substituir variáveis existentes

Substitua as variáveis CSS existentes no `app/globals.css` pelas novas do `styles/design-tokens.css`.

**Mapeamento de substituição:**

```css
/* Antes (com roxo) */
--brand-primary: #0D9488;  /* Mantém */
--purple-primary: #6a0572;  /* ❌ REMOVER */

/* Depois (sem roxo) */
--color-primary: #0B4A6F;      /* Azul-escuro (confiança) */
--color-accent: #1E8F6E;       /* Verde (ação) */
--color-neutral-light: #F5F7F8;
--color-neutral-medium: #9AA6AD;
--color-neutral-dark: #2F3942;
```

---

## 🧩 2. Substituir Componentes

### Header

**Arquivo:** `components/no-purple/Header.tsx`

**Uso:**

```tsx
import Header from '@/components/no-purple/Header';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
```

**Características:**
- 4 itens de navegação: Início, Sobre, Recursos, Entrar
- CTA primário usa `--color-accent` (verde)
- Menu mobile responsivo
- Navegação por teclado completa

---

### Hero

**Arquivo:** `components/no-purple/Hero.tsx`

**Uso:**

```tsx
import Hero from '@/components/no-purple/Hero';

export default function HomePage() {
  return (
    <Hero
      title="Construa seu futuro financeiro com $MILAGRE"
      subtitle="Educação financeira descentralizada..."
      primaryCta={{
        label: 'Entrar no Discord',
        href: 'https://discord.gg/xk4zrz8j',
        external: true
      }}
      secondaryCta={{
        label: 'Conhecer o Token',
        href: '/token'
      }}
      showLogo={true}
    />
  );
}
```

**Características:**
- 2 CTAs: primário (verde) e secundário (azul-escuro)
- Logo animado com float
- Círculos decorativos de fundo (sem roxo)
- Indicadores de confiança

---

### Card

**Arquivo:** `components/no-purple/Card.tsx`

**Uso:**

```tsx
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '@/components/no-purple/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

export default function Example() {
  return (
    <Card variant="elevated" hover={true}>
      <CardHeader
        icon={<FontAwesomeIcon icon={faLeaf} />}
        iconColor="var(--color-accent)"
      >
        <CardTitle as="h3">Crescimento Orgânico</CardTitle>
      </CardHeader>
      <CardContent>
        Sem hype artificial. Construímos valor real através de educação...
      </CardContent>
      <CardFooter align="right">
        <Button variant="ghost" size="sm">Saiba mais</Button>
      </CardFooter>
    </Card>
  );
}
```

**Variantes:**
- `default` - borda simples, sombra leve
- `elevated` - sem borda, sombra média
- `outlined` - borda grossa, sem sombra
- `featured` - max-width 320px, sombra forte

---

### Button

**Arquivo:** `components/no-purple/Button.tsx`

**Uso:**

```tsx
import Button, { ButtonGroup } from '@/components/no-purple/Button';

export default function Example() {
  return (
    <ButtonGroup align="center">
      <Button
        variant="primary"
        size="lg"
        icon={<ArrowIcon />}
        iconPosition="right"
        href="/token"
      >
        Conhecer Token
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleClick}
      >
        Saiba mais
      </Button>
    </ButtonGroup>
  );
}
```

**Variantes:**
- `primary` - verde (`--color-accent`)
- `secondary` - azul-escuro (`--color-primary`)
- `outline` - transparente com borda azul
- `ghost` - transparente sem borda

**Tamanhos:** `sm`, `md`, `lg`

---

### TokenWidget

**Arquivo:** `components/no-purple/TokenWidget.tsx`

**⚠️ IMPORTANTE:** Use APENAS na página `/token`, NÃO no header

**Uso:**

```tsx
import TokenWidget from '@/components/no-purple/TokenWidget';

export default function TokenPage() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        {/* Conteúdo principal */}
      </div>

      <aside>
        <TokenWidget
          variant="full"
          showBuyButton={true}
        />
      </aside>
    </div>
  );
}
```

**Variantes:**
- `full` - exibe preço, 24h, market cap, volume
- `compact` - exibe apenas preço e 24h

---

### Footer

**Arquivo:** `components/no-purple/Footer.tsx`

**Uso:**

```tsx
import Footer from '@/components/no-purple/Footer';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

---

## 🔄 3. Atualizar Referências de Cores

### Substituições Necessárias

**No arquivo `/app/token/page.tsx`:**

```tsx
// ❌ Antes (com roxo)
style={{ borderColor: '#6a0572' }}
style={{ color: '#6a0572' }}
bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'

// ✅ Depois (sem roxo)
style={{ borderColor: 'var(--color-primary)' }}
style={{ color: 'var(--color-primary)' }}
bgGradient: 'linear-gradient(135deg, var(--color-accent), var(--color-teal))'
```

**No arquivo `/components/AnimatedBackground.tsx`:**

```tsx
// ❌ Antes (com roxo)
color: 'bg-purple-600'
color: 'bg-purple-500'
color: 'bg-indigo-500'

// ✅ Depois (sem roxo)
color: 'bg-blue-600'     // Azul
color: 'bg-teal-600'     // Teal
color: 'bg-green-500'    // Verde
```

**No arquivo `/app/sobre/page.tsx`:**

```tsx
// ❌ Antes (com roxo)
bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'

// ✅ Depois (sem roxo)
bgGradient: 'linear-gradient(135deg, var(--color-blue), var(--color-teal))'
```

---

## 🧪 4. Executar Testes de Verificação

### Instalação de Dependências

```bash
npm install --save-dev glob
```

### Adicionar Scripts ao package.json

```json
{
  "scripts": {
    "test:no-purple": "node scripts/check-no-purple.js",
    "test:contrast": "node scripts/check-contrast.js",
    "test:accessibility": "npm run test:no-purple && npm run test:contrast"
  }
}
```

### Executar Testes

```bash
# Verificar ausência de roxo
npm run test:no-purple

# Verificar contraste WCAG AA
npm run test:contrast

# Executar todos os testes
npm run test:accessibility
```

**Interpretação dos Resultados:**

- ✅ `test:no-purple` - Nenhuma cor roxa detectada
- ❌ `test:no-purple` - Cores roxas encontradas (veja lista e corrija)
- ✅ `test:contrast` - Todas as combinações atendem WCAG AA
- ❌ `test:contrast` - Algumas combinações com contraste insuficiente

---

## ♿ 5. Revisar Acessibilidade

### Checklist WCAG AA

- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande (18pt+)
- [ ] Focus visível em todos os links e botões
- [ ] Navegação por teclado funcional
- [ ] Marcação semântica (h1-h3, nav, main, footer)
- [ ] ARIA labels onde necessário
- [ ] Textos alternativos em imagens

### Testar Navegação por Teclado

1. Pressione `Tab` para navegar
2. Pressione `Shift+Tab` para voltar
3. Pressione `Enter` ou `Space` para ativar botões
4. Verifique que todos os elementos interativos têm focus visível

---

## 🚀 6. Deploy

### Build de Produção

```bash
npm run build
```

**Verificações Finais:**

- [ ] Build compilou sem erros
- [ ] Nenhum warning sobre cores
- [ ] Tamanho dos bundles aceitável
- [ ] Lighthouse score > 90 em acessibilidade

### Validação Pós-Deploy

```bash
# Testar em diferentes resoluções
# Desktop: 1920x1080, 1366x768
# Tablet: 768x1024
# Mobile: 375x667, 414x896

# Testar dark/light mode
# Verificar transições suaves

# Testar com leitor de tela
# NVDA (Windows), VoiceOver (Mac), TalkBack (Android)
```

---

## 📝 Notas Importantes

### Cores Proibidas

**NUNCA USE:**
- Qualquer variação de roxo (#6a0572, #8b5cf6, #7c3aed, etc.)
- Classes Tailwind: `purple-*`, `violet-*`, `fuchsia-*`
- Palavras-chave CSS: `purple`, `violet`, `magenta`, `orchid`, `plum`, `lavender`

### Cores Permitidas (Nova Paleta)

**USE:**
- **Azul-escuro** (`--color-primary` / #0B4A6F) - Confiança
- **Verde** (`--color-accent` / #1E8F6E) - Ação, crescimento
- **Teal** (`--color-teal` / #14B8A6) - Modernidade
- **Dourado** (`--color-gold` / #FFB703) - Destaque
- **Laranja** (`--color-orange` / #FB8500) - Energia
- **Neutras** (light, medium, dark) - Backgrounds e texto

---

## 🐛 Troubleshooting

### Problema: Cores não aparecem

**Solução:**
```css
/* Certifique-se de importar os tokens */
@import '../styles/design-tokens.css';
```

### Problema: Dark mode não funciona

**Solução:**
```tsx
// Verifique se o atributo data-theme está sendo setado
document.documentElement.setAttribute('data-theme', 'dark');
```

### Problema: Testes falhando

**Solução:**
```bash
# Verifique se glob está instalado
npm install --save-dev glob

# Execute os scripts manualmente para debug
node scripts/check-no-purple.js
node scripts/check-contrast.js
```

---

## 📞 Suporte

Se encontrar problemas durante a integração:

1. Verifique o changelog (`CHANGELOG.md`)
2. Execute os testes de verificação
3. Consulte este guia de integração
4. Revise os componentes de exemplo

---

**Última atualização:** 2025-01-22
**Versão:** 1.0.0
