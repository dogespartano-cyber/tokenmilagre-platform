# Política de Segurança

## Versões Suportadas

| Versão | Suportada          |
| ------ | ------------------ |
| main   | :white_check_mark: |

## Reportando Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança, **NÃO** abra uma issue pública.

### Como Reportar

1. **Email**: Envie um email para [dogespartano@proton.me](mailto:dogespartano@proton.me)
2. **Assunto**: `[SECURITY] Descrição breve da vulnerabilidade`
3. **Conteúdo**: Inclua:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

### O Que Esperar

- **Confirmação**: Responderemos em até 48 horas confirmando recebimento
- **Investigação**: Analisaremos o relatório em até 7 dias
- **Correção**: Se confirmada, trabalharemos na correção
- **Crédito**: Você será creditado na correção (se desejar)

### Escopo

Vulnerabilidades em escopo incluem:

- Autenticação/Autorização bypass
- Injeção (SQL, XSS, etc.)
- Exposição de dados sensíveis
- Vulnerabilidades em dependências

### Fora de Escopo

- Ataques de força bruta
- Engenharia social
- Vulnerabilidades em serviços de terceiros (Clerk, Vercel, etc.)

## Práticas de Segurança

Este projeto implementa:

- ✅ Autenticação via Clerk (OAuth2/OIDC)
- ✅ Rate limiting via Upstash Redis
- ✅ Validação de entrada com Zod
- ✅ Proteção CSRF automática (Next.js)
- ✅ Headers de segurança

Obrigado por ajudar a manter $MILAGRE seguro! 🔐
