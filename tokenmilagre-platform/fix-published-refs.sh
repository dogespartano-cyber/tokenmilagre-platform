#!/bin/bash
# Corrigir referências de published: true/false para status e deletedAt

# Arquivos a corrigir
files=(
  "app/api/news/route.ts"
  "app/api/news/related/[slug]/route.ts"
  "app/api/articles/route.ts"
  "app/api/articles/list/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Corrigindo $file..."
    # Substituir published: true por status: 'published', deletedAt: null
    sed -i "s/published: true/status: 'published', deletedAt: null/g" "$file"
    # Substituir published: false por status: 'draft', deletedAt: null
    sed -i "s/published: false/status: 'draft', deletedAt: null/g" "$file"
  fi
done

echo "✅ Correções aplicadas"
