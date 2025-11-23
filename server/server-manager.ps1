# ==============================================================================
#            SERVER MANAGER - Gerenciador do Servidor Next.js
# ==============================================================================
#
# Script interativo para gerenciar o servidor de desenvolvimento
# Token Milagre Platform - Windows PowerShell Version
#
# ==============================================================================

# Configuracao Global
$Global:ProjectDir = "C:\Users\Kasnen\Desktop\Claude\tokenmilagre-platform"
$Global:Port = 3000
$Global:LogFile = "$env:TEMP\tokenmilagre-server.log"

# --- Funcoes de Utilidade ---

function Print-Header {
    Clear-Host
    Write-Host ""
    Write-Host "    =========================================================" -ForegroundColor Green
    Write-Host "           SERVER MANAGER v2.0 - Token Milagre Platform    " -ForegroundColor Green
    Write-Host "    =========================================================" -ForegroundColor Green
    Write-Host "           Port: $Global:Port                               " -ForegroundColor DarkGreen
    Write-Host "    =========================================================" -ForegroundColor Green
    Write-Host ""
}

function Print-Success {
    param([string]$Message)
    Write-Host "  [OK]  " -ForegroundColor Green -NoNewline
    Write-Host $Message -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "  [ERR] " -ForegroundColor Red -NoNewline
    Write-Host $Message -ForegroundColor Red
}

function Print-Warning {
    param([string]$Message)
    Write-Host "  [!!!] " -ForegroundColor Yellow -NoNewline
    Write-Host $Message -ForegroundColor Yellow
}

function Print-Info {
    param([string]$Message)
    Write-Host "  [>>>] " -ForegroundColor DarkGreen -NoNewline
    Write-Host $Message -ForegroundColor Green
}

function Press-Enter {
    Write-Host ""
    Read-Host "Pressione ENTER para continuar"
}

# --- Funcoes de Gerenciamento do Servidor ---

function Test-Environment {
    $errors = @()

    # Verificar se o diretorio do projeto existe
    if (-not (Test-Path $Global:ProjectDir)) {
        $errors += "Diretorio do projeto nao encontrado: $Global:ProjectDir"
    }

    # Verificar se git esta instalado
    try {
        $gitVersion = git --version 2>$null
        if (-not $gitVersion) {
            $errors += "Git nao esta instalado ou nao esta no PATH"
        }
    }
    catch {
        $errors += "Git nao esta instalado ou nao esta no PATH"
    }

    # Verificar se npm esta instalado
    try {
        $npmVersion = npm --version 2>$null
        if (-not $npmVersion) {
            $errors += "NPM nao esta instalado ou nao esta no PATH"
        }
    }
    catch {
        $errors += "NPM nao esta instalado ou nao esta no PATH"
    }

    # Verificar se o diretorio e um repositorio git
    if (Test-Path $Global:ProjectDir) {
        $gitDir = Join-Path $Global:ProjectDir ".git"
        if (-not (Test-Path $gitDir)) {
            $errors += "Diretorio do projeto nao e um repositorio Git"
        }
    }

    return $errors
}

function Get-BuildInfo {
    Push-Location $Global:ProjectDir -ErrorAction SilentlyContinue

    try {
        $buildInfo = @{
            Branch = ""
            Type = ""
            CommitHash = ""
            CommitMessage = ""
            GitStatus = ""
            LastUpdate = ""
            CompareMain = ""
        }

        # Branch atual
        $buildInfo.Branch = git branch --show-current 2>$null

        # Tipo (Produção ou Preview)
        if ($buildInfo.Branch -eq "main") {
            $buildInfo.Type = "Production"
        } elseif ($buildInfo.Branch -match "^claude/") {
            $buildInfo.Type = "Preview"
        } else {
            $buildInfo.Type = "Development"
        }

        # Commit hash (7 chars)
        $buildInfo.CommitHash = git rev-parse --short=7 HEAD 2>$null

        # Mensagem do commit (primeira linha, max 60 chars)
        $commitMsg = git log -1 --pretty=format:"%s" 2>$null
        if ($commitMsg.Length -gt 60) {
            $buildInfo.CommitMessage = $commitMsg.Substring(0, 57) + "..."
        } else {
            $buildInfo.CommitMessage = $commitMsg
        }

        # Estado Git (Clean ou Dirty)
        $gitStatusOutput = git status --porcelain 2>$null
        if ([string]::IsNullOrWhiteSpace($gitStatusOutput)) {
            $buildInfo.GitStatus = "Clean"
        } else {
            $changedFiles = ($gitStatusOutput | Measure-Object -Line).Lines
            $buildInfo.GitStatus = "Dirty ($changedFiles files)"
        }

        # Última atualização (data/hora do commit)
        $buildInfo.LastUpdate = git log -1 --pretty=format:"%ci" 2>$null

        # Comparação com origin/main (se não estiver na main)
        if ($buildInfo.Branch -ne "main") {
            $ahead = (git rev-list --count origin/main..HEAD 2>$null)
            $behind = (git rev-list --count HEAD..origin/main 2>$null)

            if ($ahead -gt 0 -and $behind -gt 0) {
                $buildInfo.CompareMain = "$ahead ahead, $behind behind"
            } elseif ($ahead -gt 0) {
                $buildInfo.CompareMain = "$ahead ahead"
            } elseif ($behind -gt 0) {
                $buildInfo.CompareMain = "$behind behind"
            } else {
                $buildInfo.CompareMain = "up to date"
            }
        }

        return $buildInfo
    }
    catch {
        return $null
    }
    finally {
        Pop-Location
    }
}

function Get-ServerProcess {
    $connection = Get-NetTCPConnection -LocalPort $Global:Port -ErrorAction SilentlyContinue |
                  Select-Object -First 1

    if ($connection) {
        # Validar se o OwningProcess é válido (maior que 0)
        if ($connection.OwningProcess -le 0) {
            return $null
        }

        $proc = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($proc -and $proc.Id -gt 0) {
            # Adicionar informacao de health check
            $cpuPercent = [math]::Round($proc.CPU, 2)

            # Criar objeto customizado com informacoes extras
            $procInfo = [PSCustomObject]@{
                Process = $proc
                Id = $proc.Id
                CPU = $proc.CPU
                WorkingSet = $proc.WorkingSet
                Responding = $proc.Responding
                IsHighCPU = ($cpuPercent -gt 70)
            }

            return $procInfo
        }
    }
    return $null
}

function Show-Status {
    Print-Header
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "                     SERVER STATUS                          " -ForegroundColor Green
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""

    $procInfo = Get-ServerProcess
    Write-Host "  Next.js Server: " -NoNewline

    if ($procInfo) {
        # Verificar health
        if ($procInfo.IsHighCPU -or -not $procInfo.Responding) {
            Write-Host "LOOP DETECTED" -ForegroundColor Red
            Write-Host ""
            Print-Error "PID: $($procInfo.Id)"
            $cpuDisplay = [math]::Round($procInfo.CPU, 2)
            $memDisplay = [math]::Round($procInfo.WorkingSet / 1MB, 2)
            Print-Error "CPU: ${cpuDisplay}s | MEM: ${memDisplay}MB"
            Print-Error "Server stuck in infinite loop"
            Print-Warning "Use option 5 (Kill Server) to fix"
        } else {
            Write-Host "RUNNING" -ForegroundColor Green
            Write-Host ""
            Print-Success "PID: $($procInfo.Id)"
            $cpuDisplay = [math]::Round($procInfo.CPU, 2)
            $memDisplay = [math]::Round($procInfo.WorkingSet / 1MB, 2)
            Print-Success "CPU: ${cpuDisplay}s | MEM: ${memDisplay}MB"
            Print-Success "Port: $Global:Port"
            Print-Success "URL: http://localhost:$Global:Port"
            Print-Info "Directory: $Global:ProjectDir"
        }
    } else {
        Write-Host "OFFLINE" -ForegroundColor Red
        Write-Host ""
        Print-Warning "No process on port $Global:Port"
    }

    Write-Host ""

    # Verificar processos nao-responsivos
    $unresponsiveProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue |
                         Where-Object { -not $_.Responding }

    if ($unresponsiveProcs) {
        $count = ($unresponsiveProcs | Measure-Object).Count
        Print-Warning "$count unresponsive Node.js processes detected"
        Print-Info "Use option 7 (Clean Processes) to remove"
        Write-Host ""
    }

    Write-Host "  ---------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "                       BUILD INFO                          " -ForegroundColor Cyan
    Write-Host "  ---------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host ""

    $buildInfo = Get-BuildInfo
    if ($buildInfo) {
        # Tipo (colorir baseado no tipo)
        $typeColor = "Gray"
        $typeIcon = "[DEV]"
        if ($buildInfo.Type -eq "Production") {
            $typeColor = "Green"
            $typeIcon = "[PROD]"
        } elseif ($buildInfo.Type -eq "Preview") {
            $typeColor = "Yellow"
            $typeIcon = "[PREV]"
        }

        Write-Host "  Type: " -NoNewline
        Write-Host "$typeIcon $($buildInfo.Type)" -ForegroundColor $typeColor

        # Branch
        Print-Info "Branch: $($buildInfo.Branch)"

        # Commit
        Print-Info "Commit: $($buildInfo.CommitHash) - $($buildInfo.CommitMessage)"

        # Estado Git
        if ($buildInfo.GitStatus -eq "Clean") {
            Write-Host "  [OK]  " -ForegroundColor Green -NoNewline
            Write-Host "Status: $($buildInfo.GitStatus)" -ForegroundColor Green
        } else {
            Write-Host "  [!!!] " -ForegroundColor Yellow -NoNewline
            Write-Host "Status: $($buildInfo.GitStatus)" -ForegroundColor Yellow
        }

        # Última atualização
        Print-Info "Updated: $($buildInfo.LastUpdate)"

        # Comparação com main (se aplicável)
        if ($buildInfo.CompareMain) {
            Print-Info "vs Main: $($buildInfo.CompareMain)"
        }
    } else {
        Print-Warning "Git info not available (not a git repository?)"
    }

    Write-Host ""
    Write-Host "  =========================================================" -ForegroundColor DarkGreen

    Press-Enter
}

function Sync-Preview {
    param([switch]$Quiet)

    if (-not $Quiet) {
        Print-Header
        Write-Host "  =========================================================" -ForegroundColor DarkGreen
        Write-Host "                     SYNC PREVIEW                          " -ForegroundColor Yellow
        Write-Host "  =========================================================" -ForegroundColor DarkGreen
        Write-Host ""
    }

    # Validar se o diretorio existe
    if (-not (Test-Path $Global:ProjectDir)) {
        Print-Error "Diretorio do projeto nao encontrado: $Global:ProjectDir"
        if (-not $Quiet) { Press-Enter }
        return $false
    }

    Print-Info "Entrando no diretorio do projeto..."
    Set-Location $Global:ProjectDir

    Print-Info "Buscando branches preview do remoto..."
    git fetch origin --prune 2>$null

    if ($LASTEXITCODE -ne 0) {
        Print-Error "Falha ao buscar branches do remoto"
        Print-Warning "Verifique sua conexao de rede ou configuracao do Git"
        if (-not $Quiet) { Press-Enter }
        return $false
    }

    # Encontrar branch preview mais recente
    $latestPreview = git for-each-ref --sort=-committerdate refs/remotes/origin/claude/ --format='%(refname:short)' |
                     Select-Object -First 1 |
                     ForEach-Object { $_ -replace 'origin/', '' }

    if (-not $latestPreview) {
        Print-Error "Nenhuma branch preview (claude/*) encontrada"
        if (-not $Quiet) { Press-Enter }
        return $false
    }

    Print-Success "Branch preview mais recente: $latestPreview"

    # Verificar branch atual
    $currentBranch = git branch --show-current

    if ($currentBranch -eq $latestPreview) {
        Print-Info "Ja esta na branch preview, atualizando..."
        git pull origin $latestPreview 2>$null
    } else {
        # Verificar se há mudanças locais antes do checkout
        $gitStatusOutput = git status --porcelain 2>$null
        $hasLocalChanges = -not [string]::IsNullOrWhiteSpace($gitStatusOutput)

        if ($hasLocalChanges) {
            $changedFiles = ($gitStatusOutput | Measure-Object -Line).Lines
            Print-Warning "Mudancas locais detectadas ($changedFiles arquivos)"
            Print-Info "Fazendo stash automatico..."
            git stash push -m "Auto-stash before sync-preview $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>$null

            if ($LASTEXITCODE -eq 0) {
                Print-Success "Mudancas guardadas em stash"
            } else {
                Print-Error "Falha ao fazer stash"
                if (-not $Quiet) { Press-Enter }
                return $false
            }
        }

        Print-Info "Fazendo checkout para $latestPreview..."

        $branchExists = git show-ref --verify --quiet "refs/heads/$latestPreview"
        if ($LASTEXITCODE -eq 0) {
            git checkout $latestPreview 2>$null
            git pull origin $latestPreview 2>$null
        } else {
            git checkout -b $latestPreview "origin/$latestPreview" 2>$null
        }

        if ($hasLocalChanges) {
            Write-Host ""
            Print-Info "Mudancas anteriores estao guardadas em stash"
            Print-Info "Para recuperar: git stash pop"
        }
    }

    # Verificar se checkout foi bem-sucedido
    $currentBranch = git branch --show-current
    if ($currentBranch -ne $latestPreview) {
        Print-Error "Falha ao fazer checkout para $latestPreview"
        if (-not $Quiet) { Press-Enter }
        return $false
    }

    Print-Info "Verificando mudancas em dependencias..."

    # Sempre instalar dependencias ao sincronizar preview
    Print-Warning "Instalando/atualizando dependencias..."
    npm install --silent 2>&1 | Out-Null

    Write-Host ""
    Print-Success "Preview sincronizado com sucesso!"
    Print-Info "Branch atual: $currentBranch"

    if (-not $Quiet) { Press-Enter }
    return $true
}

function Promote-ToProduction {
    Print-Header
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "                PROMOTE TO PRODUCTION                       " -ForegroundColor Green
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""

    # Validar se o diretorio existe
    if (-not (Test-Path $Global:ProjectDir)) {
        Print-Error "Diretorio do projeto nao encontrado: $Global:ProjectDir"
        Press-Enter
        return
    }

    Print-Info "Entrando no diretorio do projeto..."
    Set-Location $Global:ProjectDir

    Print-Info "Buscando atualizacoes do remoto..."
    git fetch origin --prune 2>$null

    if ($LASTEXITCODE -ne 0) {
        Print-Error "Falha ao buscar atualizacoes do remoto"
        Print-Warning "Verifique sua conexao de rede ou configuracao do Git"
        Press-Enter
        return
    }

    # Encontrar branch preview mais recente
    $latestPreview = git for-each-ref --sort=-committerdate refs/remotes/origin/claude/ --format='%(refname:short)' |
                     Select-Object -First 1 |
                     ForEach-Object { $_ -replace 'origin/', '' }

    if (-not $latestPreview) {
        Print-Error "Nenhuma branch preview (claude/*) encontrada"
        Press-Enter
        return
    }

    Write-Host "  =========================================================" -ForegroundColor Cyan
    Print-Success "Branch preview mais recente: $latestPreview"
    Write-Host ""

    # Mostrar informacoes do ultimo commit da preview
    Print-Info "Ultimo commit da preview:"
    git log "origin/$latestPreview" -1 --pretty=format:"  %h - %ar - %s"
    Write-Host ""
    Write-Host ""

    # Mostrar diff entre main e preview
    Print-Info "Mudancas que serao promovidas para producao:"
    $commitCount = (git rev-list origin/main.."origin/$latestPreview" --count)
    Write-Host "  $commitCount commits serao mesclados" -ForegroundColor Green
    Write-Host ""

    # Mostrar os commits
    git log origin/main.."origin/$latestPreview" --oneline --pretty=format:"  * %s (%ar)" | Select-Object -First 10
    Write-Host ""

    if ($commitCount -gt 10) {
        Write-Host "  ... e mais $($commitCount - 10) commits" -ForegroundColor Yellow
        Write-Host ""
    }

    Write-Host "  =========================================================" -ForegroundColor Cyan
    Write-Host ""

    # Confirmacao
    $confirm = Read-Host "Deseja promover esta preview para producao (main)? [s/N]"
    if ($confirm -notmatch '^[Ss]$') {
        Print-Info "Operacao cancelada"
        Press-Enter
        return
    }

    Write-Host ""

    # Verificar se há mudanças locais antes do checkout
    $gitStatusOutput = git status --porcelain 2>$null
    $hasLocalChanges = -not [string]::IsNullOrWhiteSpace($gitStatusOutput)

    if ($hasLocalChanges) {
        $changedFiles = ($gitStatusOutput | Measure-Object -Line).Lines
        Print-Warning "Mudancas locais detectadas ($changedFiles arquivos)"
        Print-Error "Nao e possivel promover para producao com mudancas nao commitadas"
        Print-Info "Opcoes:"
        Print-Info "1. git stash    - Guardar mudancas temporariamente"
        Print-Info "2. git commit   - Commitar as mudancas"
        Print-Info "3. git reset    - Descartar mudancas"
        Press-Enter
        return
    }

    Print-Info "Fazendo checkout para main..."
    git checkout main 2>$null

    if ($LASTEXITCODE -ne 0) {
        Print-Error "Falha ao fazer checkout para main"
        Press-Enter
        return
    }

    Print-Info "Atualizando main..."
    git pull origin main 2>$null

    Print-Info "Mesclando preview em main..."
    $mergeResult = git merge --no-ff "origin/$latestPreview" -m "chore: Promover preview $latestPreview para producao" 2>&1

    if ($LASTEXITCODE -eq 0) {
        Print-Success "Merge realizado com sucesso!"
    } else {
        Print-Error "Falha ao fazer merge. Resolvendo conflitos pode ser necessario."
        Print-Info "Execute manualmente: git merge origin/$latestPreview"
        Press-Enter
        return
    }

    Write-Host ""
    Write-Host "  =========================================================" -ForegroundColor Cyan
    Print-Success "Preview promovida para main com sucesso!"
    Print-Info "Branch atual: main"
    Write-Host "  =========================================================" -ForegroundColor Cyan
    Write-Host ""

    # Perguntar se quer fazer push
    $pushConfirm = Read-Host "Deseja fazer push para producao (origin/main)? [s/N]"
    if ($pushConfirm -match '^[Ss]$') {
        Write-Host ""
        Print-Info "Fazendo push para origin/main..."
        git push origin main 2>&1

        if ($LASTEXITCODE -eq 0) {
            Print-Success "Push realizado com sucesso!"
            Write-Host ""
            Print-Success "Deploy para producao iniciado!"
            Print-Info "Acompanhe em: https://vercel.com"
        } else {
            Print-Error "Falha ao fazer push"
        }
    } else {
        Write-Host ""
        Print-Warning "Push nao realizado. Para fazer push depois:"
        Print-Info "git push origin main"
    }

    Write-Host ""

    # Perguntar se quer limpar branch preview local
    $cleanupConfirm = Read-Host "Deseja deletar a branch preview local ($latestPreview)? [s/N]"
    if ($cleanupConfirm -match '^[Ss]$') {
        Write-Host ""
        Print-Info "Deletando branch local $latestPreview..."
        git branch -D $latestPreview 2>$null
        Print-Success "Branch local deletada"
    }

    Press-Enter
}

function Start-Server {
    param([string]$Mode = "normal")

    Print-Header
    if ($Mode -eq "preview") {
        Write-Host "  =========================================================" -ForegroundColor DarkGreen
        Write-Host "              START SERVER - PREVIEW MODE                  " -ForegroundColor Yellow
        Write-Host "  =========================================================" -ForegroundColor DarkGreen
    } else {
        Write-Host "  =========================================================" -ForegroundColor DarkGreen
        Write-Host "                     START SERVER                          " -ForegroundColor Green
        Write-Host "  =========================================================" -ForegroundColor DarkGreen
    }
    Write-Host ""

    $procInfo = Get-ServerProcess
    if ($procInfo) {
        Print-Warning "Servidor ja esta rodando (PID: $($procInfo.Id))"
        Print-Info "URL: http://localhost:$Global:Port"
        Press-Enter
        return
    }

    # Se modo preview, sincronizar primeiro
    if ($Mode -eq "preview") {
        Write-Host "  =========================================================" -ForegroundColor Cyan
        $syncResult = Sync-Preview -Quiet
        Write-Host "  =========================================================" -ForegroundColor Cyan
        Write-Host ""

        # Se o sync falhou, não continuar
        if (-not $syncResult) {
            Print-Error "Falha ao sincronizar preview"
            Press-Enter
            return
        }
    }

    # Validar se o diretorio existe
    if (-not (Test-Path $Global:ProjectDir)) {
        Print-Error "Diretorio do projeto nao encontrado: $Global:ProjectDir"
        Press-Enter
        return
    }

    Print-Info "Entrando no diretorio do projeto..."
    Set-Location $Global:ProjectDir

    # Mostrar branch atual
    $branch = git branch --show-current
    Print-Info "Branch atual: $branch"

    Print-Info "Executando: npm run dev"
    Print-Info "Logs salvos em: $Global:LogFile"

    # Iniciar servidor em background
    $job = Start-Job -ScriptBlock {
        param($dir, $logFile)
        Set-Location $dir
        npm run dev 2>&1 | Tee-Object -FilePath $logFile
    } -ArgumentList $Global:ProjectDir, $Global:LogFile

    Print-Info "Aguardando inicializacao..."
    Start-Sleep -Seconds 3

    $procInfo = Get-ServerProcess
    if ($procInfo) {
        Write-Host ""
        Print-Success "Servidor iniciado com sucesso!"
        Print-Info "PID: $($procInfo.Id)"
        Print-Info "Porta: $Global:Port"
        Print-Info "Branch: $branch"
        Print-Info "URL: http://localhost:$Global:Port"

        # Salvar Job ID para logs posteriores
        $Global:ServerJobId = $job.Id
    } else {
        Write-Host ""
        Print-Error "Falha ao iniciar servidor"
        Print-Warning "Verifique se ha erros no projeto:"
        Print-Info "1. cd $Global:ProjectDir"
        Print-Info "2. npm run dev"
    }

    Press-Enter
}

function Stop-Server {
    Print-Header
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "                     STOP SERVER                            " -ForegroundColor Red
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""

    $procInfo = Get-ServerProcess
    if (-not $procInfo -or $procInfo.Id -le 0) {
        Print-Warning "Servidor ja esta offline"

        # Limpar jobs orfaos mesmo se nao houver processo
        if ($Global:ServerJobId) {
            Print-Info "Limpando job em background..."
            Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
            Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
            $Global:ServerJobId = $null
        }

        Press-Enter
        return
    }

    Print-Info "Parando processo (PID: $($procInfo.Id))..."
    Stop-Process -Id $procInfo.Id -Force -ErrorAction SilentlyContinue

    # Parar o job em background se existir
    if ($Global:ServerJobId) {
        Print-Info "Parando job em background (Job ID: $Global:ServerJobId)..."
        Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
        Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
        $Global:ServerJobId = $null
    }

    Start-Sleep -Seconds 2

    $procInfo = Get-ServerProcess
    if (-not $procInfo) {
        Print-Success "Servidor parado com sucesso"
    } else {
        Print-Warning "Processo ainda rodando. Use 'Kill Server' para forcar."
    }

    Press-Enter
}

function Kill-Server {
    Print-Header
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "              KILL SERVER - FORCE TERMINATE                 " -ForegroundColor Red
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""

    $procInfo = Get-ServerProcess
    if (-not $procInfo -or $procInfo.Id -le 0) {
        Print-Warning "Nenhum processo na porta $Global:Port"

        # Limpar jobs orfaos mesmo se nao houver processo
        if ($Global:ServerJobId) {
            Print-Info "Limpando job em background orfao..."
            Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
            Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
            $Global:ServerJobId = $null
            Print-Success "Job removido"
        }

        Press-Enter
        return
    }

    Print-Warning "Esta acao ira forcar o encerramento do processo!"
    $confirm = Read-Host "Deseja continuar? [s/N]"

    if ($confirm -match '^[Ss]$') {
        Write-Host ""
        Print-Info "Executando kill -9 $($procInfo.Id)..."
        Stop-Process -Id $procInfo.Id -Force -ErrorAction SilentlyContinue

        # Parar o job em background se existir
        if ($Global:ServerJobId) {
            Print-Info "Parando job em background (Job ID: $Global:ServerJobId)..."
            Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
            Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
            $Global:ServerJobId = $null
        }

        Start-Sleep -Seconds 1

        $procInfo = Get-ServerProcess
        if (-not $procInfo) {
            Print-Success "Processos eliminados com sucesso"
        } else {
            Print-Error "Falha ao eliminar processos"
            Print-Info "Tente manualmente: Stop-Process -Id $($procInfo.Id) -Force"
        }
    } else {
        Print-Info "Operacao cancelada"
    }

    Press-Enter
}

function Restart-Server {
    Print-Header
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "                   RESTART SERVER                           " -ForegroundColor Cyan
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""

    $procInfo = Get-ServerProcess
    if ($procInfo -and $procInfo.Id -gt 0) {
        Print-Info "Parando servidor atual..."
        Stop-Process -Id $procInfo.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }

    # Parar job anterior se existir
    if ($Global:ServerJobId) {
        Print-Info "Parando job anterior (Job ID: $Global:ServerJobId)..."
        Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
        Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
        $Global:ServerJobId = $null
    }

    # Verificar se parou
    $procInfo = Get-ServerProcess
    if ($procInfo -and $procInfo.Id -gt 0) {
        Print-Warning "Processo ainda rodando, forcando..."
        Stop-Process -Id $procInfo.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }

    Print-Success "Servidor parado"
    Write-Host ""
    Print-Info "Iniciando servidor..."
    Print-Info "Logs salvos em: $Global:LogFile"

    Set-Location $Global:ProjectDir

    # Limpar log anterior e iniciar novo
    "" | Out-File -FilePath $Global:LogFile
    $job = Start-Job -ScriptBlock {
        param($dir, $logFile)
        Set-Location $dir
        npm run dev 2>&1 | Tee-Object -FilePath $logFile
    } -ArgumentList $Global:ProjectDir, $Global:LogFile

    Print-Info "Aguardando inicializacao..."
    Start-Sleep -Seconds 3

    $procInfo = Get-ServerProcess
    if ($procInfo) {
        Write-Host ""
        Print-Success "Servidor reiniciado com sucesso!"
        Print-Info "PID: $($procInfo.Id)"
        Print-Info "URL: http://localhost:$Global:Port"

        $Global:ServerJobId = $job.Id
    } else {
        Write-Host ""
        Print-Error "Falha ao reiniciar servidor"
    }

    Press-Enter
}

function View-Logs {
    Print-Header
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "               SERVER LOGS - REAL-TIME                      " -ForegroundColor Cyan
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""

    $procInfo = Get-ServerProcess
    if (-not $procInfo) {
        Print-Error "Servidor nao esta rodando"
        Press-Enter
        return
    }

    if (-not (Test-Path $Global:LogFile)) {
        Print-Error "Arquivo de log nao encontrado: $Global:LogFile"
        Print-Info "Reinicie o servidor para criar o arquivo de log"
        Press-Enter
        return
    }

    Print-Info "PID do servidor: $($procInfo.Id)"
    Print-Info "Arquivo de log: $Global:LogFile"
    Write-Host ""
    Print-Warning "Logs em tempo real (Ctrl+C para sair)"
    Write-Host "  =========================================================" -ForegroundColor Cyan
    Write-Host ""
    Start-Sleep -Seconds 1

    # Mostrar logs em tempo real
    Get-Content -Path $Global:LogFile -Wait -Tail 50
}


function Clean-Processes {
    Print-Header
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "                   CLEAN PROCESSES                          " -ForegroundColor Magenta
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""

    Print-Info "Buscando processos Node.js relacionados ao projeto..."
    Write-Host ""

    # Buscar processos vivos
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

    # Processos nao-responsivos
    $unresponsiveProcs = $nodeProcesses | Where-Object { -not $_.Responding }

    if (-not $nodeProcesses) {
        Print-Success "Nenhum processo residual encontrado"
        Press-Enter
        return
    }

    if ($nodeProcesses) {
        Write-Host "  Processos ativos encontrados:" -ForegroundColor Cyan
        $nodeProcesses | ForEach-Object {
            $cpuDisplay = [math]::Round($_.CPU, 2)
            $memDisplay = [math]::Round($_.WorkingSet / 1MB, 2)
            $respondingText = if ($_.Responding) { "OK" } else { "NOT RESPONDING" }
            $color = if ($_.Responding) { "Green" } else { "Red" }
            Write-Host "    PID: $($_.Id) | CPU: ${cpuDisplay}s | MEM: ${memDisplay}MB | Status: $respondingText" -ForegroundColor $color
        }
        Write-Host ""
    }

    if ($unresponsiveProcs) {
        $count = ($unresponsiveProcs | Measure-Object).Count
        Print-Warning "$count processos nao-responsivos detectados"
        Write-Host "  Processos travados (nao podem ser mortos normalmente):" -ForegroundColor Cyan
        $unresponsiveProcs | ForEach-Object {
            Write-Host "    PID: $($_.Id) | Status: NOT RESPONDING" -ForegroundColor Red
        }
        Write-Host ""
    }

    $confirm = Read-Host "Deseja matar todos os processos ativos? [s/N]"

    if ($confirm -match '^[Ss]$') {
        Write-Host ""
        Print-Info "Matando processos ativos..."
        $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1

        # Verificar se limpou
        $remainingProcs = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if (-not $remainingProcs) {
            Print-Success "Processos ativos eliminados"
        } else {
            Print-Warning "Alguns processos ainda estao rodando"
        }

        if ($unresponsiveProcs) {
            Write-Host ""
            Print-Info "Processos nao-responsivos foram forcados a encerrar"
        }
    } else {
        Print-Info "Operacao cancelada"
    }

    Press-Enter
}

# --- Menu Principal ---

function Show-MainMenu {
    Print-Header

    # Mostrar status breve
    $procInfo = Get-ServerProcess
    $statusIcon = "DESLIGADO"
    $statusText = "Servidor parado"
    $statusColor = "Red"

    if ($procInfo) {
        $statusIcon = "ONLINE"
        $statusText = "PID: $($procInfo.Id) | Porta: $Global:Port"
        $statusColor = "Green"
    }

    Write-Host "  =========================================================" -ForegroundColor DarkGray
    Write-Host "                    STATUS DO SISTEMA                       " -ForegroundColor White
    Write-Host "  =========================================================" -ForegroundColor DarkGray
    Write-Host "  Servidor Next.js: " -NoNewline
    Write-Host $statusIcon -ForegroundColor $statusColor -NoNewline
    Write-Host " - $statusText" -ForegroundColor $statusColor
    Write-Host "  =========================================================" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host "                      MENU PRINCIPAL                        " -ForegroundColor Green
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""
    Write-Host "   (1)  Iniciar Servidor            Inicia servidor de desenvolvimento" -ForegroundColor Green
    Write-Host "   (2)  Parar Servidor              Desligamento gracioso" -ForegroundColor Green
    Write-Host "   (3)  Reiniciar Servidor          Para e inicia o servidor" -ForegroundColor Green
    Write-Host "   (4)  Ver Status                  Mostra status detalhado" -ForegroundColor Green
    Write-Host "   (5)  Forcar Parada               Terminacao forcada" -ForegroundColor Red
    Write-Host ""
    Write-Host "   (6)  Ver Logs                    Logs do servidor em tempo real" -ForegroundColor Cyan
    Write-Host "   (7)  Limpar Processos Node       Remove processos zumbi" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "   (9)  Sincronizar e Iniciar       Ultima branch preview" -ForegroundColor Yellow
    Write-Host "   (10) Promover para Producao      Deploy para producao" -ForegroundColor Green
    Write-Host ""
    Write-Host "   (0)  Sair                        Fecha o gerenciador" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  =========================================================" -ForegroundColor DarkGreen
    Write-Host ""
}

# --- Loop Principal ---

function Main-Loop {
    while ($true) {
        Show-MainMenu
        Write-Host "  [>>>] " -ForegroundColor DarkGreen -NoNewline
        Write-Host "Selecione uma opcao (0-10): " -ForegroundColor Green -NoNewline
        $option = Read-Host

        switch ($option) {
            "1" { Start-Server }
            "2" { Stop-Server }
            "3" { Restart-Server }
            "4" { Show-Status }
            "5" { Kill-Server }
            "6" { View-Logs }
            "7" { Clean-Processes }
            "9" {
                # Para servidor se estiver rodando
                $procInfo = Get-ServerProcess
                if ($procInfo -and $procInfo.Id -gt 0) {
                    Print-Info "Parando servidor atual..."
                    Stop-Process -Id $procInfo.Id -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 2
                }

                # Parar job se existir
                if ($Global:ServerJobId) {
                    Print-Info "Parando job anterior..."
                    Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
                    Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
                    $Global:ServerJobId = $null
                }

                # Sincronizar e iniciar em modo preview
                Start-Server -Mode "preview"
            }
            "10" { Promote-ToProduction }
            "0" {
                Print-Header
                Write-Host "  =========================================================" -ForegroundColor DarkGreen
                Write-Host "                        SAIR                               " -ForegroundColor DarkGray
                Write-Host "  =========================================================" -ForegroundColor DarkGreen
                Write-Host ""
                Write-Host "  Fechando Gerenciador de Servidor..." -ForegroundColor Green
                Write-Host ""

                $procInfo = Get-ServerProcess
                if ($procInfo -and $procInfo.Id -gt 0) {
                    $stopConfirm = Read-Host "  Servidor esta rodando. Deseja para-lo? [s/N]"
                    if ($stopConfirm -match '^[Ss]$') {
                        Write-Host ""
                        Print-Info "Parando servidor..."
                        Stop-Process -Id $procInfo.Id -Force -ErrorAction SilentlyContinue

                        # Parar job se existir
                        if ($Global:ServerJobId) {
                            Print-Info "Parando job em background..."
                            Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
                            Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
                            $Global:ServerJobId = $null
                        }

                        Start-Sleep -Seconds 1
                        Print-Success "Servidor parado"
                    }
                } elseif ($Global:ServerJobId) {
                    # Limpar job orfao mesmo sem processo
                    Print-Info "Limpando job em background orfao..."
                    Stop-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue
                    Remove-Job -Id $Global:ServerJobId -ErrorAction SilentlyContinue -Force
                    $Global:ServerJobId = $null
                }

                Write-Host ""
                Print-Success "Ate logo!"
                Write-Host ""
                Write-Host "  =========================================================" -ForegroundColor DarkGreen
                Write-Host ""
                exit
            }
            default {
                Print-Error "Opcao invalida"
                Start-Sleep -Seconds 1
            }
        }
    }
}

# --- Ponto de Entrada ---

function Show-Usage {
    Write-Host "Uso: .\server-manager.ps1 [COMANDO] [ARGUMENTOS]"
    Write-Host ""
    Write-Host "Comandos disponiveis:"
    Write-Host "  start [preview]  - Iniciar servidor (opcional: modo preview)"
    Write-Host "  start-preview    - Sincronizar preview e iniciar servidor"
    Write-Host "  sync-preview     - Sincronizar com branch preview mais recente"
    Write-Host "  promote-preview  - Promover preview para producao (main)"
    Write-Host "  stop             - Parar servidor"
    Write-Host "  restart          - Reiniciar servidor"
    Write-Host "  status           - Mostrar status do servidor"
    Write-Host "  kill             - Matar servidor forcadamente"
    Write-Host "  logs             - Ver logs do servidor (tempo real)"
    Write-Host "  clean            - Limpar processos Node.js"
    Write-Host "  menu             - Abrir menu interativo (padrao)"
    Write-Host ""
    Write-Host "Exemplos:"
    Write-Host "  .\server-manager.ps1 start              # Inicia servidor na branch atual"
    Write-Host "  .\server-manager.ps1 start preview      # Sincroniza preview e inicia servidor"
    Write-Host "  .\server-manager.ps1 start-preview      # Atalho para start preview"
    Write-Host "  .\server-manager.ps1 sync-preview       # Apenas sincroniza (nao inicia)"
    Write-Host "  .\server-manager.ps1 promote-preview    # Promove preview para producao"
    Write-Host ""
    Write-Host "Sem argumentos: abre o menu interativo"
}

# Verificar se esta executando como administrador
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Algumas funcoes podem requerer privilegios de administrador"
    Write-Warning "Execute como administrador para funcionalidade completa"
    Start-Sleep -Seconds 2
}

# Validar ambiente antes de iniciar
$envErrors = Test-Environment
if ($envErrors.Count -gt 0) {
    Write-Host ""
    Write-Host "=========================================================" -ForegroundColor Red
    Write-Host "  ERRO: Problemas detectados no ambiente" -ForegroundColor Red
    Write-Host "=========================================================" -ForegroundColor Red
    Write-Host ""

    foreach ($error in $envErrors) {
        Write-Host "  [X] $error" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "=========================================================" -ForegroundColor Red
    Write-Host ""

    # Perguntar se deseja continuar mesmo assim
    $continue = Read-Host "Deseja continuar mesmo assim? [s/N]"
    if ($continue -notmatch '^[Ss]$') {
        Write-Host ""
        Write-Host "Encerrando..." -ForegroundColor Yellow
        exit 1
    }
    Write-Host ""
}

# Processar argumentos de linha de comando
if ($args.Count -gt 0) {
    switch ($args[0]) {
        "start" {
            if ($args[1] -eq "preview") {
                Start-Server -Mode "preview"
            } else {
                Start-Server
            }
            exit 0
        }
        "start-preview" {
            Start-Server -Mode "preview"
            exit 0
        }
        "sync-preview" {
            Sync-Preview
            exit 0
        }
        "promote-preview" {
            Promote-ToProduction
            exit 0
        }
        "stop" {
            Stop-Server
            exit 0
        }
        "restart" {
            Restart-Server
            exit 0
        }
        "status" {
            Show-Status
            exit 0
        }
        "kill" {
            Kill-Server
            exit 0
        }
        "logs" {
            View-Logs
            exit 0
        }
        "clean" {
            Clean-Processes
            exit 0
        }
        "menu" {
            # Continua para o modo interativo abaixo
        }
        { $_ -in @("-h", "--help", "help") } {
            Show-Usage
            exit 0
        }
        default {
            Print-Error "Comando desconhecido: $($args[0])"
            Write-Host ""
            Show-Usage
            exit 1
        }
    }
}

# Entrar no loop principal
Main-Loop
