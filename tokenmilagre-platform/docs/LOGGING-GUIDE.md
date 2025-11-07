# Guia de Logging

## Sistema de Logging Estruturado

Implementamos um sistema de logging estruturado em `lib/logger.ts` para substituir `console.log` direto.

## Como Usar

### Importar o logger

```typescript
import { logger } from '@/lib/logger';
```

### Níveis de Log

```typescript
// Debug (apenas em desenvolvimento)
logger.debug('Debug info', { userId: '123' });

// Info (informação geral)
logger.info('User logged in', { email: 'user@example.com' });

// Warning (avisos)
logger.warn('Deprecated API used', { endpoint: '/old-api' });

// Error (erros sempre logados)
logger.error('Failed to process', error, { context: 'payment' });
```

### Logs Específicos

```typescript
// API requests
logger.api('POST', '/api/articles', 200, 150); // method, path, status, duration

// Performance
logger.perf('Database query', 250, { table: 'articles' });
```

### Helper de Timing

```typescript
import { withTiming } from '@/lib/logger';

const result = await withTiming(
  'Fetch articles',
  async () => {
    return await prisma.article.findMany();
  },
  { limit: 10 }
);
```

## Migração de console.log

### Antes

```typescript
console.log('[API] Fetching articles');
console.error('Error:', error);
```

### Depois

```typescript
logger.info('Fetching articles', { endpoint: '/api/articles' });
logger.error('Failed to fetch articles', error);
```

## Benefícios

- ✅ **Logs estruturados** com contexto JSON
- ✅ **Timestamp automático** em todos os logs
- ✅ **Controle por ambiente** (dev/prod/test)
- ✅ **Integração com Sentry** em produção
- ✅ **Melhor debugging** com contexto adicional
- ✅ **Performance tracking** integrado

## Próximos Passos

Migrar gradualmente todos os `console.log` para `logger`:

1. APIs críticas (copilot, admin)
2. Lib functions
3. Hooks e utilitários
4. Componentes (se necessário)

**Scripts de desenvolvimento** (em `scripts/`) podem continuar usando `console.log`.
