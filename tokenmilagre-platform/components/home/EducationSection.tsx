/**
 * Seção de Educação da Homepage
 */

'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faSeedling, faGraduationCap, faRocket, faClock } from '@fortawesome/free-solid-svg-icons';

interface EducationItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: string;
  readTime: string;
}

interface Props {
  articles: EducationItem[];
  loading?: boolean;
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'iniciante':
      return faSeedling;
    case 'intermediario':
      return faGraduationCap;
    case 'avancado':
      return faRocket;
    default:
      return faGraduationCap;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'iniciante':
      return 'text-green-500';
    case 'intermediario':
      return 'text-yellow-500';
    case 'avancado':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getLevelLabel = (level: string) => {
  switch (level) {
    case 'iniciante':
      return 'Iniciante';
    case 'intermediario':
      return 'Intermediário';
    case 'avancado':
      return 'Avançado';
    default:
      return level;
  }
};

export default function EducationSection({ articles, loading }: Props) {
  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Educação Cripto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-[var(--bg-secondary)] rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[var(--bg-primary)]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Educação Cripto
          </h2>
          <Link
            href="/educacao"
            className="text-[var(--brand-primary)] hover:text-[var(--brand-hover)] flex items-center gap-2 transition-colors"
          >
            Ver todos <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.slice(0, 2).map((article) => (
            <Link
              key={article.id}
              href={`/educacao/${article.slug}`}
              className="block bg-[var(--bg-secondary)] rounded-xl p-8 border border-[var(--border-light)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={getLevelIcon(article.level)}
                  className={`w-5 h-5 ${getLevelColor(article.level)}`}
                />
                <span className={`text-sm font-medium ${getLevelColor(article.level)}`}>
                  {getLevelLabel(article.level)}
                </span>
                <span className="text-[var(--text-tertiary)] text-sm flex items-center gap-1">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                {article.title}
              </h3>

              <p className="text-[var(--text-secondary)] line-clamp-3">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
