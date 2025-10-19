# 🪄 TokenMilagre CLI - Guia Completo

**Centro de Comando Interativo** para criar e gerenciar artigos de cripto.

---

## 🚀 Instalação e Setup

### 1. Instalar dependências (já feito)

```bash
npm install prompts node-fetch@2
```

### 2. Garantir que Gemini CLI está instalado

```bash
# Testar
gemini "Hello"

# Se não estiver instalado, instale seguindo:
# https://ai.google.dev/gemini-api/docs/command-line
```

### 3. Iniciar o sistema

```bash
# Terminal 1: Servidor + Watcher
./create-article.sh start

# Terminal 2: CLI Interativo
npm run cli
```

---

## 🎯 Funcionalidades

### Menu Principal

```
╔════════════════════════════════════════════════════════╗
║  🪄 TokenMilagre CLI - Centro de Comando               ║
╠════════════════════════════════════════════════════════╣
║  1. 📊 Verificar artigos do dia                        ║
║  2. ✍️  Criar novo artigo (com Gemini)                 ║
║  3. 🔍 Fact-check de artigo                            ║
║  4. 🚀 Publicar/Gerenciar artigo                       ║
║  5. 📈 Estatísticas do sistema                         ║
║  0. 👋 Sair                                            ║
╚════════════════════════════════════════════════════════╝
```

---

## 1️⃣ Verificar Artigos do Dia

**O que faz:**
- Lista artigos mais recentes do banco
- Mostra sentiment com ícone visual (🟢🟡🔴)
- Exibe status de fact-check
- Gera URLs prontas para acessar

**Output exemplo:**

```
✅ Encontrados 5 artigo(s):

1. Bitcoin atinge US$ 100.000 em marco histórico
   🟢 Sentiment: positive
   🏷️  Categoria: Bitcoin
   🔗 Slug: bitcoin-atinge-100-000
   ✅ Verificado (85%)
   📅 Publicado: 07/10/2025 14:30
   🌐 URL: http://localhost:3000/dashboard/noticias/bitcoin-atinge-100-000
```

---

## 2️⃣ Criar Novo Artigo

**3 modos de criação:**

### A) 🤖 Gemini Automático (Recomendado)

**Fluxo:**
1. Digita o tópico (ex: "Bitcoin ETF aprovado pela SEC")
2. Escolhe a categoria
3. Gemini gera o artigo completo
4. **Análise automática de sentimento** (positive/neutral/negative)
5. **Geração de slug SEO-friendly**
6. Extração automática de tags
7. Preview do artigo
8. Confirmação e salvamento
9. Opção de fact-check imediato

**Exemplo:**

```
Sobre o que você quer escrever?
> Bitcoin atingiu recorde de $100k

Categoria:
> Bitcoin

🤖 Gemini trabalhando...

✅ Artigo gerado!

Preview:
────────────────────────────────────────────────────────
# Bitcoin Atinge Marco Histórico de US$ 100 Mil

O Bitcoin alcançou hoje a marca inédita de US$ 100.000,
estabelecendo um novo recorde de valorização...
────────────────────────────────────────────────────────

Salvar este artigo? Sim

✅ Artigo salvo: ~/articles/bitcoin-atinge-marco-historico.md
🔄 O watcher processará automaticamente em ~5 segundos...

Executar fact-check agora? Sim

🔍 Aguardando processamento...
```

**Features especiais:**

✅ **Análise de Sentimento Inteligente:**
- Usa Gemini para detectar tom do artigo
- Fallback por palavras-chave se Gemini falhar
- Classifica automaticamente: positive, neutral, negative

✅ **Slugs SEO-Friendly:**
- Remove acentos automaticamente
- Converte para lowercase
- Substitui espaços por hífens
- Remove caracteres especiais
- Exemplo: "Bitcoin Atinge $100k!" → `bitcoin-atinge-100k`

✅ **Extração Automática de Tags:**
- Detecta keywords relevantes no conteúdo
- Máximo de 5 tags por artigo
- Baseado em dicionário de termos cripto

### B) 📄 Importar Arquivo .md Existente

**Fluxo:**
1. Informa caminho do arquivo
2. Se não tiver frontmatter, solicita metadados
3. Adiciona frontmatter automaticamente
4. Análise de sentimento automática
5. Processado pelo watcher

**Exemplo:**

```
Caminho do arquivo .md:
> ~/meu-artigo.md

⚠️  Arquivo sem frontmatter. Adicionando metadados...

Título do artigo:
> Ethereum 2.0 Launch

Categoria:
> Ethereum

✅ Frontmatter adicionado!
🔄 Artigo será processado pelo watcher...
```

### C) ✍️  Criar Manualmente

**Fluxo:**
1. Preenche campos um a um
2. Escolhe sentimento manualmente
3. Escreve/cola conteúdo markdown
4. Salva automaticamente

---

## 3️⃣ Fact-Check de Artigo

**2 métodos:**

### A) Por Slug (artigo já publicado)

```
Escolha o método:
> Por slug (artigo já publicado)

Slug do artigo:
> bitcoin-atinge-100k

🔍 Executando fact-check...

📊 Resultado do Fact-Check:
════════════════════════════════════════════════════════

✅ Status: VERIFIED
📈 Score: 85/70
📄 Claims analisados: 5
✅ Verificados: 4
❌ Não verificados: 1
🔗 Fontes consultadas: 12
🔍 APIs usadas: Google Custom Search, Brave Search

📋 Detalhes das Verificações:
────────────────────────────────────────────────────────

1. Bitcoin atingiu $100.000 dólares
   ✅ Confiança: 95%
   📚 Fontes: 5
   💡 Verificado com 5 fontes em múltiplos provedores

2. Subiu 15% nas últimas 24 horas
   ✅ Confiança: 80%
   📚 Fontes: 4
   💡 Verificado com 4 fontes em múltiplos provedores

...
```

### B) Por Arquivo .md

```
Escolha o método:
> Por arquivo .md

Caminho do arquivo .md:
> ~/articles/meu-artigo.md

🔍 Executando fact-check...
```

**Informações retornadas:**
- ✅ Status (VERIFIED/FAILED/SKIPPED)
- 📈 Score geral e threshold
- 📄 Número de claims analisados
- ✅ Claims verificados vs não verificados
- 🔗 Fontes consultadas (URLs)
- 🔍 APIs utilizadas
- 📋 Detalhes de cada claim individual

---

## 4️⃣ Publicar/Gerenciar Artigo

**Funcionalidade:**
- Busca artigo por slug
- Exibe informações completas
- Mostra status de publicação
- Gera URL pública

**Exemplo:**

```
Slug do artigo:
> bitcoin-atinge-100k

📄 Artigo:
────────────────────────────────────────────────────────
Título: Bitcoin atinge US$ 100.000
Slug: bitcoin-atinge-100k
Categoria: Bitcoin
Sentiment: positive
Fact-check: ✅ 85%
URL: http://localhost:3000/dashboard/noticias/bitcoin-atinge-100k
────────────────────────────────────────────────────────

✅ Artigo já está publicado!
🌐 Acesse: http://localhost:3000/dashboard/noticias/bitcoin-atinge-100k
```

---

## 5️⃣ Estatísticas do Sistema

**Métricas exibidas:**
- 📄 Total de artigos
- ✅ Artigos verificados (%)
- ⚠️  Artigos não verificados
- 📈 Score médio de fact-check
- 🟢🟡🔴 Distribuição de sentimentos (%)

**Exemplo:**

```
📊 Estatísticas Gerais:
════════════════════════════════════════════════════════

📄 Total de artigos: 25
✅ Verificados: 20 (80.0%)
⚠️  Não verificados: 5
📈 Score médio: 82.5%

Sentimentos:
🟢 Positive: 12 (48.0%)
🟡 Neutral: 10 (40.0%)
🔴 Negative: 3 (12.0%)

════════════════════════════════════════════════════════
```

---

## 🎨 Features de UX

### Cores e Ícones

- 🟢 Verde = Sucesso, Positive sentiment
- 🟡 Amarelo = Aviso, Neutral sentiment
- 🔴 Vermelho = Erro, Negative sentiment
- 🔵 Azul = Informação
- 🪄 Ícones intuitivos para cada ação

### Navegação

- Menu sempre volta após cada ação
- Opção de sair ou continuar
- Validação de inputs em tempo real
- Mensagens de erro claras

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```bash
# .env
NEXT_PUBLIC_API_URL=http://localhost:3000  # URL da API
ENABLE_FACT_CHECK=true                      # Habilitar fact-check
GOOGLE_SEARCH_API_KEY=...                   # API Google (opcional)
BRAVE_SEARCH_API_KEY=...                    # API Brave (opcional)
```

### Customização de Thresholds

Edite `cli/tokenmilagre-cli.js`:

```javascript
// Linha ~XXX
const factcheck = await runFactCheck(markdown, {
  threshold: 70,  // Score mínimo para aprovação
  maxClaims: 10   // Máximo de claims a verificar
});
```

---

## 📝 Estrutura de Arquivos Gerados

### Markdown com Frontmatter

```yaml
---
title: "Bitcoin atinge US$ 100.000"
summary: "Criptomoeda líder quebra recorde histórico"
category: bitcoin
tags: [bitcoin, btc, preço, recorde]
sentiment: positive
author: admin@tokenmilagre.xyz
---

# Bitcoin atinge US$ 100.000

Conteúdo do artigo...

---

**Gerado por:** TokenMilagre CLI + Gemini
**Data:** 07/10/2025
```

### Slugs Gerados

| Título Original | Slug Gerado |
|----------------|-------------|
| "Bitcoin Atinge $100k!" | `bitcoin-atinge-100k` |
| "Ethereum 2.0: Nova Era" | `ethereum-2-0-nova-era` |
| "DeFi Cresceu 300%" | `defi-cresceu-300` |

---

## 🐛 Troubleshooting

### CLI não inicia

```bash
# Verificar dependências
npm list prompts node-fetch

# Reinstalar se necessário
npm install prompts node-fetch@2
```

### Gemini não responde

```bash
# Verificar instalação
which gemini

# Testar manualmente
gemini "teste"

# Se falhar, consulte: https://ai.google.dev/gemini-api/docs/command-line
```

### Fact-check sempre retorna "skipped"

**Causa:** APIs não configuradas

**Solução:**
```bash
# Adicionar no .env
GOOGLE_SEARCH_API_KEY=sua-chave
BRAVE_SEARCH_API_KEY=sua-chave
```

### Artigo não aparece após criação

**Causa:** Watcher não está rodando

**Solução:**
```bash
# Iniciar sistema completo
./create-article.sh start

# Ou manualmente
npm run watch
```

### Sentiment sempre retorna "neutral"

**Causa:** Gemini CLI pode estar falhando

**Solução:** O sistema tem fallback por palavras-chave, mas você pode:
1. Verificar que Gemini CLI funciona
2. Escolher sentiment manualmente (opção "Criar manualmente")

---

## 💡 Dicas Pro

### Alias para Acesso Rápido

```bash
# Adicionar no ~/.bashrc
alias tm-cli='cd ~/Trabalho/tokenmilagre-platform && npm run cli'

# Usar
tm-cli
```

### Workflow Recomendado

1. **Iniciar sistema:**
   ```bash
   ./create-article.sh start
   ```

2. **Abrir CLI em outro terminal:**
   ```bash
   npm run cli
   ```

3. **Criar artigo com Gemini:**
   - Opção 2 → Gemini automático
   - Informar tópico
   - Confirmar artigo
   - Fazer fact-check

4. **Verificar no dashboard:**
   - http://localhost:3000/dashboard/noticias

### Atalhos de Teclado

- `Ctrl+C` = Cancelar operação atual
- `Enter` = Confirmar (em prompts toggle)
- Setas ↑↓ = Navegar em menus select

---

## 🚀 Exemplos Práticos

### Exemplo 1: Artigo Completo em 2 Minutos

```bash
# 1. Iniciar CLI
npm run cli

# 2. Selecionar opção 2 (Criar artigo)
> 2

# 3. Escolher "Gemini automático"
> 1

# 4. Informar tópico
> Bitcoin ultrapassa Ethereum em adoção institucional

# 5. Escolher categoria
> Bitcoin

# 6. Aguardar Gemini (~30s)

# 7. Confirmar artigo
> Sim

# 8. Fazer fact-check
> Sim

# 9. Pronto! Artigo publicado e verificado
```

### Exemplo 2: Verificar Artigo Antigo

```bash
npm run cli
> 3  # Fact-check
> Por slug
> bitcoin-100k
```

### Exemplo 3: Ver Estatísticas

```bash
npm run cli
> 5  # Estatísticas
```

---

## 🎯 Vantagens sobre Método Manual

| Manual | CLI Automático |
|--------|----------------|
| ❌ Criar arquivo manualmente | ✅ Gemini gera conteúdo |
| ❌ Escrever frontmatter | ✅ Metadados automáticos |
| ❌ Detectar sentimento manualmente | ✅ Análise automática |
| ❌ Gerar slug | ✅ Slug SEO automático |
| ❌ Escolher tags | ✅ Extração automática |
| ❌ Aguardar watcher | ✅ Feedback em tempo real |
| ❌ Verificar no navegador | ✅ Fact-check integrado |

---

## 📊 Performance

**Tempos médios:**
- Criar artigo com Gemini: ~30-60s
- Importar arquivo: ~5s
- Fact-check: ~10-15s
- Listar artigos: <1s
- Estatísticas: <1s

---

## 🔒 Segurança

- ✅ Validação de inputs
- ✅ Sanitização de slugs
- ✅ Verificação de arquivos existentes
- ✅ Não expõe credenciais
- ✅ Usa variáveis de ambiente

---

## 🎉 Conclusão

O **TokenMilagre CLI** é seu **centro de comando completo** para:

- ✅ Criar artigos rapidamente com IA
- ✅ Verificar fatos automaticamente
- ✅ Gerar slugs SEO-friendly
- ✅ Analisar sentimento automaticamente
- ✅ Gerenciar publicações
- ✅ Monitorar estatísticas

**Tudo em uma interface interativa e intuitiva! 🪄**

---

**Precisa de ajuda?** Consulte:
- `ARTICLES-WORKFLOW.md` - Workflow completo
- `FACT-CHECKING-SETUP.md` - Configurar APIs
- `README-SCRIPT.md` - Scripts de gerenciamento
