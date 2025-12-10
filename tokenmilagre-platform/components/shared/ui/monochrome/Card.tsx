/**
 * Card Component - Sem Roxo
 *
 * Card genérico para conteúdo
 * - Sombra sutil
 * - Border-radius 8px
 * - Máximo 320px de largura para versões de destaque
 *
 * Acessibilidade:
 * - Marcação semântica
 * - Hover/focus states
 */

'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'featured';
  maxWidth?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

export default function Card({
  children,
  variant = 'default',
  maxWidth,
  padding = 'md',
  hover = false,
  className = ''
}: CardProps) {
  return (
    <>
      <style jsx>{`
        .card {
          background-color: var(--bg-card);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .card-default {
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-sm);
        }

        .card-elevated {
          border: none;
          box-shadow: var(--shadow-md);
        }

        .card-outlined {
          border: 2px solid var(--border-medium);
          box-shadow: none;
        }

        .card-featured {
          border: 1px solid var(--border-light);
          box-shadow: var(--shadow-lg);
          max-width: 320px;
        }

        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .card-hover:focus-within {
          outline: 2px solid var(--border-focus);
          outline-offset: 2px;
        }

        .card-padding-sm {
          padding: 1rem;
        }

        .card-padding-md {
          padding: 1.5rem;
        }

        .card-padding-lg {
          padding: 2rem;
        }

        @media (min-width: 768px) {
          .card-padding-lg {
            padding: 2.5rem;
          }
        }
      `}</style>

      <div
        className={`card card-${variant} card-padding-${padding} ${hover ? 'card-hover' : ''} ${className}`}
        style={maxWidth ? { maxWidth } : undefined}
      >
        {children}
      </div>
    </>
  );
}

/**
 * CardHeader - Cabeçalho do card
 */
interface CardHeaderProps {
  children: ReactNode;
  icon?: ReactNode;
  iconColor?: string;
}

export function CardHeader({ children, icon, iconColor = 'var(--color-accent)' }: CardHeaderProps) {
  return (
    <>
      <style jsx>{`
        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .card-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background-color: var(--icon-bg);
        }
      `}</style>

      <div className="card-header">
        {icon && (
          <div className="card-icon" style={{ backgroundColor: iconColor, color: 'white' }}>
            {icon}
          </div>
        )}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </>
  );
}

/**
 * CardTitle - Título do card
 */
interface CardTitleProps {
  children: ReactNode;
  as?: 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, as = 'h3' }: CardTitleProps) {
  const Tag = as;

  return (
    <>
      <style jsx>{`
        .card-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: var(--line-height-tight);
          margin: 0 0 0.5rem 0;
        }

        h2.card-title {
          font-size: 1.5rem;
        }

        h4.card-title {
          font-size: 1.125rem;
        }
      `}</style>

      <Tag className="card-title">{children}</Tag>
    </>
  );
}

/**
 * CardContent - Conteúdo do card
 */
interface CardContentProps {
  children: ReactNode;
}

export function CardContent({ children }: CardContentProps) {
  return (
    <>
      <style jsx>{`
        .card-content {
          font-family: var(--font-sans);
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: var(--line-height-relaxed);
        }
      `}</style>

      <div className="card-content">{children}</div>
    </>
  );
}

/**
 * CardFooter - Rodapé do card
 */
interface CardFooterProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
}

export function CardFooter({ children, align = 'left' }: CardFooterProps) {
  return (
    <>
      <style jsx>{`
        .card-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
        }

        .align-left {
          text-align: left;
        }

        .align-center {
          text-align: center;
        }

        .align-right {
          text-align: right;
        }
      `}</style>

      <div className={`card-footer align-${align}`}>{children}</div>
    </>
  );
}
