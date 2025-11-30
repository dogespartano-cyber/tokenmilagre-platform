#!/bin/bash

# ==============================================================================
#            🚀 SERVER MANAGER - Gerenciador do Servidor Next.js 🚀
# ==============================================================================
#
# Script interativo para gerenciar o servidor de desenvolvimento
# Token Milagre Platform
#
# ==============================================================================

set -euo pipefail

# --- Configuração Global ---
PROJECT_DIR='/home/destakar/Trabalho/$Milagre/tokenmilagre-platform/tokenmilagre-platform'
PORT=3000
LOG_FILE="/tmp/tokenmilagre-server.log"

# Cores para output (Matrix Style)
RED='\033[0;31m'
GREEN='\033[0;32m'
DARK_GREEN='\033[2;32m'
BRIGHT_GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BRIGHT_MAGENTA='\033[1;35m'
GRAY='\033[0;90m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# --- Funções de Utilidade ---

print_header() {
    clear
    echo -e "${BRIGHT_GREEN}"
    echo "    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ "
    echo "    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗"
    echo "    ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝"
    echo "    ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗"
    echo "    ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║"
    echo "    ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝"
    echo -e "${NC}"
    echo -e "${DARK_GREEN}    ┌─────────────────────────────────────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC} ${GREEN}GERENCIADOR v2.0${NC} ${GRAY}|${NC} ${GREEN}Porta: $PORT${NC} ${GRAY}|${NC} ${GREEN}tokenmilagre-platform${NC} ${DARK_GREEN}│${NC}"
    echo -e "${DARK_GREEN}    └─────────────────────────────────────────────────────┘${NC}"
    echo ""
}

print_success() {
    echo -e "${BRIGHT_GREEN}[+]${NC} ${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}[-]${NC} ${RED}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} ${YELLOW}$1${NC}"
}

print_info() {
    echo -e "${DARK_GREEN}[>]${NC} ${GREEN}$1${NC}"
}

press_enter() {
    echo ""
    read -p "Pressione ENTER para continuar..."
}

# --- Funções de Gerenciamento do Servidor ---

sync_preview() {
    local quiet_mode=${1:-0}

    if [ "$quiet_mode" -eq 0 ]; then
        print_header
        echo -e "${DARK_GREEN}    ┌─[ ${YELLOW}SINCRONIZAR PREVIEW${DARK_GREEN} ]────────────────────────────────────┐${NC}"
        echo -e "${DARK_GREEN}    │${NC}"
    fi

    print_info "Entrando no diretório do projeto..."
    cd "$PROJECT_DIR" || exit 1

    print_info "Buscando branches preview do remoto..."
    git fetch origin --prune 2>/dev/null

    # Encontrar branch preview mais recente (claude/*) por data do commit
    local latest_preview=$(git for-each-ref --sort=-committerdate refs/remotes/origin/claude/ --format='%(refname:short)' | head -1 | sed 's/origin\///')

    if [ -z "$latest_preview" ]; then
        print_error "Nenhuma branch preview (claude/*) encontrada"
        if [ "${INTERACTIVE_MODE:-1}" = "1" ] && [ "$quiet_mode" -eq 0 ]; then
            press_enter
        fi
        return 1
    fi

    print_success "Branch preview mais recente: ${CYAN}$latest_preview${NC}"

    # Verificar se já está nessa branch
    local current_branch=$(git branch --show-current)
    if [ "$current_branch" = "$latest_preview" ]; then
        print_info "Já está na branch preview, atualizando..."
        git pull origin "$latest_preview" 2>/dev/null
    else
        print_info "Fazendo checkout para $latest_preview..."

        # Tentar checkout (se já existe local) ou criar nova tracking branch
        if git show-ref --verify --quiet "refs/heads/$latest_preview"; then
            git checkout "$latest_preview" 2>/dev/null
            git pull origin "$latest_preview" 2>/dev/null
        else
            git checkout -b "$latest_preview" "origin/$latest_preview" 2>/dev/null
        fi
    fi

    # Verificar se checkout foi bem-sucedido
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$latest_preview" ]; then
        print_error "Falha ao fazer checkout para $latest_preview"
        if [ "${INTERACTIVE_MODE:-1}" = "1" ] && [ "$quiet_mode" -eq 0 ]; then
            press_enter
        fi
        return 1
    fi

    print_info "Verificando mudanças em dependências..."

    # Sempre instalar dependências ao sincronizar preview (garantir atualização)
    print_warning "Instalando/atualizando dependências..."
    npm install --silent 2>&1 | grep -v "npm warn" || true

    echo ""
    print_success "✅ Preview sincronizado com sucesso!"
    print_info "Branch atual: ${CYAN}$current_branch${NC}"

    if [ "${INTERACTIVE_MODE:-1}" = "1" ] && [ "$quiet_mode" -eq 0 ]; then
        press_enter
    fi

    return 0
}

promote_to_production() {
    print_header
    echo -e "${DARK_GREEN}    ┌─[ ${BRIGHT_GREEN}PROMOVER PARA PRODUÇÃO${DARK_GREEN} ]───────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"

    print_info "Entrando no diretório do projeto..."
    cd "$PROJECT_DIR" || exit 1

    print_info "Buscando atualizações do remoto..."
    git fetch origin --prune 2>/dev/null

    # Encontrar branch preview mais recente
    local latest_preview=$(git for-each-ref --sort=-committerdate refs/remotes/origin/claude/ --format='%(refname:short)' | head -1 | sed 's/origin\///')

    if [ -z "$latest_preview" ]; then
        print_error "Nenhuma branch preview (claude/*) encontrada"
        if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
            press_enter
        fi
        return 1
    fi

    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    print_success "Branch preview mais recente: ${CYAN}$latest_preview${NC}"
    echo ""

    # Mostrar informações do último commit da preview
    print_info "Último commit da preview:"
    git log origin/$latest_preview -1 --pretty=format:"  %C(yellow)%h%C(reset) - %C(cyan)%ar%C(reset) - %s" 2>/dev/null
    echo ""
    echo ""

    # Mostrar diff entre main e preview
    print_info "Mudanças que serão promovidas para produção:"
    local commit_count=$(git rev-list origin/main..origin/$latest_preview --count 2>/dev/null)
    echo -e "  ${GREEN}$commit_count commits${NC} serão mesclados"
    echo ""

    # Mostrar os commits
    git log origin/main..origin/$latest_preview --oneline --pretty=format:"  %C(yellow)●%C(reset) %s %C(cyan)(%ar)%C(reset)" 2>/dev/null | head -10
    echo ""

    if [ "$commit_count" -gt 10 ]; then
        echo -e "  ${YELLOW}... e mais $(($commit_count - 10)) commits${NC}"
        echo ""
    fi

    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # Confirmação
    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        read -p "Deseja promover esta preview para produção (main)? [s/N]: " confirm
        if [[ ! "$confirm" =~ ^[Ss]$ ]]; then
            print_info "Operação cancelada"
            press_enter
            return 0
        fi
    fi

    echo ""
    print_info "Fazendo checkout para main..."
    git checkout main 2>/dev/null

    print_info "Atualizando main..."
    git pull origin main 2>/dev/null

    print_info "Mesclando preview em main..."
    if git merge --no-ff "origin/$latest_preview" -m "chore: Promover preview $latest_preview para produção" 2>/dev/null; then
        print_success "✅ Merge realizado com sucesso!"
    else
        print_error "Falha ao fazer merge. Resolvendo conflitos pode ser necessário."
        print_info "Execute manualmente: git merge origin/$latest_preview"
        if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
            press_enter
        fi
        return 1
    fi

    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    print_success "Preview promovida para main com sucesso!"
    print_info "Branch atual: ${CYAN}main${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # Perguntar se quer fazer push
    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        read -p "Deseja fazer push para produção (origin/main)? [s/N]: " push_confirm
        if [[ "$push_confirm" =~ ^[Ss]$ ]]; then
            echo ""
            print_info "Fazendo push para origin/main..."
            if git push origin main 2>&1; then
                print_success "✅ Push realizado com sucesso!"
                echo ""
                print_success "🎉 Deploy para produção iniciado!"
                print_info "Acompanhe em: https://vercel.com"
            else
                print_error "Falha ao fazer push"
            fi
        else
            echo ""
            print_warning "Push não realizado. Para fazer push depois:"
            print_info "git push origin main"
        fi
    fi

    echo ""

    # Perguntar se quer limpar branch preview local
    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        read -p "Deseja deletar a branch preview local ($latest_preview)? [s/N]: " cleanup_confirm
        if [[ "$cleanup_confirm" =~ ^[Ss]$ ]]; then
            echo ""
            print_info "Deletando branch local $latest_preview..."
            git branch -D "$latest_preview" 2>/dev/null || true
            print_success "Branch local deletada"
        fi
    fi

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        press_enter
    fi
}

check_status() {
    local PID=$(lsof -ti :$PORT 2>/dev/null)
    if [ -z "$PID" ]; then
        return 1  # Offline
    else
        return 0  # Online
    fi
}

get_server_pid() {
    # Usar netstat/ss mais confiável que lsof
    local pid=$(ss -tulpn 2>/dev/null | grep :$PORT | grep -oP 'pid=\K[0-9]+' | head -1)
    if [ -z "$pid" ]; then
        pid=$(netstat -tulpn 2>/dev/null | grep :$PORT | awk '{print $7}' | cut -d'/' -f1 | head -1)
    fi
    echo "$pid"
}

check_server_health() {
    local PID=$1
    if [ -z "$PID" ]; then
        return 1
    fi

    # Verificar se processo está em loop (CPU > 70%)
    local cpu=$(ps aux | grep "^[^ ]* *$PID " | awk '{print $3}' | cut -d'.' -f1)
    if [ ! -z "$cpu" ] && [ "$cpu" -gt 70 ]; then
        return 2  # Loop detectado
    fi

    return 0  # Saudável
}

show_status() {
    print_header
    echo -e "${DARK_GREEN}    ┌─[ ${BRIGHT_GREEN}STATUS DO SERVIDOR${DARK_GREEN} ]────────────────────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"

    local PID=$(get_server_pid)

    echo -ne "${DARK_GREEN}    │${NC}  Next.js Server: "
    if [ ! -z "$PID" ]; then
        check_server_health "$PID"
        local health=$?

        if [ $health -eq 2 ]; then
            echo -e "${RED}[LOOP DETECTED]${NC} ${GRAY}PID: $PID${NC}"
            local cpu=$(ps aux | grep "^[^ ]* *$PID " | awk '{print $3}')
            local mem=$(ps aux | grep "^[^ ]* *$PID " | awk '{print $4}')
            echo -e "${DARK_GREEN}    │${NC}    ${RED}[-]${NC} CPU: ${RED}${cpu}%${NC} | MEM: ${mem}%"
            echo -e "${DARK_GREEN}    │${NC}    ${RED}[-]${NC} Server stuck in infinite loop"
            echo -e "${DARK_GREEN}    │${NC}    ${YELLOW}[!]${NC} Use option 5 (Kill Server) to fix"
        else
            echo -e "${BRIGHT_GREEN}[RUNNING]${NC} ${GRAY}PID: $PID${NC}"
            local cpu=$(ps aux | grep "^[^ ]* *$PID " | awk '{print $3}')
            local mem=$(ps aux | grep "^[^ ]* *$PID " | awk '{print $4}')
            echo -e "${DARK_GREEN}    │${NC}    ${GREEN}[+]${NC} CPU: ${cpu}% | MEM: ${mem}%"
            echo -e "${DARK_GREEN}    │${NC}    ${GREEN}[+]${NC} Port: $PORT"
            echo -e "${DARK_GREEN}    │${NC}    ${GREEN}[+]${NC} URL: ${CYAN}http://localhost:$PORT${NC}"
            echo -e "${DARK_GREEN}    │${NC}    ${GREEN}[+]${NC} Directory: ${GRAY}$PROJECT_DIR${NC}"
        fi
    else
        echo -e "${RED}[OFFLINE]${NC}"
        echo -e "${DARK_GREEN}    │${NC}    ${YELLOW}[!]${NC} No process on port $PORT"
    fi

    echo -e "${DARK_GREEN}    │${NC}"

    # Verificar processos zombie
    local zombie_count=$(ps aux | grep -E "\[node.*\].*defunct" | grep -v grep | wc -l)
    if [ "$zombie_count" -gt 0 ]; then
        echo -e "${DARK_GREEN}    │${NC}  ${YELLOW}[!]${NC} ${zombie_count} processos zumbis do Node.js detectados"
        echo -e "${DARK_GREEN}    │${NC}  ${DARK_GREEN}[>]${NC} Use a opção 7 (Limpar Processos) para remover"
        echo -e "${DARK_GREEN}    │${NC}"
    fi

    echo -e "${DARK_GREEN}    └──────────────────────────────────────────────────────┘${NC}"

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        press_enter
    fi
}

start_server() {
    local mode=${1:-normal}  # normal ou preview

    print_header
    if [ "$mode" = "preview" ]; then
        echo -e "${DARK_GREEN}    ┌─[ ${YELLOW}INICIAR SERVIDOR${DARK_GREEN} ]${YELLOW} [MODO PREVIEW]${DARK_GREEN} ───────────────────┐${NC}"
    else
        echo -e "${DARK_GREEN}    ┌─[ ${BRIGHT_GREEN}INICIAR SERVIDOR${DARK_GREEN} ]───────────────────────────────────┐${NC}"
    fi
    echo -e "${DARK_GREEN}    │${NC}"

    local PID=$(get_server_pid)
    if [ ! -z "$PID" ]; then
        print_warning "Servidor já está rodando (PID: $PID)"
        print_info "URL: ${CYAN}http://localhost:$PORT${NC}"
        if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
            press_enter
        fi
        return 1
    fi

    # Se modo preview, sincronizar primeiro
    if [ "$mode" = "preview" ]; then
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        sync_preview 1  # quiet mode
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
    fi

    print_info "Entrando no diretório do projeto..."
    cd "$PROJECT_DIR" || exit 1

    # Mostrar branch atual
    local current_branch=$(git branch --show-current)
    print_info "Branch atual: ${CYAN}$current_branch${NC}"

    print_info "Executando: npm run dev"
    print_info "Logs salvos em: $LOG_FILE"

    # Limpar log anterior e iniciar novo
    > "$LOG_FILE"
    npm run dev >> "$LOG_FILE" 2>&1 &

    print_info "Aguardando inicialização..."
    sleep 3

    PID=$(get_server_pid)
    if [ ! -z "$PID" ]; then
        echo ""
        print_success "Servidor iniciado com sucesso!"
        print_info "PID: $PID"
        print_info "Porta: $PORT"
        print_info "Branch: ${CYAN}$current_branch${NC}"
        print_info "URL: ${CYAN}http://localhost:$PORT${NC}"
    else
        echo ""
        print_error "Falha ao iniciar servidor"
        print_warning "Verifique se há erros no projeto:"
        print_info "1. cd $PROJECT_DIR"
        print_info "2. npm run dev"
    fi

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        press_enter
    fi
}

stop_server() {
    print_header
    echo -e "${DARK_GREEN}    ┌─[ ${RED}PARAR SERVIDOR${DARK_GREEN} ]────────────────────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"

    local PID=$(get_server_pid)
    if [ -z "$PID" ]; then
        print_warning "Servidor já está offline"
        if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
            press_enter
        fi
        return 1
    fi

    print_info "Parando processo (PID: $PID)..."
    kill $PID 2>/dev/null || true
    sleep 2

    PID=$(get_server_pid)
    if [ -z "$PID" ]; then
        print_success "Servidor parado com sucesso"
    else
        print_warning "Processo ainda rodando. Use 'Kill Server' para forçar."
    fi

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        press_enter
    fi
}

kill_server() {
    print_header
    echo -e "${DARK_GREEN}    ┌─[ ${RED}MATAR SERVIDOR${DARK_GREEN} ]${RED} [FORÇAR TÉRMINO]${DARK_GREEN} ─────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"

    local PID=$(get_server_pid)
    if [ -z "$PID" ]; then
        print_warning "Nenhum processo na porta $PORT"
        if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
            press_enter
        fi
        return 1
    fi

    print_warning "Esta ação irá forçar o encerramento do processo!"

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        read -p "Deseja continuar? [s/N]: " confirm
        if [[ ! "$confirm" =~ ^[Ss]$ ]]; then
            print_info "Operação cancelada"
            press_enter
            return 0
        fi
    fi

    echo ""
    print_info "Executando kill -9 $PID..."
    kill -9 $PID 2>/dev/null || true
    sleep 1

    PID=$(get_server_pid)
    if [ -z "$PID" ]; then
        print_success "Processos eliminados com sucesso"
    else
        print_error "Falha ao eliminar processos"
        print_info "Tente manualmente: kill -9 $PID"
    fi

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        press_enter
    fi
}

restart_server() {
    print_header
    echo -e "${DARK_GREEN}    ┌─[ ${CYAN}REINICIAR SERVIDOR${DARK_GREEN} ]──────────────────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"

    local PID=$(get_server_pid)
    if [ ! -z "$PID" ]; then
        print_info "Parando servidor atual..."
        kill $PID 2>/dev/null || true
        sleep 2
    fi

    # Verificar se parou
    PID=$(get_server_pid)
    if [ ! -z "$PID" ]; then
        print_warning "Processo ainda rodando, forçando..."
        kill -9 $PID 2>/dev/null || true
        sleep 1
    fi

    print_success "Servidor parado"
    echo ""
    print_info "Iniciando servidor..."
    print_info "Logs salvos em: $LOG_FILE"

    cd "$PROJECT_DIR" || exit 1

    # Limpar log anterior e iniciar novo
    > "$LOG_FILE"
    npm run dev >> "$LOG_FILE" 2>&1 &

    print_info "Aguardando inicialização..."
    sleep 3

    PID=$(get_server_pid)
    if [ ! -z "$PID" ]; then
        echo ""
        print_success "Servidor reiniciado com sucesso!"
        print_info "PID: $PID"
        echo -e "${GREEN}🌐 http://localhost:$PORT${NC}"
    else
        echo ""
        print_error "Falha ao reiniciar servidor"
    fi

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        press_enter
    fi
}

view_logs() {
    print_header
    echo -e "${DARK_GREEN}    ┌─[ ${CYAN}LOGS DO SERVIDOR${DARK_GREEN} ]${CYAN} [TEMPO REAL]${DARK_GREEN} ──────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"

    local PID=$(get_server_pid)
    if [ -z "$PID" ]; then
        print_error "Servidor não está rodando"
        press_enter
        return 1
    fi

    if [ ! -f "$LOG_FILE" ]; then
        print_error "Arquivo de log não encontrado: $LOG_FILE"
        print_info "Reinicie o servidor para criar o arquivo de log"
        press_enter
        return 1
    fi

    print_info "PID do servidor: $PID"
    print_info "Arquivo de log: $LOG_FILE"
    echo ""
    print_warning "📜 Logs em tempo real (Ctrl+C para sair)"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    sleep 1

    # Mostrar logs em tempo real com tail -f
    tail -f "$LOG_FILE"
}



clean_processes() {
    print_header
    echo -e "${DARK_GREEN}    ┌─[ ${MAGENTA}LIMPAR PROCESSOS${DARK_GREEN} ]─────────────────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"

    print_info "Buscando processos Node.js relacionados ao projeto..."
    echo ""

    # Buscar processos vivos
    local node_pids=$(pgrep -f "next-server\|node.*tokenmilagre" 2>/dev/null || echo "")

    # Contar zombies
    local zombie_count=$(ps aux | grep -E "\[node.*\].*defunct" | grep -v grep | wc -l)

    if [ -z "$node_pids" ] && [ "$zombie_count" -eq 0 ]; then
        print_success "Nenhum processo residual encontrado"
        press_enter
        return 0
    fi

    if [ ! -z "$node_pids" ]; then
        echo -e "${CYAN}Processos ativos encontrados:${NC}"
        ps aux | grep -E "next-server|node.*tokenmilagre" | grep -v grep | grep -v defunct
        echo ""
    fi

    if [ "$zombie_count" -gt 0 ]; then
        print_warning "$zombie_count processos zombie detectados"
        echo -e "${CYAN}Processos zombie (não podem ser mortos diretamente):${NC}"
        ps aux | grep -E "\[node.*\].*defunct" | grep -v grep
        echo ""
    fi

    if [ "${INTERACTIVE_MODE:-1}" = "1" ]; then
        read -p "Deseja matar todos os processos ativos? [s/N]: " confirm
        if [[ ! "$confirm" =~ ^[Ss]$ ]]; then
            print_info "Operação cancelada"
            press_enter
            return 0
        fi
    fi

    echo ""

    # Matar processos ativos
    if [ ! -z "$node_pids" ]; then
        print_info "Matando processos ativos..."
        pkill -9 -f "next-server" 2>/dev/null || true
        pkill -9 -f "node.*tokenmilagre" 2>/dev/null || true
        sleep 1
    fi

    # Verificar se limpou
    node_pids=$(pgrep -f "next-server\|node.*tokenmilagre" 2>/dev/null || echo "")
    if [ -z "$node_pids" ]; then
        print_success "Processos ativos eliminados"
    else
        print_warning "Alguns processos ainda estão rodando"
    fi

    # Zombies desaparecem sozinhos eventualmente
    if [ "$zombie_count" -gt 0 ]; then
        echo ""
        print_info "Processos zombie serão limpos automaticamente pelo sistema"
    fi

    press_enter
}

# --- Menu Principal ---

show_main_menu() {
    print_header

    # Mostrar status breve
    local PID=$(get_server_pid)
    local status_icon="${RED}[OFFLINE]${NC}"
    local status_text="${RED}Servidor parado${NC}"

    if [ ! -z "$PID" ]; then
        status_icon="${BRIGHT_GREEN}[ONLINE]${NC}"
        status_text="${GREEN}PID: $PID | Porta: $PORT${NC}"
    fi

    echo -e "    ${GRAY}┌─[ ${WHITE}Status do Sistema${GRAY} ]──────────────────────────────────────┐${NC}"
    echo -e "    ${GRAY}│${NC} Servidor Next.js: $status_icon $status_text"
    echo -e "    ${GRAY}└──────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "${DARK_GREEN}    ┌─[ ${BRIGHT_GREEN}MENU PRINCIPAL${DARK_GREEN} ]───────────────────────────────────────────┐${NC}"
    echo -e "${DARK_GREEN}    │${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${GREEN}[${WHITE}1${GREEN}]${NC}  Iniciar Servidor           ${GRAY}Iniciar servidor de desenvolvimento${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${GREEN}[${WHITE}2${GREEN}]${NC}  Parar Servidor             ${GRAY}Encerramento gracioso${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${GREEN}[${WHITE}3${GREEN}]${NC}  Reiniciar Servidor         ${GRAY}Parar e iniciar servidor${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${GREEN}[${WHITE}4${GREEN}]${NC}  Ver Status                 ${GRAY}Mostrar status detalhado${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${RED}[${WHITE}5${RED}]${NC}  Matar Servidor             ${GRAY}Forçar encerramento${NC}"
    echo -e "${DARK_GREEN}    │${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${CYAN}[${WHITE}6${CYAN}]${NC}  Ver Logs                   ${GRAY}Logs do servidor em tempo real${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${MAGENTA}[${WHITE}7${MAGENTA}]${NC}  Limpar Processos Node      ${GRAY}Remover processos zumbis${NC}"
    echo -e "${DARK_GREEN}    │${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${YELLOW}[${WHITE}8${YELLOW}]${NC}  Sincronizar & Preview      ${GRAY}Última branch de preview${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${BRIGHT_GREEN}[${WHITE}9${BRIGHT_GREEN}]${NC}  Promover Preview p/ Prod   ${GRAY}Deploy para produção${NC}"
    echo -e "${DARK_GREEN}    │${NC}"
    echo -e "${DARK_GREEN}    │${NC}  ${GRAY}[${WHITE}0${GRAY}]${NC}  Sair                       ${GRAY}Fechar gerenciador${NC}"
    echo -e "${DARK_GREEN}    │${NC}"
    echo -e "${DARK_GREEN}    └──────────────────────────────────────────────────────┘${NC}"
    echo ""
}

# --- Loop Principal ---

main_loop() {
    while true; do
        show_main_menu
        echo -ne "${DARK_GREEN}    [>]${NC} ${GREEN}Selecione uma opção [0-9]:${NC} "
        read option

        case $option in
            1)
                start_server
                ;;
            2)
                stop_server
                ;;
            3)
                restart_server
                ;;
            4)
                show_status
                ;;
            5)
                kill_server
                ;;
            6)
                view_logs
                ;;
            7)
                clean_processes
                ;;
            8)
                # Para servidor se estiver rodando
                local PID=$(get_server_pid)
                if [ ! -z "$PID" ]; then
                    print_info "Parando servidor atual..."
                    kill $PID 2>/dev/null || true
                    sleep 2
                fi
                # Sincronizar e iniciar em modo preview
                start_server preview
                ;;
            9)
                promote_to_production
                ;;
            0)
                print_header
                echo -e "${DARK_GREEN}    ┌─[ ${GRAY}SAIR${DARK_GREEN} ]────────────────────────────────────────────┐${NC}"
                echo -e "${DARK_GREEN}    │${NC}"
                echo -e "${DARK_GREEN}    │${NC}  Fechando Gerenciador do Servidor..."
                echo -e "${DARK_GREEN}    │${NC}"

                local PID=$(get_server_pid)
                if [ ! -z "$PID" ]; then
                    echo -ne "${DARK_GREEN}    │${NC}  ${YELLOW}[!]${NC} O servidor está rodando. Parar? [s/N]: "
                    read stop_confirm
                    if [[ "$stop_confirm" =~ ^[Ss]$ ]]; then
                        echo -e "${DARK_GREEN}    │${NC}"
                        echo -e "${DARK_GREEN}    │${NC}  ${DARK_GREEN}[>]${NC} Parando servidor..."
                        kill $PID 2>/dev/null || true
                        sleep 1
                        echo -e "${DARK_GREEN}    │${NC}  ${BRIGHT_GREEN}[+]${NC} Servidor parado"
                    fi
                fi

                echo -e "${DARK_GREEN}    │${NC}"
                echo -e "${DARK_GREEN}    │${NC}  ${BRIGHT_GREEN}[+]${NC} Até logo!"
                echo -e "${DARK_GREEN}    │${NC}"
                echo -e "${DARK_GREEN}    └──────────────────────────────────────────────────────┘${NC}"
                echo ""
                exit 0
                ;;
            *)
                echo -e "    ${RED}[-]${NC} ${RED}Invalid option${NC}"
                sleep 1
                ;;
        esac
    done
}

# --- Ponto de Entrada ---

show_usage() {
    echo "Uso: $0 [COMANDO] [ARGUMENTOS]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start [preview]  - Iniciar servidor (opcional: modo preview)"
    echo "  start-preview    - Sincronizar preview e iniciar servidor"
    echo "  sync-preview     - Sincronizar com branch preview mais recente"
    echo "  promote-preview  - Promover preview para produção (main)"
    echo "  stop             - Parar servidor"
    echo "  restart          - Reiniciar servidor"
    echo "  status           - Mostrar status do servidor"
    echo "  kill             - Matar servidor forçadamente"
    echo "  logs             - Ver logs do servidor (tempo real)"
    echo "  cover-logs       - Ver logs de geração de capas (tempo real)"
    echo "  clean            - Limpar processos Node.js"
    echo "  menu             - Abrir menu interativo (padrão)"
    echo ""
    echo "Exemplos:"
    echo "  $0 start              # Inicia servidor na branch atual"
    echo "  $0 start preview      # Sincroniza preview e inicia servidor"
    echo "  $0 start-preview      # Atalho para 'start preview'"
    echo "  $0 sync-preview       # Apenas sincroniza (não inicia)"
    echo "  $0 promote-preview    # Promove preview para produção"
    echo ""
    echo "Sem argumentos: abre o menu interativo"
}

main() {
    # Se passou argumento, executar comando direto
    if [ $# -gt 0 ]; then
        INTERACTIVE_MODE=0
        case "$1" in
            start)
                # Verificar se tem argumento preview
                if [ "${2:-}" = "preview" ]; then
                    start_server preview
                else
                    start_server
                fi
                exit 0
                ;;
            start-preview)
                start_server preview
                exit 0
                ;;
            sync-preview)
                sync_preview 0
                exit 0
                ;;
            promote-preview)
                INTERACTIVE_MODE=1
                promote_to_production
                exit 0
                ;;
            stop)
                stop_server
                exit 0
                ;;
            restart)
                restart_server
                exit 0
                ;;
            status)
                show_status
                exit 0
                ;;
            kill)
                kill_server
                exit 0
                ;;
            logs)
                INTERACTIVE_MODE=1
                view_logs
                exit 0
                ;;
            cover-logs)
                INTERACTIVE_MODE=1
                view_cover_logs
                exit 0
                ;;
            clean)
                INTERACTIVE_MODE=1
                clean_processes
                exit 0
                ;;
            menu)
                INTERACTIVE_MODE=1
                # Continua para o modo interativo abaixo
                ;;
            -h|--help|help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Comando desconhecido: $1"
                echo ""
                show_usage
                exit 1
                ;;
        esac
    else
        INTERACTIVE_MODE=1
    fi

    # Entrar no loop principal
    main_loop
}

# Executar
main "$@"
