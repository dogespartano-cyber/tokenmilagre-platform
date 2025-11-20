# Diretrizes de Assets e Importação

Este documento define as convenções e melhores práticas para uso de imagens, ícones e outros assets no projeto Token Milagre.

## 📋 Índice

- [Estrutura de Diretórios](#estrutura-de-diretórios)
- [Formatos de Imagem](#formatos-de-imagem)
- [Convenções de Nomenclatura](#convenções-de-nomenclatura)
- [Otimização de Imagens](#otimização-de-imagens)
- [Importação em Componentes](#importação-em-componentes)
- [Next.js Image Component](#nextjs-image-component)
- [Ícones](#ícones)
- [Favicon e PWA](#favicon-e-pwa)
- [Checklist](#checklist)

---

## 📁 Estrutura de Diretórios

```
public/
├── images/
│   ├── TOKEN-MILAGRE-Hero.webp     # Logo hero
│   ├── TOKEN-MILAGRE-.webp         # Logo principal
│   ├── Solana_logo1.webp           # Logo Solana
│   └── covers/                     # Capas de artigos
│       ├── news/                   # Capas de notícias
│       ├── educational/            # Capas educacionais
│       └── resource/               # Capas de recursos
├── icon-192.png                    # PWA icon (pequeno)
├── icon-512.png                    # PWA icon (grande)
├── apple-touch-icon.png            # iOS home screen
├── favicon.ico                     # Favicon navegador
└── site.webmanifest                # PWA manifest
```

### Regras de Organização

1. **Logos e branding**: Raiz de `/images/`
2. **Capas de conteúdo**: `/images/covers/{tipo}/`
3. **Ícones de plataforma**: Raiz de `/public/`
4. **Assets temporários**: Evite! Use `/images/temp/` se absolutamente necessário

---

## 🖼️ Formatos de Imagem

### Ordem de Preferência

1. **WebP** (preferido)
   - Melhor compressão
   - Suporte moderno
   - ~30% menor que PNG/JPEG
   - Use para: fotos, ilustrações, logos

2. **SVG** (vetores)
   - Ícones e ilustrações simples
   - Escalável infinitamente
   - Pequeno tamanho de arquivo
   - Use para: ícones, logos simples, gráficos

3. **PNG** (fallback)
   - Transparência
   - Use quando WebP não for suportado
   - Use para: PWA icons, favicon

4. **JPEG** (evitar)
   - Apenas para fotos legadas
   - Migre para WebP quando possível

### Quando Usar Cada Formato

| Tipo de Asset | Formato Recomendado | Exemplo |
|---------------|---------------------|---------|
| Logo | WebP ou SVG | `logo.webp`, `logo.svg` |
| Foto de produto | WebP | `product-hero.webp` |
| Ícone simples | SVG | `check-icon.svg` |
| Capa de artigo | WebP | `article-cover.webp` |
| PWA Icon | PNG | `icon-512.png` |
| Favicon | ICO ou PNG | `favicon.ico` |

---

## 📝 Convenções de Nomenclatura

### Regras Gerais

1. **Lowercase** e **kebab-case**
   ```
   ✅ token-milagre-hero.webp
   ❌ TOKEN-MILAGRE-Hero.WEBP
   ❌ TokenMilagreHero.webp
   ```

2. **Descritivo e específico**
   ```
   ✅ bitcoin-price-chart-2024.webp
   ❌ chart.webp
   ❌ img1.webp
   ```

3. **Inclua dimensões se relevante**
   ```
   ✅ icon-192.png
   ✅ icon-512.png
   ✅ banner-1920x1080.webp
   ```

4. **Evite espaços e caracteres especiais**
   ```
   ✅ solana-logo.webp
   ❌ solana logo.webp
   ❌ solana_logo!.webp
   ```

### Padrões Específicos

```bash
# Logos
{nome}-logo.webp
# Exemplo: solana-logo.webp, bitcoin-logo.webp

# Capas de artigos
{slug}-cover.webp
# Exemplo: bitcoin-basics-cover.webp

# Screenshots
{feature}-screenshot.webp
# Exemplo: dashboard-screenshot.webp

# Ícones
{nome}-icon.svg
# Exemplo: wallet-icon.svg, chart-icon.svg

# PWA/Favicon
icon-{tamanho}.png
apple-touch-icon.png
favicon.ico
```

---

## ⚡ Otimização de Imagens

### Tamanhos Recomendados

| Uso | Largura | Altura | Formato |
|-----|---------|--------|---------|
| Hero image | 1920px | 1080px | WebP |
| Card cover | 800px | 600px | WebP |
| Thumbnail | 400px | 300px | WebP |
| Logo | 512px | 512px | WebP/SVG |
| PWA icon | 512px | 512px | PNG |
| Favicon | 32px | 32px | ICO/PNG |

### Script de Otimização

Use o script fornecido para otimizar imagens:

```bash
# Instalar dependências
npm install sharp --save-dev

# Executar otimização
npm run optimize:images
```

O script faz:
1. Converte PNG/JPEG → WebP
2. Redimensiona se necessário
3. Otimiza qualidade (80-90%)
4. Mantém originais em `/backup/`

### Otimização Manual

Se preferir otimizar manualmente:

```bash
# PNG para WebP (usando cwebp)
cwebp -q 85 input.png -o output.webp

# JPEG para WebP
cwebp -q 80 input.jpg -o output.webp

# Redimensionar (usando ImageMagick)
convert input.png -resize 800x600 output.png
```

### Ferramentas Online

- [Squoosh](https://squoosh.app/) - Google
- [TinyPNG](https://tinypng.com/) - PNG/JPEG
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG

---

## 📦 Importação em Componentes

### Next.js Image Component (Preferido)

**Sempre use** `next/image` para melhor performance:

```tsx
import Image from 'next/image';

// ✅ BOM: Importação estática (local)
import heroImage from '@/public/images/TOKEN-MILAGRE-Hero.webp';

export function Hero() {
  return (
    <Image
      src={heroImage}
      alt="Token Milagre - Plataforma de educação financeira descentralizada"
      width={800}
      height={600}
      priority // Para imagens above-the-fold
      placeholder="blur" // Blur automático
    />
  );
}

// ✅ BOM: Path direto
export function Logo() {
  return (
    <Image
      src="/images/TOKEN-MILAGRE-.webp"
      alt="Logo Token Milagre"
      width={100}
      height={100}
      quality={90}
    />
  );
}

// ✅ BOM: Imagem externa
export function ExternalImage() {
  return (
    <Image
      src="https://example.com/image.webp"
      alt="Descrição"
      width={800}
      height={600}
      unoptimized={false} // Next.js otimiza
    />
  );
}
```

### Propriedades Importantes

```tsx
<Image
  src="/path/to/image.webp"
  alt="Descrição clara e descritiva"  // Obrigatório!
  width={800}                          // Obrigatório
  height={600}                         // Obrigatório
  priority={true}                      // Para LCP images
  placeholder="blur"                   // Blur effect
  quality={85}                         // 1-100, padrão: 75
  loading="lazy"                       // lazy | eager
  sizes="(max-width: 768px) 100vw, 50vw" // Responsive
/>
```

### Background Images

Para background images, use CSS:

```tsx
// ✅ BOM: CSS background com WebP
export function HeroSection() {
  return (
    <div
      style={{
        backgroundImage: 'url(/images/hero-bg.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <h1>Conteúdo</h1>
    </div>
  );
}

// Ou com CSS Module
// styles.module.css
.hero {
  background-image: url(/images/hero-bg.webp);
  background-size: cover;
  background-position: center;
}
```

### Imagens Condicionais (Tema)

```tsx
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';

export function ThemedLogo() {
  const { theme } = useTheme();

  return (
    <Image
      src={theme === 'dark'
        ? '/images/logo-dark.webp'
        : '/images/logo-light.webp'}
      alt="Logo Token Milagre"
      width={100}
      height={100}
    />
  );
}
```

---

## 🎯 Next.js Image Component

### Configuração (next.config.ts)

```typescript
// next.config.ts
const config: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['example.com'], // Domínios externos permitidos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
};
```

### Lazy Loading

```tsx
// Above-the-fold: Prioridade
<Image src="/hero.webp" priority />

// Below-the-fold: Lazy
<Image src="/feature.webp" loading="lazy" />
```

### Responsive Images

```tsx
<Image
  src="/image.webp"
  alt="Descrição"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
/>
```

Isso gera:
- Múltiplos tamanhos otimizados
- Serve o tamanho correto para cada device
- Economiza bandwidth

---

## 🎨 Ícones

### FontAwesome (Atual)

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCheck } from '@fortawesome/free-solid-svg-icons';

export function IconExample() {
  return (
    <>
      <FontAwesomeIcon icon={faHeart} />
      <FontAwesomeIcon icon={faCheck} className="text-success" />
    </>
  );
}
```

### SVG Icons (Recomendado)

Para ícones customizados:

```tsx
// components/icons/CheckIcon.tsx
export function CheckIcon({ className = '', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-6 h-6 ${className}`}
      {...props}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );
}

// Uso
<CheckIcon className="text-success" />
```

### Ícone de Imagem

Para ícones que são imagens:

```tsx
<Image
  src="/images/icons/wallet-icon.svg"
  alt=""  // Alt vazio para ícones decorativos
  aria-hidden="true"
  width={24}
  height={24}
/>
```

---

## 📱 Favicon e PWA

### Estrutura Completa

```
public/
├── favicon.ico              # 32x32 ou multi-size
├── icon-192.png            # Android Chrome
├── icon-512.png            # Android Chrome (alta res)
├── apple-touch-icon.png    # iOS (180x180)
└── site.webmanifest        # PWA manifest
```

### site.webmanifest

```json
{
  "name": "$MILAGRE Token",
  "short_name": "$MILAGRE",
  "description": "Token comunitário de apoio mútuo na Solana",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F8F9FA",
  "theme_color": "#0D9488",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### HTML Head

```tsx
// app/layout.tsx
<head>
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <meta name="theme-color" content="#0D9488" />
</head>
```

### Gerando Favicons

Use ferramentas online:
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

Ou script:
```bash
npm install sharp --save-dev
# Usar script em /scripts/generate-favicons.js
```

---

## ✅ Checklist

Antes de adicionar um novo asset:

### Imagem
- [ ] Formato correto (WebP preferido)
- [ ] Nome descritivo em kebab-case
- [ ] Otimizada (qualidade 80-90%)
- [ ] Tamanho apropriado para uso
- [ ] Localização correta no diretório

### Código
- [ ] Usa `next/image` quando possível
- [ ] Tem `alt` text descritivo
- [ ] Width e height definidos
- [ ] `priority` para imagens LCP
- [ ] `loading="lazy"` para below-fold

### Acessibilidade
- [ ] Alt text presente e descritivo
- [ ] Alt vazio para imagens decorativas
- [ ] Aria-hidden para ícones decorativos
- [ ] Não usa imagem como único meio de informação

### Performance
- [ ] Tamanho de arquivo < 200KB (idealmente < 100KB)
- [ ] Usa formato moderno (WebP/AVIF)
- [ ] Lazy loading quando apropriado
- [ ] Responsive sizes definidos

---

## 🚀 Performance Tips

1. **Use WebP**: 30% menor que PNG/JPEG
2. **Lazy load**: Economiza bandwidth inicial
3. **Proper sizing**: Não carregue 2MB para mostrar 200px
4. **CDN**: Next.js otimiza automaticamente
5. **Blur placeholder**: Melhor UX durante carregamento

---

## 📚 Recursos

- [Next.js Image Docs](https://nextjs.org/docs/api-reference/next/image)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [WebP vs PNG vs JPEG](https://developers.google.com/speed/webp)

---

**Última atualização**: 2025-11-19
