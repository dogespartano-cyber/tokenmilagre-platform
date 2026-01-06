# Graphiti Backup Procedures

> **Última atualização:** 2026-01-06  
> **Responsável:** DEVOPS / ARQUITETO

---

## Visão Geral

Graphiti é o sistema de memória persistente do ecossistema de agents, rodando em:
- **Graphiti API:** `localhost:8000`
- **FalkorDB Backend:** `localhost:6379`

---

## Backup Manual

### 1. Backup FalkorDB (Redis-compatible)

```bash
# Conectar ao container e criar dump
podman exec -it falkordb redis-cli

# Dentro do redis-cli:
BGSAVE
# Aguarde: "Background saving started"

# Copiar o dump para fora do container
podman cp falkordb:/data/dump.rdb ./backups/graphiti-$(date +%Y%m%d).rdb
```

### 2. Backup via API (Episódios)

```bash
# Exportar todos os episódios (se API suportar)
curl -X GET http://localhost:8000/export > ./backups/graphiti-episodes-$(date +%Y%m%d).json
```

---

## Restore

### 1. Restore FalkorDB

```bash
# Parar container
podman stop falkordb

# Copiar backup para container
podman cp ./backups/graphiti-YYYYMMDD.rdb falkordb:/data/dump.rdb

# Reiniciar
podman start falkordb
```

### 2. Verificar Integridade

```bash
# Testar health
curl http://localhost:8000/health

# Deve retornar: {"status": "healthy"}
```

---

## Automação (Cron)

Adicionar ao crontab do servidor:

```bash
# Backup diário às 3h AM
0 3 * * * podman exec falkordb redis-cli BGSAVE && podman cp falkordb:/data/dump.rdb /backup/graphiti-$(date +\%Y\%m\%d).rdb

# Limpeza de backups > 30 dias
0 4 * * 0 find /backup -name "graphiti-*.rdb" -mtime +30 -delete
```

---

## Monitoramento

### Health Check Script

```bash
#!/bin/bash
# scripts/ops/check-graphiti.sh

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health)

if [ "$RESPONSE" != "200" ]; then
    echo "ALERT: Graphiti is DOWN (HTTP $RESPONSE)"
    # Notificar via webhook/email
    exit 1
fi

echo "OK: Graphiti is healthy"
exit 0
```

---

## Disaster Recovery

| Cenário | RTO | Ação |
|---------|-----|------|
| Graphiti crash | 5min | Restart container |
| Data corruption | 15min | Restore último backup |
| Container lost | 30min | Rebuild + restore |
| Host failure | 2h | Migrate to new host |

---

## Contatos

- **Emergência:** DEVOPS + ARQUITETO
- **Escalação:** Via ROUTER

```yaml
@metadata:
  type: runbook
  category: ops
  tags: [graphiti, backup, disaster-recovery]
```
