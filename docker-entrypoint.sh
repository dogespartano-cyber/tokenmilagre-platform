#!/bin/bash

# docker-entrypoint.sh
# Script de inicialização para o container da API Flask
# Fornece funcionalidades de logging, health checks e flexibilidade de execução

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para logging com timestamp
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    case $level in
        "INFO")
            echo -e "${GREEN}[${timestamp}] INFO:${NC} $message"
            ;;
        "WARN")
            echo -e "${YELLOW}[${timestamp}] WARN:${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[${timestamp}] ERROR:${NC} $message"
            ;;
        "DEBUG")
            echo -e "${BLUE}[${timestamp}] DEBUG:${NC} $message"
            ;;
        *)
            echo "[$timestamp] $level: $message"
            ;;
    esac
}

# Função para verificar dependências
check_dependencies() {
    log "INFO" "Verificando dependências..."
    
    # Verificar se Python está disponível
    if ! command -v python &> /dev/null; then
        log "ERROR" "Python não encontrado!"
        exit 1
    fi
    
    # Verificar se api.py existe
    if [[ ! -f "api.py" ]]; then
        log "ERROR" "api.py não encontrado no diretório atual!"
        exit 1
    fi
    
    # Verificar se test_api.py existe (para modo de teste)
    if [[ "$1" == "test" ]] && [[ ! -f "test_api.py" ]]; then
        log "ERROR" "test_api.py não encontrado para execução de testes!"
        exit 1
    fi
    
    # Inicializar banco de dados se necessário
    if [[ ! -f "data/database.db" ]]; then
        log "INFO" "Banco de dados não encontrado, inicializando..."
        if [[ -f "init_db.py" ]]; then
            python init_db.py --populate
        else
            log "WARN" "init_db.py não encontrado, banco será criado na primeira execução"
        fi
    fi
    
    log "INFO" "Dependências verificadas com sucesso"
}

# Função para executar testes
run_tests() {
    log "INFO" "=== EXECUTANDO TESTES ==="
    
    # Verificar se pytest está disponível
    if ! python -c "import pytest" &> /dev/null; then
        log "WARN" "pytest não disponível, tentando execução direta..."
        python test_api.py
    else
        log "INFO" "Executando testes com pytest..."
        python -m pytest test_api.py -v --tb=short
    fi
    
    local exit_code=$?
    if [[ $exit_code -eq 0 ]]; then
        log "INFO" "=== TODOS OS TESTES PASSARAM ==="
    else
        log "ERROR" "=== TESTES FALHARAM ==="
        exit $exit_code
    fi
}

# Função para executar API
run_api() {
    log "INFO" "=== INICIANDO API FLASK ==="
    log "INFO" "Ambiente: ${FLASK_ENV:-development}"
    log "INFO" "Host: ${FLASK_RUN_HOST:-127.0.0.1}"
    log "INFO" "Porta: ${FLASK_RUN_PORT:-5000}"
    log "INFO" "Debug: ${FLASK_DEBUG:-0}"
    
    # Verificar configuração de produção
    if [[ "${FLASK_ENV}" == "production" ]]; then
        log "WARN" "Executando em modo PRODUÇÃO"
        log "INFO" "Para melhor performance, considere usar gunicorn ou uwsgi"
    fi
    
    # Executar aplicação
    log "INFO" "Executando aplicação Flask..."
    exec python api.py
}

# Função para mostrar ajuda
show_help() {
    echo -e "${BLUE}Docker Entrypoint - API Flask${NC}"
    echo
    echo "Uso: docker run <imagem> [COMANDO]"
    echo
    echo "Comandos disponíveis:"
    echo "  (padrão)    Executa a API Flask"
    echo "  test        Executa a suite de testes"
    echo "  bash        Abre shell bash no container"
    echo "  python      Abre shell Python interativo"
    echo "  help        Mostra esta ajuda"
    echo
    echo "Variáveis de ambiente:"
    echo "  FLASK_ENV         Ambiente (development/production)"
    echo "  FLASK_DEBUG       Debug mode (0/1)"
    echo "  FLASK_RUN_HOST    Host para bind (padrão: 0.0.0.0)"
    echo "  FLASK_RUN_PORT    Porta para bind (padrão: 5000)"
    echo
    echo "Exemplos:"
    echo "  docker run flask-api"
    echo "  docker run flask-api test"
    echo "  docker run -e FLASK_ENV=production flask-api"
}

# Função principal
main() {
    local command=${1:-"api"}
    
    log "INFO" "Container iniciado com comando: $command"
    
    case $command in
        "test")
            check_dependencies "test"
            run_tests
            ;;
        "api"|"")
            check_dependencies
            run_api
            ;;
        "bash")
            log "INFO" "Abrindo shell bash..."
            exec /bin/bash
            ;;
        "python")
            log "INFO" "Abrindo shell Python..."
            exec python
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            log "WARN" "Comando desconhecido: $command"
            log "INFO" "Tentando executar como comando personalizado..."
            exec "$@"
            ;;
    esac
}

# Trap para limpeza em caso de sinal
cleanup() {
    log "INFO" "Recebido sinal de parada, finalizando graciosamente..."
    exit 0
}

trap cleanup SIGTERM SIGINT

# Executar função principal
main "$@"