# 📊 SISTEMA DE LOGGING E MONITORAMENTO

**Versão**: 2.0.0
**Data**: 2025-11-18

---

## 🎯 OBJETIVOS

Criar sistema de observabilidade completo para:

1. **Detectar erros** antes que afetem usuários
2. **Monitorar performance** em tempo real
3. **Auditar ações** para compliance
4. **Analisar comportamento** dos usuários
5. **Otimizar custos** de APIs externas

---

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                       │
│                                                           │
│  Next.js Pages → API Routes → Services                   │
│         ↓             ↓            ↓                      │
│      Logger       Logger       Logger                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   LOGGING LAYER                          │
│                                                           │
│  LoggerService (Winston/Pino)                            │
│  │                                                        │
│  ├─ Console Transport (development)                      │
│  ├─ File Transport (production)                          │
│  ├─ Sentry Transport (errors)                            │
│  └─ Custom Transport (database)                          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 AGGREGATION LAYER                        │
│                                                           │
│  Sentry (Error Tracking)                                 │
│  LogRocket (Session Replay - opcional)                   │
│  Vercel Analytics (Web Vitals)                           │
│  Custom Dashboard (Real-time Metrics)                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                 VISUALIZATION LAYER                      │
│                                                           │
│  Dashboard /dashboard/monitoring                         │
│  │                                                        │
│  ├─ Real-time Logs (WebSocket)                           │
│  ├─ Error Rate Graph                                     │
│  ├─ API Latency (p50, p95, p99)                          │
│  ├─ User Actions Heatmap                                 │
│  └─ AI API Usage & Costs                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 LOGGER SERVICE

### Implementação

```typescript
// lib/services/logger-service.ts

import pino from 'pino'
import * as Sentry from '@sentry/nextjs'

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

interface LogContext {
  userId?: string
  requestId?: string
  sessionId?: string
  articleId?: string
  batchId?: string
  ip?: string
  userAgent?: string
  [key: string]: any
}

interface LoggerOptions {
  level?: LogLevel
  prettyPrint?: boolean
  redact?: string[] // Campos sensíveis a ocultar
}

class LoggerService {
  private logger: pino.Logger
  private context: LogContext = {}

  constructor(options: LoggerOptions = {}) {
    const isDev = process.env.NODE_ENV === 'development'

    this.logger = pino({
      level: options.level || (isDev ? 'debug' : 'info'),

      // Formato de produção (JSON)
      ...(!isDev && {
        formatters: {
          level: (label) => ({ level: label }),
        },
      }),

      // Pretty print em desenvolvimento
      ...(isDev && options.prettyPrint && {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
          }
        }
      }),

      // Redact sensitive fields
      redact: options.redact || [
        'password',
        'token',
        'authorization',
        'apiKey',
        'secret'
      ]
    })
  }

  /**
   * Set persistent context for all logs
   */
  setContext(context: LogContext): void {
    this.context = { ...this.context, ...context }
  }

  /**
   * Clear context
   */
  clearContext(): void {
    this.context = {}
  }

  /**
   * Create child logger with additional context
   */
  child(context: LogContext): LoggerService {
    const child = new LoggerService()
    child.context = { ...this.context, ...context }
    child.logger = this.logger.child(child.context)
    return child
  }

  /**
   * DEBUG level
   */
  debug(message: string, meta?: object): void {
    this.logger.debug({ ...this.context, ...meta }, message)
  }

  /**
   * INFO level
   */
  info(message: string, meta?: object): void {
    this.logger.info({ ...this.context, ...meta }, message)
  }

  /**
   * WARN level
   */
  warn(message: string, meta?: object): void {
    this.logger.warn({ ...this.context, ...meta }, message)
  }

  /**
   * ERROR level (também envia para Sentry)
   */
  error(message: string, error?: Error, meta?: object): void {
    const logData = {
      ...this.context,
      ...meta,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      } : undefined
    }

    this.logger.error(logData, message)

    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production' && error) {
      Sentry.withScope((scope) => {
        // Add context
        Object.entries(this.context).forEach(([key, value]) => {
          scope.setTag(key, String(value))
        })

        // Add metadata
        if (meta) {
          scope.setContext('metadata', meta)
        }

        // Capture exception
        Sentry.captureException(error)
      })
    }
  }

  /**
   * FATAL level (critical errors)
   */
  fatal(message: string, error: Error, meta?: object): void {
    const logData = {
      ...this.context,
      ...meta,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      }
    }

    this.logger.fatal(logData, message)

    // Always send fatal errors to Sentry
    if (error) {
      Sentry.withScope((scope) => {
        scope.setLevel('fatal')
        Object.entries(this.context).forEach(([key, value]) => {
          scope.setTag(key, String(value))
        })
        if (meta) scope.setContext('metadata', meta)
        Sentry.captureException(error)
      })
    }
  }

  /**
   * Log API request
   */
  logRequest(req: Request, meta?: object): void {
    this.info('API Request', {
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers.get('user-agent'),
        'content-type': req.headers.get('content-type')
      },
      ...meta
    })
  }

  /**
   * Log API response
   */
  logResponse(status: number, duration: number, meta?: object): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info'

    this[level]('API Response', {
      status,
      duration,
      ...meta
    })
  }

  /**
   * Log user action
   */
  logAction(action: string, meta?: object): void {
    this.info('User Action', {
      action,
      ...meta
    })
  }

  /**
   * Log performance metric
   */
  logMetric(metric: string, value: number, unit: string, meta?: object): void {
    this.info('Performance Metric', {
      metric,
      value,
      unit,
      ...meta
    })
  }
}

// Singleton instance
export const logger = new LoggerService({
  prettyPrint: process.env.NODE_ENV === 'development'
})
```

---

## 🔧 INTEGRAÇÃO SENTRY

### Setup

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Environment
  environment: process.env.NODE_ENV,

  // Sample rate
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Error filtering
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null
    }

    // Filter out noise
    const error = hint.originalException
    if (error instanceof Error) {
      // Ignore expected errors
      if (error.message.includes('Network request failed')) {
        return null
      }
    }

    return event
  },

  // Add user context
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === 'console') {
      // Filter console logs
      return null
    }
    return breadcrumb
  },

  // Integrations
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true
    })
  ],

  // Performance monitoring
  profilesSampleRate: 0.1
})
```

### Uso em APIs

```typescript
// app/api/v2/articles/route.ts
import { logger } from '@/lib/services/logger-service'
import * as Sentry from '@sentry/nextjs'

export async function POST(req: Request) {
  const requestId = crypto.randomUUID()

  // Set request context
  logger.setContext({
    requestId,
    method: 'POST',
    path: '/api/v2/articles'
  })

  const startTime = Date.now()

  try {
    logger.logRequest(req)

    // ... lógica da API ...

    const duration = Date.now() - startTime
    logger.logResponse(200, duration)
    logger.logMetric('api_latency', duration, 'ms', { endpoint: '/articles' })

    return NextResponse.json({ success: true, data: article })

  } catch (error) {
    const duration = Date.now() - startTime

    logger.error('Failed to create article', error as Error, {
      body: await req.json().catch(() => ({}))
    })

    logger.logResponse(500, duration)

    // Sentry breadcrumbs
    Sentry.addBreadcrumb({
      category: 'api',
      message: 'Article creation failed',
      level: 'error',
      data: {
        requestId,
        duration
      }
    })

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    logger.clearContext()
  }
}
```

---

## 📊 MÉTRICAS DE PERFORMANCE

### Tracked Metrics

```typescript
interface Metrics {
  // API Latency
  api_latency: {
    endpoint: string
    method: string
    p50: number
    p95: number
    p99: number
  }

  // Error Rate
  error_rate: {
    endpoint: string
    count: number
    rate: number // errors/requests
  }

  // Database Query Time
  db_query_time: {
    query: string
    duration: number
  }

  // AI API Usage
  ai_api_usage: {
    provider: 'perplexity' | 'gemini'
    tokens: number
    cost: number
  }

  // Cache Hit Rate
  cache_hit_rate: {
    key: string
    hits: number
    misses: number
    rate: number
  }

  // User Actions
  user_action: {
    action: string
    userId: string
    count: number
  }
}
```

### Collection

```typescript
// lib/services/metrics-service.ts

class MetricsService {
  private metrics: Map<string, any[]> = new Map()

  track(metric: string, value: number, tags: Record<string, string> = {}): void {
    const entry = {
      metric,
      value,
      tags,
      timestamp: Date.now()
    }

    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, [])
    }

    this.metrics.get(metric)!.push(entry)

    // Log for analysis
    logger.logMetric(metric, value, 'ms', tags)
  }

  // Calculate percentiles
  getPercentile(metric: string, percentile: number): number {
    const values = this.metrics.get(metric)?.map(e => e.value) || []
    if (values.length === 0) return 0

    values.sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * values.length) - 1
    return values[index]
  }

  // Flush metrics periodically
  async flush(): Promise<void> {
    // Send to monitoring service (e.g., Datadog, Prometheus)
    // Or store in database for dashboard

    for (const [metric, entries] of this.metrics) {
      await prisma.metric.createMany({
        data: entries.map(e => ({
          name: metric,
          value: e.value,
          tags: JSON.stringify(e.tags),
          timestamp: new Date(e.timestamp)
        }))
      })
    }

    // Clear after flush
    this.metrics.clear()
  }
}

export const metrics = new MetricsService()

// Flush every 60 seconds
setInterval(() => metrics.flush(), 60000)
```

---

## 📈 DASHBOARD DE MONITORAMENTO

### Página `/dashboard/monitoring`

**Features**:

1. **Real-time Logs** (WebSocket)
   - Últimos 100 logs
   - Filtros por nível, usuário, endpoint
   - Busca por texto

2. **Error Rate Graph**
   - Taxa de erro por endpoint (últimas 24h)
   - Alertas quando > 5%

3. **API Latency Chart**
   - P50, P95, P99 por endpoint
   - Comparação com baseline

4. **AI API Usage**
   - Tokens usados (Perplexity, Gemini)
   - Custo estimado
   - Limite mensal

5. **User Activity Heatmap**
   - Ações mais comuns
   - Horários de pico

6. **Database Performance**
   - Queries mais lentas
   - Connection pool usage

### Implementação

```typescript
// app/dashboard/monitoring/page.tsx

'use client'

import { useEffect, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'

export default function MonitoringPage() {
  const [logs, setLogs] = useState([])
  const [metrics, setMetrics] = useState({})

  useEffect(() => {
    // WebSocket for real-time logs
    const ws = new WebSocket('ws://localhost:3000/api/logs/stream')

    ws.onmessage = (event) => {
      const log = JSON.parse(event.data)
      setLogs(prev => [log, ...prev].slice(0, 100))
    }

    return () => ws.close()
  }, [])

  useEffect(() => {
    // Fetch metrics every 10s
    const interval = setInterval(async () => {
      const res = await fetch('/api/monitoring/metrics')
      const data = await res.json()
      setMetrics(data)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Monitoramento em Tempo Real</h1>

      {/* Error Rate Chart */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Taxa de Erro (24h)</h2>
        <Line data={errorRateData} options={chartOptions} />
      </section>

      {/* API Latency */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Latência de APIs</h2>
        <Bar data={latencyData} options={chartOptions} />
      </section>

      {/* Real-time Logs */}
      <section>
        <h2 className="text-xl font-bold mb-4">Logs em Tempo Real</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="mb-1">
              <span className="text-gray-500">{log.timestamp}</span>
              <span className={`ml-2 ${getLevelColor(log.level)}`}>
                [{log.level.toUpperCase()}]
              </span>
              <span className="ml-2">{log.message}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

---

## 🚨 ALERTAS

### Configuração de Alertas

```typescript
// lib/services/alert-service.ts

interface Alert {
  id: string
  name: string
  condition: (metrics: Metrics) => boolean
  severity: 'info' | 'warning' | 'critical'
  channels: ('email' | 'slack' | 'telegram')[]
}

const alerts: Alert[] = [
  {
    id: 'high_error_rate',
    name: 'Alta Taxa de Erro',
    condition: (metrics) => metrics.error_rate > 0.05, // >5%
    severity: 'critical',
    channels: ['email', 'slack']
  },
  {
    id: 'slow_api',
    name: 'API Lenta',
    condition: (metrics) => metrics.api_latency_p95 > 2000, // >2s
    severity: 'warning',
    channels: ['slack']
  },
  {
    id: 'high_ai_cost',
    name: 'Custo AI Alto',
    condition: (metrics) => metrics.ai_cost_daily > 50, // >$50/dia
    severity: 'warning',
    channels: ['email']
  }
]

class AlertService {
  async check(metrics: Metrics): Promise<void> {
    for (const alert of alerts) {
      if (alert.condition(metrics)) {
        await this.trigger(alert, metrics)
      }
    }
  }

  private async trigger(alert: Alert, metrics: Metrics): Promise<void> {
    logger.warn(`Alert triggered: ${alert.name}`, { alertId: alert.id, metrics })

    // Send to Sentry
    Sentry.captureMessage(`Alert: ${alert.name}`, {
      level: alert.severity === 'critical' ? 'error' : 'warning',
      tags: { alertId: alert.id }
    })

    // Send to channels
    for (const channel of alert.channels) {
      switch (channel) {
        case 'email':
          await this.sendEmail(alert, metrics)
          break
        case 'slack':
          await this.sendSlack(alert, metrics)
          break
        case 'telegram':
          await this.sendTelegram(alert, metrics)
          break
      }
    }
  }

  private async sendSlack(alert: Alert, metrics: Metrics): Promise<void> {
    const webhook = process.env.SLACK_WEBHOOK_URL
    if (!webhook) return

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 *${alert.name}*`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Alert*: ${alert.name}\n*Severity*: ${alert.severity}\n*Metrics*: \`\`\`${JSON.stringify(metrics, null, 2)}\`\`\``
            }
          }
        ]
      })
    })
  }
}

export const alertService = new AlertService()
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Implementar LoggerService com Pino
- [ ] Configurar Sentry com filtros
- [ ] Criar MetricsService
- [ ] Implementar dashboard de monitoramento
- [ ] Configurar WebSocket para logs real-time
- [ ] Criar sistema de alertas
- [ ] Integrar Slack/Telegram webhooks
- [ ] Adicionar logs em todos os endpoints críticos
- [ ] Testar em staging
- [ ] Documentar para equipe

---

**Status**: 📝 AGUARDANDO APROVAÇÃO

**Última Atualização**: 2025-11-18 12:00 BRT
