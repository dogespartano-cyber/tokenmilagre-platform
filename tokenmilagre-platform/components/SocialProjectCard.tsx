'use client';

import Link from 'next/link';
import { Target, MapPin, CheckCircle2, TrendingUp, Users } from 'lucide-react';

interface SocialProjectCardProps {
  project: {
    slug: string;
    name: string;
    description: string;
    category: string;
    fundingGoal: number;
    currentFunding: number;
    currency: string;
    location?: string;
    verified: boolean;
    active: boolean;
    featured: boolean;
    supporters: number;
    coverImage?: string;
    startDate: string;
    endDate?: string;
  };
}

const categoryConfig = {
  donations: { label: 'Doações', color: 'bg-green-100 text-green-700' },
  microcredit: { label: 'Microcrédito', color: 'bg-blue-100 text-blue-700' },
  education: { label: 'Educação', color: 'bg-purple-100 text-purple-700' },
  infrastructure: { label: 'Infraestrutura', color: 'bg-orange-100 text-orange-700' },
};

const currencySymbol: Record<string, string> = {
  BRL: 'R$',
  USD: '$',
  MILAGRE: '⚡',
};

export default function SocialProjectCard({ project }: SocialProjectCardProps) {
  const config = categoryConfig[project.category as keyof typeof categoryConfig];
  const symbol = currencySymbol[project.currency] || project.currency;

  // Calcular progresso
  const progressPercentage = Math.min(
    (project.currentFunding / project.fundingGoal) * 100,
    100
  );

  // Verificar se está ativo e dentro do prazo
  const endDate = project.endDate ? new Date(project.endDate) : null;
  const isExpired = endDate && endDate < new Date();
  const daysLeft = endDate
    ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Link href={`/comunidade/projetos/${project.slug}`}>
      <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Badge de destaque */}
        {project.featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            ⭐ Destaque
          </div>
        )}

        {/* Imagem de capa */}
        <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 overflow-hidden">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Target className="w-16 h-16 text-white opacity-50" />
            </div>
          )}

          {/* Status badge */}
          {!project.active && (
            <div className="absolute top-4 left-4 bg-gray-800 text-white text-xs font-medium px-3 py-1 rounded-full">
              Encerrado
            </div>
          )}

          {isExpired && project.active && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full">
              Prazo expirado
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Categoria e verificação */}
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${config?.color}`}>
              {config?.label}
            </span>

            {project.verified && (
              <div className="flex items-center gap-1 text-blue-600 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verificado</span>
              </div>
            )}
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
            {project.name}
          </h3>

          {/* Descrição */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

          {/* Localização */}
          {project.location && (
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
          )}

          {/* Barra de progresso */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-gray-900">
                {symbol} {project.currentFunding.toLocaleString('pt-BR')}
              </span>
              <span className="text-gray-500">
                Meta: {symbol} {project.fundingGoal.toLocaleString('pt-BR')}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>{progressPercentage.toFixed(1)}% alcançado</span>
              {daysLeft !== null && daysLeft > 0 && (
                <span>{daysLeft} dias restantes</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{project.supporters} apoiadores</span>
            </div>

            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 group">
              Apoiar
              <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
