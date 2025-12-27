'use client';

import Link from 'next/link';
import { Heart, CheckCircle2, TrendingUp, Award, Users } from 'lucide-react';

interface CommunityStoryCardProps {
  story: {
    slug: string;
    title: string;
    content: string;
    category: string;
    authorName: string;
    authorAvatar?: string;
    likes: number;
    verified: boolean;
    featured: boolean;
    createdAt: string;
    user?: {
      name: string;
      image?: string;
      points?: number;
      badges?: string;
    };
  };
}

const categoryConfig = {
  transformation: {
    label: 'Transformação',
    icon: TrendingUp,
    color: ' bg-green-50 dark:bg-green-900/30',
  },
  social_project: {
    label: 'Projeto Social',
    icon: Users,
    color: ' bg-blue-50 dark:bg-blue-900/30',
  },
  achievement: {
    label: 'Conquista',
    icon: Award,
    color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30',
  },
};

export default function CommunityStoryCard({ story }: CommunityStoryCardProps) {
  const config = categoryConfig[story.category as keyof typeof categoryConfig];
  const Icon = config?.icon || TrendingUp;

  // Extrair resumo (primeiros 150 caracteres)
  const excerpt = story.content.substring(0, 150) + '...';

  return (
    <Link href={`/comunidade/historias/${story.slug}`}>
      <div className="group relative rounded-lg border transition-all duration-300 p-6 bg-[var(--bg-secondary)] border-[var(--border-light)] hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-lg">
        {/* Badge de destaque */}
        {story.featured && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            ⭐ Destaque
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold overflow-hidden">
              {story.authorAvatar || story.user?.image ? (
                <img
                  src={story.authorAvatar || story.user?.image}
                  alt={story.authorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                story.authorName.charAt(0).toUpperCase()
              )}
            </div>

            {/* Nome e pontos */}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[var(--text-primary)]">{story.authorName}</p>
                {story.verified && (
                  <CheckCircle2 className="w-4 h-4 dark:" aria-label="Verificado" />
                )}
              </div>
              {story.user?.points !== undefined && (
                <p className="text-xs text-[var(--text-tertiary)]">{story.user.points} pontos</p>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
            <Icon className="w-3 h-3" />
            {config?.label}
          </div>
        </div>

        {/* Título */}
<h3 className="title-newtab text-xl mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {story.title}
        </h3>

        {/* Resumo */}
        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-light)]">
          <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
            <Heart className="w-4 h-4" />
            <span className="text-sm">{story.likes} curtidas</span>
          </div>

          <span className="text-xs text-[var(--text-muted)]">
            {new Date(story.createdAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </Link>
  );
}
