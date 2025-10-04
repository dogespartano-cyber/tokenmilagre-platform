/**
 * Gera slug amigável para SEO a partir de um título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início/fim
    .substring(0, 100); // Limita tamanho
}

/**
 * Gera ID único + slug para URL
 */
export function generateNewsId(title: string): { id: string; slug: string } {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  const slug = generateSlug(title);

  return {
    id,
    slug
  };
}

/**
 * Formata número com separadores de milhares
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}

/**
 * Formata data relativa (há X horas/dias)
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const published = new Date(date);
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Agora mesmo';
  if (diffHours < 24) return `Há ${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Há ${diffDays}d`;

  return published.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
