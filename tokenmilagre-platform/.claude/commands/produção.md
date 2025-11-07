# Deploy para Produção

Você foi solicitado a fazer deploy direto para produção no Vercel.

## Etapas a executar:

1. **Verificar branch atual** (`git branch --show-current`)
2. **Verificar arquivos modificados** (`git status`)
3. **Validar que não há arquivos externos ao projeto** (verificar se todos estão dentro de tokenmilagre-platform/)
4. **Verificar se schema.prisma está commitado** (se foi modificado)
5. **Fazer checkout para main** (`git checkout main`)
6. **Merge da branch atual para main** (`git merge [branch-preview] --no-edit`)
7. **Push para origin/main** (`git push origin main`)
8. **Confirmar sucesso**: "✅ Deploy enviado para produção no Vercel"

## ⚠️ VERIFICAÇÕES CRÍTICAS:

- ✅ NUNCA incluir arquivos fora de `tokenmilagre-platform/`
- ✅ Se `prisma/schema.prisma` foi modificado, DEVE estar commitado
- ✅ Verificar que não há mudanças em `../.gitignore` sendo commitadas
- ✅ Confirmar que todos os arquivos são do projeto

## 📋 Output esperado:

Ao final, mostrar:
- Branch atual (deve ser `main`)
- Último commit em produção
- Confirmação de push bem-sucedido
- URL para acompanhar deploy no Vercel (https://vercel.com/dashboard)
