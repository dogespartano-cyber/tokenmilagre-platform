#!/bin/bash
echo "🔍 Verificando propagação DNS de tokenmilagre.xyz..."
echo ""
echo "IP atual:"
dig tokenmilagre.xyz +short
echo ""
echo "Esperado: 76.76.21.21"
echo ""
echo "Status:"
CURRENT_IP=$(dig tokenmilagre.xyz +short | head -1)
if [ "$CURRENT_IP" = "76.76.21.21" ]; then
  echo "✅ DNS propagado com sucesso!"
  echo "🌐 Acesse: https://tokenmilagre.xyz"
else
  echo "⏳ Ainda não propagou (atual: $CURRENT_IP)"
  echo "⏱️  Aguarde mais alguns minutos..."
fi
