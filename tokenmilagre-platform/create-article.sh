#!/bin/bash

# ==============================================================================
# TokenMilagre - Script Automático de Criação de Artigos
# ==============================================================================
# Este script inicia todos os serviços necessários para criar artigos
# automaticamente com fact-checking.
# ==============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# Diretórios
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARTICLES_DIR="${ARTICLES_DIR:-$HOME/Trabalho/gemini/articles}"
PID_FILE="$PROJECT_DIR/.article-system.pid"

# ==============================================================================
# Funções auxiliares
# ==============================================================================

print_header() {
    echo -e "${CYAN}${BOLD}"
    echo "╔══════════════════════════════════════════════════════╗"
    echo "║                                                      ║"
    echo "║         📝 TokenMilagre Article System 📝           ║"
    echo "║                                                      ║"
    echo "╚══════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${RESET}"
}

log_success() {
    echo -e "${GREEN}✅ $1${RESET}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${RESET}"
}

log_error() {
    echo -e "${RED}❌ $1${RESET}"
}

# ==============================================================================
# Verificações
# ==============================================================================

check_dependencies() {
    log_info "Verificando dependências..."

    # Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js não encontrado!"
        exit 1
    fi
    log_success "Node.js: $(node --version)"

    # NPM
    if ! command -v npm &> /dev/null; then
        log_error "NPM não encontrado!"
        exit 1
    fi
    log_success "NPM: $(npm --version)"

    # Gemini CLI (opcional)
    if command -v gemini &> /dev/null; then
        log_success "Gemini CLI: instalado"
    else
        log_warn "Gemini CLI não encontrado (opcional para fact-checking)"
    fi

    # Verificar node_modules
    if [ ! -d "$PROJECT_DIR/node_modules" ]; then
        log_warn "Dependências não instaladas. Instalando..."
        cd "$PROJECT_DIR"
        npm install
        log_success "Dependências instaladas!"
    fi
}

check_env() {
    log_info "Verificando configuração..."

    if [ ! -f "$PROJECT_DIR/.env" ]; then
        log_warn "Arquivo .env não encontrado. Criando a partir do .env.example..."
        cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
        log_warn "⚠️  Configure as APIs de busca em .env para habilitar fact-checking!"
    fi

    # Verificar fact-checking
    if grep -q "ENABLE_FACT_CHECK=true" "$PROJECT_DIR/.env" 2>/dev/null; then
        if grep -q "GOOGLE_SEARCH_API_KEY=your-" "$PROJECT_DIR/.env" 2>/dev/null || \
           grep -q "BRAVE_SEARCH_API_KEY=your-" "$PROJECT_DIR/.env" 2>/dev/null; then
            log_warn "APIs de busca não configuradas. Fact-checking será desabilitado."
            log_info "   Configure em: $PROJECT_DIR/.env"
        else
            log_success "Fact-checking: HABILITADO"
        fi
    else
        log_info "Fact-checking: DESABILITADO"
    fi
}

create_directories() {
    log_info "Criando estrutura de pastas..."

    mkdir -p "$ARTICLES_DIR"
    mkdir -p "$ARTICLES_DIR/.processed"
    mkdir -p "$ARTICLES_DIR/.review"

    log_success "Pastas criadas em: $ARTICLES_DIR"
}

check_database() {
    log_info "Verificando banco de dados..."

    cd "$PROJECT_DIR"

    if [ ! -f "$PROJECT_DIR/prisma/dev.db" ]; then
        log_warn "Banco de dados não encontrado. Aplicando migrações..."
        npx prisma migrate deploy
        log_success "Banco de dados criado!"
    fi
}

# ==============================================================================
# Controle de processos
# ==============================================================================

is_running() {
    if [ -f "$PID_FILE" ]; then
        local server_pid=$(cat "$PID_FILE" | grep "SERVER_PID" | cut -d'=' -f2)
        local watcher_pid=$(cat "$PID_FILE" | grep "WATCHER_PID" | cut -d'=' -f2)

        if kill -0 "$server_pid" 2>/dev/null || kill -0 "$watcher_pid" 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

stop_services() {
    if [ ! -f "$PID_FILE" ]; then
        log_warn "Nenhum serviço em execução."
        return
    fi

    log_info "Parando serviços..."

    local server_pid=$(cat "$PID_FILE" | grep "SERVER_PID" | cut -d'=' -f2)
    local watcher_pid=$(cat "$PID_FILE" | grep "WATCHER_PID" | cut -d'=' -f2)

    # Parar servidor Next.js
    if kill -0 "$server_pid" 2>/dev/null; then
        kill "$server_pid" 2>/dev/null
        log_success "Servidor Next.js parado (PID: $server_pid)"
    fi

    # Parar watcher
    if kill -0 "$watcher_pid" 2>/dev/null; then
        kill "$watcher_pid" 2>/dev/null
        log_success "Watcher parado (PID: $watcher_pid)"
    fi

    rm -f "$PID_FILE"
    log_success "Todos os serviços foram parados!"
}

start_services() {
    if is_running; then
        log_warn "Serviços já estão em execução!"
        log_info "Use: $0 stop para parar"
        exit 0
    fi

    log_info "Iniciando serviços..."

    cd "$PROJECT_DIR"

    # Iniciar servidor Next.js
    log_info "Iniciando servidor Next.js..."
    npm run dev > /tmp/tokenmilagre-server.log 2>&1 &
    SERVER_PID=$!
    sleep 3

    if kill -0 "$SERVER_PID" 2>/dev/null; then
        log_success "Servidor Next.js iniciado (PID: $SERVER_PID)"
        log_info "   URL: http://localhost:3000"
    else
        log_error "Falha ao iniciar servidor Next.js"
        cat /tmp/tokenmilagre-server.log
        exit 1
    fi

    # Iniciar watcher
    log_info "Iniciando watcher..."
    npm run watch > /tmp/tokenmilagre-watcher.log 2>&1 &
    WATCHER_PID=$!
    sleep 2

    if kill -0 "$WATCHER_PID" 2>/dev/null; then
        log_success "Watcher iniciado (PID: $WATCHER_PID)"
        log_info "   Monitorando: $ARTICLES_DIR"
    else
        log_error "Falha ao iniciar watcher"
        cat /tmp/tokenmilagre-watcher.log
        kill "$SERVER_PID" 2>/dev/null
        exit 1
    fi

    # Salvar PIDs
    echo "SERVER_PID=$SERVER_PID" > "$PID_FILE"
    echo "WATCHER_PID=$WATCHER_PID" >> "$PID_FILE"

    echo ""
    log_success "✨ Sistema iniciado com sucesso!"
    echo ""
    log_info "📊 Status dos serviços:"
    echo -e "   ${GREEN}●${RESET} Servidor Next.js: http://localhost:3000"
    echo -e "   ${GREEN}●${RESET} Watcher: Monitorando $ARTICLES_DIR"
    echo ""
    log_info "📝 Para criar um artigo:"
    echo "   1. Crie arquivo .md em: $ARTICLES_DIR"
    echo "   2. Adicione metadados (veja _TEMPLATE.md)"
    echo "   3. Salve → Automático!"
    echo ""
    log_info "📋 Comandos úteis:"
    echo "   Ver logs do servidor:  tail -f /tmp/tokenmilagre-server.log"
    echo "   Ver logs do watcher:   tail -f /tmp/tokenmilagre-watcher.log"
    echo "   Parar tudo:            $0 stop"
    echo "   Ver status:            $0 status"
    echo ""
}

show_status() {
    if ! is_running; then
        log_warn "Sistema NÃO está rodando"
        log_info "Use: $0 start para iniciar"
        return
    fi

    local server_pid=$(cat "$PID_FILE" | grep "SERVER_PID" | cut -d'=' -f2)
    local watcher_pid=$(cat "$PID_FILE" | grep "WATCHER_PID" | cut -d'=' -f2)

    echo -e "${GREEN}${BOLD}Sistema em execução!${RESET}"
    echo ""
    echo -e "   ${GREEN}●${RESET} Servidor Next.js (PID: $server_pid)"
    echo "     URL: http://localhost:3000"
    echo ""
    echo -e "   ${GREEN}●${RESET} Watcher (PID: $watcher_pid)"
    echo "     Monitorando: $ARTICLES_DIR"
    echo ""

    # Verificar artigos
    local pending=$(ls "$ARTICLES_DIR"/*.md 2>/dev/null | grep -v "_TEMPLATE" | wc -l)
    local processed=$(ls "$ARTICLES_DIR/.processed"/*.md 2>/dev/null | wc -l)
    local review=$(ls "$ARTICLES_DIR/.review"/*.md 2>/dev/null | wc -l)

    echo "📊 Estatísticas:"
    echo "   Artigos pendentes:    $pending"
    echo "   Artigos processados:  $processed"
    echo "   Em revisão:           $review"
    echo ""
}

show_logs() {
    log_info "Logs em tempo real (Ctrl+C para sair)"
    echo ""

    if [ -f /tmp/tokenmilagre-watcher.log ]; then
        tail -f /tmp/tokenmilagre-watcher.log
    else
        log_error "Watcher não está rodando ou logs não encontrados"
    fi
}

# ==============================================================================
# Menu principal
# ==============================================================================

show_help() {
    print_header
    echo "Uso: $0 [comando]"
    echo ""
    echo "Comandos:"
    echo "  start      Inicia todos os serviços (servidor + watcher)"
    echo "  stop       Para todos os serviços"
    echo "  restart    Reinicia todos os serviços"
    echo "  status     Mostra status dos serviços"
    echo "  logs       Mostra logs do watcher em tempo real"
    echo "  setup      Configura sistema (primeira vez)"
    echo ""
    echo "Exemplos:"
    echo "  $0 start          # Inicia tudo"
    echo "  $0 logs           # Ver o que está acontecendo"
    echo "  $0 stop           # Parar tudo"
    echo ""
}

setup_system() {
    print_header
    log_info "Configurando sistema..."
    echo ""

    check_dependencies
    check_env
    create_directories
    check_database

    # Criar template se não existir
    if [ ! -f "$ARTICLES_DIR/_TEMPLATE.md" ]; then
        cat > "$ARTICLES_DIR/_TEMPLATE.md" <<'EOF'
---
title: "Título completo da notícia aqui"
summary: "Resumo em 1-2 linhas para aparecer no card"
category: bitcoin
tags: bitcoin, cripto, notícia
sentiment: positive
author: admin@tokenmilagre.xyz
---

# Título Principal

Conteúdo do artigo aqui em Markdown...

## Seção 1

Texto...

## Seção 2

Texto...

---

**Fontes:**
- Link 1
- Link 2
EOF
        log_success "Template criado: $ARTICLES_DIR/_TEMPLATE.md"
    fi

    echo ""
    log_success "✨ Setup completo!"
    echo ""
    log_info "Próximos passos:"
    echo "  1. Configure APIs em: $PROJECT_DIR/.env (opcional)"
    echo "  2. Inicie sistema: $0 start"
    echo "  3. Crie artigo: gemini '...' > $ARTICLES_DIR/artigo.md"
    echo ""
}

# ==============================================================================
# Script principal
# ==============================================================================

main() {
    case "${1:-}" in
        start)
            print_header
            check_dependencies
            check_env
            create_directories
            start_services
            ;;
        stop)
            print_header
            stop_services
            ;;
        restart)
            print_header
            stop_services
            sleep 2
            check_dependencies
            check_env
            start_services
            ;;
        status)
            print_header
            show_status
            ;;
        logs)
            show_logs
            ;;
        setup)
            setup_system
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            show_help
            exit 1
            ;;
    esac
}

# Trap para limpar em caso de interrupção
trap 'echo ""; log_warn "Interrompido. Use: $0 stop para parar os serviços."; exit 130' INT

main "$@"
