# Guia de Otimização de Imagens

Este documento descreve como otimizar as imagens do projeto Token Milagre.

## 🎯 Objetivos

1. Converter imagens PNG/JPEG para WebP
2. Reduzir tamanho de arquivos em ~30-50%
3. Manter qualidade visual
4. Melhorar performance da aplicação

## 📊 Assets Atuais

### Imagens a Otimizar

```
public/images/
├── X-twitter.png (18KB) → converter para WebP
├── pumpfun-logo.png (38KB) → converter para WebP ou SVG
├── solana-logo.png (26KB) → converter para WebP ou SVG
├── telegrama.png (16KB) → converter para WebP ou SVG
└── covers/news/*.png → converter para WebP
```

### Imagens Já Otimizadas (WebP)

```
✅ TOKEN-MILAGRE-Hero.webp
✅ TOKEN-MILAGRE-.webp
✅ Solana_logo1.webp
✅ Token-MILAGRE-*.webp
```

## 🛠️ Ferramentas

### Opção 1: Online (Mais Fácil)

**Squoosh (Google)**
- URL: https://squoosh.app/
- Arraste e solte imagens
- Configure WebP com qualidade 80-85%
- Download imagens otimizadas

**TinyPNG**
- URL: https://tinypng.com/
- Otimiza PNG/JPEG
- Conversão para WebP

### Opção 2: CLI (Recomendado)

#### Instalar cwebp (WebP encoder)

**macOS:**
```bash
brew install webp
```

**Ubuntu/Debian:**
```bash
sudo apt-get install webp
```

**Windows:**
```bash
# Download de https://developers.google.com/speed/webp/download
# Adicione ao PATH
```

#### Converter Imagens

```bash
# Navegar para o diretório do projeto
cd tokenmilagre-platform/public/images

# PNG para WebP
cwebp -q 85 X-twitter.png -o X-twitter.webp
cwebp -q 85 pumpfun-logo.png -o pumpfun-logo.webp
cwebp -q 85 solana-logo.png -o solana-logo.webp
cwebp -q 85 telegrama.png -o telegrama.webp

# Batch conversion (todos os PNGs)
for file in *.png; do
  cwebp -q 85 "$file" -o "${file%.png}.webp"
done

# News covers
cd covers/news/
for file in *.png; do
  cwebp -q 80 "$file" -o "${file%.png}.webp"
done
```

### Opção 3: Node.js Script (Automatizado)

#### 1. Instalar sharp

```bash
cd tokenmilagre-platform
npm install sharp --save-dev
```

#### 2. Criar script de otimização

```javascript
// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 85 })
      .toFile(outputPath);

    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(2);

    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   ${(inputSize / 1024).toFixed(2)}KB → ${(outputSize / 1024).toFixed(2)}KB (${savings}% menor)`);
  } catch (error) {
    console.error(`❌ Erro ao processar ${inputPath}:`, error.message);
  }
}

async function optimizeDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await optimizeDirectory(filePath);
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      const outputPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      await optimizeImage(filePath, outputPath);
    }
  }
}

async function main() {
  console.log('🚀 Iniciando otimização de imagens...\n');

  const publicDir = path.join(__dirname, '../public');
  await optimizeDirectory(publicDir);

  console.log('\n✨ Otimização concluída!');
}

main();
```

#### 3. Adicionar script ao package.json

```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js"
  }
}
```

#### 4. Executar

```bash
npm run optimize:images
```

## 📝 Checklist de Otimização

### Pré-otimização
- [ ] Fazer backup das imagens originais
- [ ] Documentar tamanhos atuais
- [ ] Identificar imagens não utilizadas

### Durante
- [ ] Converter PNG → WebP (qualidade 85%)
- [ ] Converter JPEG → WebP (qualidade 80%)
- [ ] Considerar SVG para logos simples
- [ ] Redimensionar se necessário (max 1920px largura)

### Pós-otimização
- [ ] Testar imagens no navegador
- [ ] Verificar qualidade visual
- [ ] Atualizar imports nos componentes
- [ ] Remover originais PNG/JPEG se WebP funciona
- [ ] Atualizar site.webmanifest se necessário

## 🎨 Conversão para SVG

Para logos simples (pumpfun, solana, etc.), considere SVG:

### Opção 1: Redesenhar em Figma/Illustrator

1. Importar PNG
2. Usar ferramenta de vetorização
3. Simplificar paths
4. Exportar como SVG

### Opção 2: Trace Online

- [VectorMagic](https://vectormagic.com/)
- [Adobe Express](https://www.adobe.com/express/feature/image/convert/png-to-svg)

### Opção 3: ImageMagick + Potrace

```bash
# Converter para BMP
convert logo.png logo.bmp

# Trace para SVG
potrace logo.bmp -s -o logo.svg

# Otimizar SVG
svgo logo.svg
```

## 📊 Resultados Esperados

### Economia de Tamanho

| Asset | Antes | Depois | Economia |
|-------|-------|--------|----------|
| X-twitter.png | 18KB | ~12KB | ~33% |
| pumpfun-logo.png | 38KB | ~25KB | ~34% |
| solana-logo.png | 26KB | ~17KB | ~35% |
| telegrama.png | 16KB | ~11KB | ~31% |
| **Total** | **~98KB** | **~65KB** | **~34%** |

### Performance

- ⚡ Carregamento 30% mais rápido
- 📉 Menor uso de bandwidth
- 🎯 Melhor score no Lighthouse
- 💚 Melhor Core Web Vitals

## 🔄 Atualizar Componentes

Após converter para WebP, atualize os imports:

```tsx
// Antes
<Image src="/images/solana-logo.png" ... />

// Depois
<Image src="/images/solana-logo.webp" ... />
```

Use find/replace:
```bash
# Find
/images/([^"]+)\.png

# Replace
/images/$1.webp
```

## ⚠️ Fallbacks

Se precisar suportar navegadores muito antigos:

```tsx
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <source srcSet="/image.png" type="image/png" />
  <img src="/image.png" alt="Descrição" />
</picture>
```

**Mas:** WebP tem suporte de 95%+ dos navegadores (2024).

## 🧪 Testar

### Visual

1. Abrir imagens lado a lado
2. Comparar qualidade
3. Se necessário, aumentar qualidade (90-95%)

### Performance

```bash
# Lighthouse
npm run build
npm start
# Chrome DevTools > Lighthouse > Performance

# Verificar:
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Image optimization score
```

## 📚 Recursos

- [WebP Documentation](https://developers.google.com/speed/webp)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

---

**Nota**: Este processo pode economizar ~100KB+ total, melhorando significativamente o tempo de carregamento da página.

**Última atualização**: 2025-11-19
