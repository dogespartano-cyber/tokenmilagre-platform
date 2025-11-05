# 🚫 Problema: Quota Excedida - Gemini Image API

## 📊 Diagnóstico

Executamos o teste e identificamos o problema:

```
Status: 429 Too Many Requests
Erro: Quota exceeded for metric: generate_content_free_tier_requests
LIMIT: 0 ⚠️
```

---

## ❌ O Problema

**Sua API key do Gemini tem `limit: 0` para geração de imagens.**

**O que isso significa:**
- ✅ API key **FUNCIONA** para geração de texto (Gemini 2.5 Flash)
- ❌ API key **NÃO TEM QUOTA** para geração de imagens (Gemini 2.5 Flash Image)

**Por que isso acontece:**
1. **API key criada antes** do modelo de imagens ser lançado
2. **Free tier esgotado** ou desabilitado na conta
3. **Restrições regionais** ou de conta do Google AI Studio

---

## ✅ Soluções Disponíveis

### Solução 1: Criar Nova API Key (Recomendado) 🔑

**Passo a passo:**

1. **Acessar Google AI Studio:**
   ```
   https://aistudio.google.com/apikey
   ```

2. **Deletar API key antiga** (opcional)
   - Clicar no ícone de lixeira ao lado da key atual

3. **Criar nova API key:**
   - Clicar em "Create API Key"
   - Escolher um projeto do Google Cloud (ou criar novo)
   - Copiar a nova key

4. **Verificar quota disponível:**
   ```
   https://ai.dev/usage?tab=rate-limit
   ```
   - Procurar por "gemini-2.5-flash-image"
   - Verificar se há quota disponível (não pode ser 0)

5. **Atualizar `.env` do projeto:**
   ```bash
   cd /home/destakar/Trabalho/tokenmilagre-platform
   nano .env
   ```

   Substituir linha:
   ```
   GEMINI_API_KEY="nova_api_key_aqui"
   ```

   Salvar: `Ctrl+O`, Enter, `Ctrl+X`

6. **Reiniciar servidor:**
   ```bash
   cd /home/destakar/Trabalho
   ./server-manager.sh restart
   ```

7. **Testar novamente:**
   ```bash
   node scripts/test-gemini-image-api.js
   ```

---

### Solução 2: Desabilitar Geração de Capas Temporariamente ⏸️

Se não quiser criar nova API key agora, pode desabilitar a geração de capas:

**1. Adicionar variável no `.env`:**
```bash
cd /home/destakar/Trabalho/tokenmilagre-platform
nano .env
```

Adicionar no final do arquivo:
```bash
# Desabilitar geração de capas (temporário)
ENABLE_COVER_GENERATION=false
```

Salvar: `Ctrl+O`, Enter, `Ctrl+X`

**2. Reiniciar servidor:**
```bash
cd /home/destakar/Trabalho
./server-manager.sh restart
```

**3. Testar criação de artigo:**
- Sistema funcionará normalmente
- Artigos serão criados **SEM capa**
- Nenhum erro será exibido

**Para reativar no futuro:**
```bash
ENABLE_COVER_GENERATION=true
```

---

### Solução 3: Aguardar Reset do Free Tier ⏰

Se você testou MUITAS vezes e esgotou a quota do dia:

**Quando reseta:**
- Limite diário: **meia-noite UTC** (21:00 BRT)
- Limite por minuto: **60 segundos** após última requisição

**Verificar uso atual:**
```
https://ai.dev/usage?tab=rate-limit
```

**⚠️ Atenção:** No seu caso, o limite é **0**, então essa solução NÃO vai funcionar. Você precisa criar nova API key.

---

## 🧪 Script de Teste

Criamos um script para testar a API key:

```bash
cd /home/destakar/Trabalho/tokenmilagre-platform
node scripts/test-gemini-image-api.js
```

**Resultado esperado após corrigir:**
```
✅✅✅ IMAGEM GERADA COM SUCESSO! ✅✅✅

📊 Detalhes da imagem:
- MIME type: image/jpeg
- Tamanho (base64): 123456 caracteres
- Tamanho estimado: 92 KB

🎉 Sua API key está funcionando perfeitamente!
```

---

## 📋 Checklist de Resolução

- [ ] Acessar Google AI Studio: https://aistudio.google.com/apikey
- [ ] Criar nova API key
- [ ] Verificar quota: https://ai.dev/usage?tab=rate-limit
- [ ] Copiar nova API key
- [ ] Atualizar `GEMINI_API_KEY` no `.env`
- [ ] Reiniciar servidor: `./server-manager.sh restart`
- [ ] Executar teste: `node scripts/test-gemini-image-api.js`
- [ ] Criar artigo de teste e verificar capa

---

## 💡 Dicas Importantes

1. **Não compartilhe sua API key**
   - É uma credencial sensível
   - Pode ser usada por outras pessoas

2. **Monitore seu uso**
   - https://ai.dev/usage?tab=rate-limit
   - Free tier: 100 imagens/dia

3. **Limites do free tier:**
   - 10 imagens por minuto
   - 100 imagens por dia
   - Quota reseta à meia-noite UTC

4. **Se precisar mais:**
   - Considere fazer upgrade para tier pago
   - Ou aguarde reset diário

---

## 🆘 Se Nada Funcionar

Se após criar nova API key o problema persistir:

1. **Verificar se modelo está disponível:**
   - Acessar: https://aistudio.google.com
   - Testar geração de imagem manualmente
   - Se não funcionar, modelo pode não estar disponível na sua região

2. **Alternativa temporária:**
   - Desabilitar geração de capas (`ENABLE_COVER_GENERATION=false`)
   - Sistema funcionará normalmente sem capas
   - Artigos continuam sendo criados

3. **Contatar suporte Google:**
   - https://support.google.com/googleai

---

**Documento criado em:** 2025-11-01
**Última atualização:** 2025-11-01
**Status:** Problema identificado - Aguardando criação de nova API key
