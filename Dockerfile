# Dockerfile para API Flask
# Multi-stage build para otimização de tamanho e segurança

# Estágio 1: Build e instalação de dependências
FROM python:3.13-slim as builder

# Definir variáveis de ambiente para otimização do Python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Criar usuário não-root para segurança
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Instalar dependências do sistema necessárias para build
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivo de dependências
COPY requirements.txt .

# Criar virtual environment e instalar dependências
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Estágio 2: Imagem final de produção
FROM python:3.13-slim as production

# Variáveis de ambiente para produção
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/opt/venv/bin:$PATH" \
    FLASK_APP=api.py \
    FLASK_ENV=production \
    FLASK_RUN_HOST=0.0.0.0 \
    FLASK_RUN_PORT=5000

# Criar usuário não-root
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copiar virtual environment do estágio de build
COPY --from=builder /opt/venv /opt/venv

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos da aplicação com ownership correto
COPY --chown=appuser:appuser api.py .
COPY --chown=appuser:appuser test_api.py .
COPY --chown=appuser:appuser init_db.py .

# Criar diretório para banco de dados
RUN mkdir -p /app/data && chown -R appuser:appuser /app/data

# Criar script de entrypoint
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Função para logging\n\
log() {\n\
    echo "[$(date "+%Y-%m-%d %H:%M:%S")] $1"\n\
}\n\
\n\
log "Iniciando API Flask..."\n\
log "Ambiente: $FLASK_ENV"\n\
log "Host: $FLASK_RUN_HOST"\n\
log "Porta: $FLASK_RUN_PORT"\n\
\n\
# Verificar se api.py existe\n\
if [[ ! -f "api.py" ]]; then\n\
    log "ERRO: api.py não encontrado!"\n\
    exit 1\n\
fi\n\
\n\
# Executar testes se solicitado\n\
if [[ "$1" == "test" ]]; then\n\
    log "Executando testes..."\n\
    python -m pytest test_api.py -v\n\
    exit $?\n\
fi\n\
\n\
# Executar aplicação\n\
log "Executando aplicação Flask..."\n\
exec python api.py' > /app/docker-entrypoint.sh

# Tornar script executável
RUN chmod +x /app/docker-entrypoint.sh

# Mudar para usuário não-root
USER appuser

# Expor porta da aplicação
EXPOSE 5000

# Definir health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/', timeout=2)" || exit 1

# Definir entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Labels para metadados
LABEL maintainer="Claude + Gemini Collaboration" \
      version="1.0" \
      description="API Flask com CRUD completo e validação" \
      python.version="3.13" \
      framework="Flask"