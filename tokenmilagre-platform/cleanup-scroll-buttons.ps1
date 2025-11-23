# Script simples para remover linhas relacionadas ao scroll button
# Este script comentará as linhas problemáticas ao invés de deletá-las

$files = @(
    "c:\Users\Kasnen\Desktop\Claude\Gemini\tokenmilagre-platform\tokenmilagre-platform\app\manifesto\page.tsx",
    "c:\Users\Kasnen\Desktop\Claude\Gemini\tokenmilagre-platform\tokenmilagre-platform\app\doacoes\page.tsx"
)

foreach ($file in $files) {
    Write-Host "`n=== Processando: $file ===" -ForegroundColor Cyan
    
    if (!(Test-Path $file)) {
        Write-Host "Arquivo não encontrado!" -ForegroundColor Red
        continue
    }
    
    $lines = Get-Content $file
    $newLines = @()
    $skip = 0
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Skip se estamos em um bloco de skip
        if ($skip -gt 0) {
            $skip--
            continue
        }
        
        # Detectar e remover: const [showScrollTop, setShowScrollTop] = useState(false);
        if ($line -match '^\s*const \[showScrollTop,') {
            Write-Host "  Removendo linha $($i+1): showScrollTop state" -ForegroundColor Yellow
            continue
        }
        
        # Detectar função scrollToTop
        if ($line -match '^\s*const scrollToTop = \(\) => \{') {
            Write-Host "  Removendo linha $($i+1): scrollToTop function (3 linhas)" -ForegroundColor Yellow
            $skip = 2  # Pular as próximas 2 linhas
            continue
        }
        
        # Detectar useEffect scroll handler (aproximado)
        if ($line -match 'setShowScrollTop\(window\.scrollY') {
            Write-Host "  Removendo linha $($i+1): scroll handler" -ForegroundColor Yellow  
            continue
        }
        
        if ($line -match 'window\.addEventListener\(.*scroll.*handleScroll') {
            Write-Host "  Removendo linha $($i+1): addEventListener scroll" -ForegroundColor Yellow
            continue
        }
        
        if ($line -match 'window\.removeEventListener\(.*scroll.*handleScroll') {
            Write-Host "  Removendo linha $($i+1): removeEventListener scroll" -ForegroundColor Yellow
            continue
        }
        
        # Detectar botão inline - início
        if ($line -match '^\s*<button' -and $i+1 -lt $lines.Count -and $lines[$i+1] -match 'scroll ToTop') {
            Write-Host "  Removendo botão inline (linhas $($i+1) até fechamento)" -ForegroundColor Yellow
            # Contar até encontrar o </button> correspondente
            $depth = 1
            while ($i -lt $lines.Count -and $depth -gt 0) {
                $i++
                if ($lines[$i] -match '<button') { $depth++ }
                if ($lines[$i] -match '</button>') { $depth-- }
            }
            continue
        }
        
        # Manter a linha
        $newLines += $line
    }
    
    # Salvar arquivo
    $newLines | Set-Content $file -Encoding UTF8
    Write-Host "  ✓ Arquivo atualizado ($($lines.Count - $newLines.Count) linhas removidas)" -ForegroundColor Green
}

Write-Host "`n=== Concluído! ===" -ForegroundColor Cyan
