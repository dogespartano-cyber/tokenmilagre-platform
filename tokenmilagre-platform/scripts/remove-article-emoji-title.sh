#!/bin/bash

# Script para remover "📊 Sobre Este Artigo" de todos os artigos
# Mantém o conteúdo após essa linha

ARTICLES_DIR="/home/destakar/Trabalho/gemini/articles"

echo "🔍 Procurando artigos com '📊 Sobre Este Artigo'..."

# Encontrar todos os arquivos .md (exceto README e backups)
find "$ARTICLES_DIR" -name "*.md" -type f ! -name "README.md" ! -name "*.bak" | while read -r file; do
    if grep -q "📊 Sobre Este Artigo" "$file"; then
        echo "✏️  Processando: $(basename "$file")"

        # Remover apenas a linha "📊 Sobre Este Artigo"
        sed -i '/^📊 Sobre Este Artigo$/d' "$file"
    fi
done

echo "✅ Processamento concluído!"
echo ""
echo "📊 Verificando resultado..."
remaining=$(find "$ARTICLES_DIR" -name "*.md" -type f ! -name "README.md" ! -name "*.bak" -exec grep -l "📊 Sobre Este Artigo" {} \; | wc -l)
echo "Artigos restantes com o título: $remaining"
