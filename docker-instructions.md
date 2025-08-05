# 🐳 Instruções Docker - API Flask com SQLAlchemy

## Arquivos Criados

✅ **Dockerfile** - Multi-stage build otimizado com SQLite  
✅ **docker-compose.yml** - Orquestração local com persistência  
✅ **.dockerignore** - Otimização de build  
✅ **docker-entrypoint.sh** - Script de inicialização com BD  
✅ **init_db.py** - Gerenciador de banco de dados  

## Comandos para Execução

### 🚀 Opção 1: Docker Build Direto
```bash
# Build da imagem
docker build -t flask-api .

# Executar API
docker run -p 5000:5000 flask-api

# Executar testes
docker run flask-api test

# Acesso shell
docker run -it flask-api bash
```

### 🚀 Opção 2: Docker Compose (Recomendado)
```bash
# Iniciar API
docker-compose up

# Iniciar em background
docker-compose up -d

# Executar testes
docker-compose run --rm test

# Parar serviços
docker-compose down
```

### 🚀 Opção 3: Produção com Nginx
```bash
# Iniciar com proxy reverso
docker-compose --profile production up
```

## Funcionalidades

### 🔧 Multi-stage Build
- **Estágio 1**: Build e dependências
- **Estágio 2**: Imagem final otimizada
- **Resultado**: Imagem menor e mais segura

### 🛡️ Segurança
- ✅ Usuário não-root
- ✅ Princípio do menor privilégio
- ✅ Health checks automáticos
- ✅ Logs estruturados

### ⚡ Performance
- ✅ Cache inteligente de layers
- ✅ .dockerignore otimizado
- ✅ Virtual environment isolado
- ✅ Variáveis de ambiente configuráveis

### 🧪 Desenvolvimento
- ✅ Hot reload com volumes
- ✅ Testes automatizados
- ✅ Multi-ambientes (dev/prod)
- ✅ Debug integrado

## Teste dos Endpoints

```bash
# API rodando em http://localhost:5000

# GET - Listar produto padrão
curl http://localhost:5000/api/data

# POST - Criar produto
curl -X POST http://localhost:5000/api/data \
  -H "Content-Type: application/json" \
  -d '{"id": 2, "name": "Produto Docker", "value": 199.99, "tags": ["docker", "api"]}'

# GET - Busca avançada com filtros
curl "http://localhost:5000/api/products/search?name=produto&min_value=100&max_value=500&page=1&per_page=5"

# GET - Busca por tags
curl "http://localhost:5000/api/products/search?tags=docker,api"

# PUT - Atualizar completo
curl -X PUT http://localhost:5000/api/data/2 \
  -H "Content-Type: application/json" \
  -d '{"id": 2, "name": "Produto Atualizado", "value": 299.99, "tags": ["atualizado"]}'

# PATCH - Atualizar parcial
curl -X PATCH http://localhost:5000/api/data/2 \
  -H "Content-Type: application/json" \
  -d '{"value": 399.99}'

# DELETE - Remover produto
curl -X DELETE http://localhost:5000/api/data/2
```

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `FLASK_ENV` | `production` | Ambiente (development/production) |
| `FLASK_DEBUG` | `0` | Debug mode (0/1) |
| `FLASK_RUN_HOST` | `0.0.0.0` | Host para bind |
| `FLASK_RUN_PORT` | `5000` | Porta para bind |
| `DATABASE_URL` | `sqlite:///database.db` | URL do banco SQLite |

## Logs e Monitoramento

```bash
# Ver logs em tempo real
docker-compose logs -f api

# Health check manual
docker exec flask-api-container python -c "import requests; print(requests.get('http://localhost:5000/').text)"

# Status dos containers
docker-compose ps
```

## Gerenciamento do Banco de Dados

```bash
# Inicializar BD com dados de exemplo
docker-compose exec api python init_db.py --populate

# Resetar BD completamente
docker-compose exec api python init_db.py --reset

# Ver estatísticas do BD
docker-compose exec api python init_db.py --stats

# Testar funcionalidades de busca
docker-compose exec api python init_db.py --test

# Backup do banco (do host)
docker cp flask-api-container:/app/data/database.db ./backup-$(date +%Y%m%d).db
```

## Novos Endpoints Avançados

### 🔍 **GET /api/products/search** - Busca Avançada
- **name**: Busca parcial no nome (case-insensitive)
- **min_value**: Valor mínimo do produto  
- **max_value**: Valor máximo do produto
- **tags**: Tags separadas por vírgula (produto deve ter todas)
- **page**: Número da página (padrão: 1)
- **per_page**: Itens por página (padrão: 10, máximo: 100)

**Exemplo de resposta:**
```json
{
  "pagination": {
    "page": 1,
    "per_page": 5,
    "total_pages": 3,
    "total_items": 14,
    "has_next": true,
    "has_prev": false
  },
  "products": [...],
  "filters_applied": {
    "name": "produto",
    "min_value": 50,
    "tags": ["api", "python"]
  },
  "status": "success"
}
```

## Persistência de Dados

✅ **Volume Docker**: `database-data` persiste o SQLite  
✅ **Backup automático**: Dados mantidos entre restarts  
✅ **Migração**: Schema versionado com Flask-Migrate  
✅ **Inicialização**: BD criado automaticamente no primeiro boot  

## Próximos Passos

1. **Instalar Docker** no sistema
2. **Executar** os comandos acima
3. **Popular BD** com dados de exemplo
4. **Testar** busca avançada e filtros
5. **Deploy** em cloud provider (AWS, GCP, Azure)

## Troubleshooting

```bash
# Rebuild sem cache
docker-compose build --no-cache

# Logs detalhados
docker-compose logs --tail=100 api

# Entrar no container
docker-compose exec api bash

# Limpar containers e imagens
docker-compose down --rmi all -v
```