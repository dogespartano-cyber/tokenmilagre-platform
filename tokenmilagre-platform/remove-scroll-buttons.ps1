# Script para remover código relacionado ao scroll button das páginas
# Páginas a processar
$pages = @(
    "app\sobre\page.tsx",
    "app\manifesto\page.tsx",
    "app\doacoes\page.tsx"
)

foreach ($page in $pages) {
    $fullPath = "c:\Users\Kasnen\Desktop\Claude\Gemini\tokenmilagre-platform\tokenmilagre-platform\$page"
    
    Write-Host "Processando: $page"
    
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        
        # Remover import do faArrowUp (se existir sozinho)
        $content = $content -replace ',\s*faArrow Up(?=\s*\})', ''
        
        # Remover useState showScrollTop
        $content = $content -replace '\s*const \[showScrollTop, setShowScrollTop\] = useState\(false\);', ''
        
        # Remover função scrollToTop  
        $content = $content -replace '\s*const scrollToTop = \(\) => \{\s*window\.scrollTo\(\{ top: 0, behavior: ''smooth'' \}\);\s*\};', ''
        
        # Remover useEffect do scroll (aproximado, pode variar)
        $content = $content -replace '(?s)\s*const handleScroll = \(\) => \{[^}]+\};\s*window\.addEventListener\(''scroll'', handleScroll\);\s*return \(\) => window\.removeEventListener\(''scroll'', handleScroll\);', ''
        
        # Remover botão inline (multi-line)
        $content = $content -replace '(?s)\s*<button[^>]*onClick=\{scrollToTop\}[^>]*>.*?</button>', ''
        
        # Remover condicional {showScrollTop && (
        $content = $content -replace '(?s)\s*\{showScrollTop && \([^}]+scrollToTop[^}]+\}\)', ''
        
        Set-Content $fullPath -Value $content -NoNewline
        Write-Host "  ✓ Processado" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Arquivo não encontrado" -ForegroundColor Red
    }
}

Write-Host "`nConcluído!" -ForegroundColor Cyan
