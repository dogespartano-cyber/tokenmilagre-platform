/**
 * Re-export para compatibilidade
 * 
 * NOTA: Este arquivo foi refatorado!
 * O código agora está em hooks/admin-chat/
 * 
 * Este arquivo mantém compatibilidade com imports existentes:
 * import { useAdminChat } from '@/hooks/useAdminChat'
 * 
 * Novo import recomendado:
 * import { useAdminChat } from '@/hooks/admin-chat'
 * 
 * @agi-migration: hooks/useAdminChat.ts → hooks/admin-chat/
 * @agi-status: LEGACY_RE_EXPORT
 */

export {
  useAdminChat,
  type ChatMessage,
  type UseAdminChatOptions,
  type UseAdminChatReturn
} from '@/lib/domains/admin-chat';
