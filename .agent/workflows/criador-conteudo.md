---
description: Workflow principal para criação de conteúdo via Perplexity AI
---

# Criador de Conteúdo

Este workflow gerencia os prompts usados pela API Perplexity para criação de conteúdo no TokenMilagre.

## Tipos de Conteúdo

| Tipo | Arquivo | Descrição |
|------|---------|-----------|
| Trends | [prompts/trends.md](prompts/trends.md) | Pesquisa de notícias trending |
| Notícias | [prompts/news.md](prompts/news.md) | Criação de notícias jornalísticas |
| Educacional | [prompts/educational.md](prompts/educational.md) | Artigos educacionais com quiz |
| Recursos | [prompts/resource.md](prompts/resource.md) | Guias de ferramentas/recursos |

## Como Funciona

1. A API `/api/chat-perplexity` carrega o prompt apropriado via `prompt-loader.ts`
2. Variáveis dinâmicas como `{{CURRENT_TIME}}` são substituídas
3. O prompt é enviado ao Perplexity junto com a mensagem do usuário
4. A resposta JSON é parseada e retornada ao frontend

## Variáveis Disponíveis

| Variável | Descrição |
|----------|-----------|
| `{{CURRENT_TIME}}` | Data/hora atual em pt-BR (ex: "domingo, 29 de dezembro de 2024 às 21:47") |

## Editando Prompts

1. Edite o arquivo `.md` correspondente em `prompts/`
2. As mudanças são aplicadas automaticamente na próxima requisição
3. Não é necessário reiniciar o servidor

## Testando

```bash
# Testar endpoint de trends (sem articleType)
curl -X POST http://localhost:3000/api/chat-perplexity \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "trends de hoje"}]}'

# Testar criação de notícia
curl -X POST http://localhost:3000/api/chat-perplexity \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Bitcoin atinge 100k"}], "articleType": "news"}'
```
