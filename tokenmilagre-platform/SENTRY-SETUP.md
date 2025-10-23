# 🛡️ Sentry Error Tracking - Setup Guide

Sentry foi configurado no projeto para rastrear erros automaticamente em produção e desenvolvimento.

## 📋 Passos para Ativar

### 1. Criar Conta no Sentry (Grátis)

1. Acesse https://sentry.io/signup/
2. Escolha o plano **Free** (5.000 eventos/mês)
3. Crie uma organização (pode usar `tokenmilagre`)

### 2. Criar Projeto

1. No dashboard, clique em **"Create Project"**
2. Selecione **"Next.js"** como plataforma
3. Nome do projeto: `tokenmilagre-platform`
4. Clique em **"Create Project"**

### 3. Copiar DSN

Após criar o projeto, você verá o **DSN** (Data Source Name). Copie ele.

Exemplo:
```
https://abc123def456@o123456.ingest.sentry.io/7890123
```

### 4. Configurar Variável de Ambiente

Crie ou edite `.env.local` na raiz do projeto:

```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn-here@sentry.io/your-project-id
```

**IMPORTANTE**: Substitua pelo seu DSN real copiado do Sentry.

### 5. (Opcional) Auth Token para Source Maps

Se quiser enviar source maps (stack traces mais detalhados):

1. Acesse https://sentry.io/settings/account/api/auth-tokens/
2. Clique em **"Create New Token"**
3. Selecione as permissões:
   - `project:releases`
   - `project:write`
4. Copie o token

Adicione no `.env.local`:
```bash
SENTRY_AUTH_TOKEN=your-token-here
```

### 6. Reiniciar Servidor

```bash
npm run dev
```

## ✅ Testar Funcionamento

### Teste Manual

Acesse qualquer página e abra o console do navegador:

```javascript
// Executar no console do navegador
throw new Error("Teste de erro do Sentry!");
```

Aguarde alguns segundos e verifique no dashboard do Sentry se o erro apareceu.

### Teste de Captura em CoinGecko

O componente `CustomCryptoScreener` já está configurado para reportar falhas da API CoinGecko automaticamente ao Sentry.

Simule uma falha:
1. Abra DevTools → Network
2. Bloqueie `coingecko.com`
3. Recarregue a página
4. Veja o erro sendo reportado no Sentry dashboard

## 🎯 O Que o Sentry Captura Automaticamente

### Client-Side (Navegador)
- ✅ Erros JavaScript não tratados
- ✅ Promise rejections
- ✅ Console errors
- ✅ Falhas de API
- ✅ Session Replay (vídeo da sessão do usuário quando ocorre erro)

### Server-Side (Next.js)
- ✅ Erros em API Routes
- ✅ Erros em Server Components
- ✅ Erros em Server Actions
- ✅ Crashes inesperados

## 📊 Dashboard do Sentry

No dashboard você verá:

- **Issues**: Lista de erros agrupados
- **Stack Trace**: Linha exata onde ocorreu o erro
- **Breadcrumbs**: Ações do usuário antes do erro
- **User Context**: Informações sobre quem teve o erro
- **Environment**: Produção, desenvolvimento, etc
- **Session Replay**: Vídeo da sessão (se ativado)

## 🔧 Configurações Avançadas

### Desativar em Desenvolvimento (Opcional)

Se quiser desativar Sentry em desenvolvimento local:

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production', // Adicionar esta linha
  // ... resto da config
});
```

### Capturar Erros Manualmente

Em qualquer componente ou função:

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // código que pode falhar
  await fetchData();
} catch (error) {
  // Reportar ao Sentry com contexto adicional
  Sentry.captureException(error, {
    tags: {
      section: 'crypto-screener',
      action: 'fetch-coingecko',
    },
    extra: {
      endpoint: 'markets',
      timestamp: new Date().toISOString(),
    },
  });

  // Tratar erro localmente também
  console.error(error);
}
```

### Capturar Mensagens Customizadas

```typescript
Sentry.captureMessage('CoinGecko API rate limit atingido', {
  level: 'warning',
  tags: { api: 'coingecko' },
});
```

## 📈 Planos do Sentry

### Free (Atual)
- ✅ 5.000 erros/mês
- ✅ 1 projeto
- ✅ 30 dias de retenção de dados
- ✅ Session Replay básico

### Quando Escalar?
Se ultrapassar 5k erros/mês:
- **Team**: $26/mês (50k erros)
- **Business**: $80/mês (500k erros)

Para projeto comunitário, o plano Free é mais que suficiente.

## 🚨 Problemas Comuns

### Erro: "Sentry DSN not configured"
- Verifique se `.env.local` existe
- Verifique se a variável começa com `NEXT_PUBLIC_`
- Reinicie o servidor `npm run dev`

### Source Maps não aparecem
- Configure `SENTRY_AUTH_TOKEN`
- Verifique permissões do token
- Execute build com `npm run build`

### Muitos eventos duplicados
- Ajuste `tracesSampleRate` para valor menor (ex: 0.1)
- Configure filtros no dashboard do Sentry

## 📚 Recursos

- [Documentação Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Dashboard Sentry](https://sentry.io/)
- [Status do Sentry](https://status.sentry.io/)

---

**Configurado por**: Claude Code
**Data**: 2025-10-23
**Versão**: 1.0
