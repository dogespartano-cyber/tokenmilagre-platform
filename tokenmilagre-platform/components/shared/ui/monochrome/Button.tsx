/**
 * Button Component - Sem Roxo
 *
 * Botão CTA com variantes primary (verde) e secondary (azul-escuro)
 * - Border-radius 8px
 * - Padding confortável
 * - Estados hover/focus/active
 * - Transições suaves (150ms)
 * - Ícones opcionais inline (SVG)
 *
 * Acessibilidade:
 * - Focus visível com outline
 * - Estados interativos claros
 * - Contraste WCAG AA
 */

'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  href?: string;
  external?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  fullWidth = false,
  loading = false,
  href,
  external = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${className}`;

  const content = (
    <>
      {loading && <span className="btn-spinner"></span>}
      {icon && iconPosition === 'left' && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="btn-icon">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <>
        <Styles />
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={baseClasses}
            aria-disabled={disabled}
          >
            {content}
          </a>
        ) : (
          <Link href={href} className={baseClasses} aria-disabled={disabled}>
            {content}
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      <Styles />
      <button
        className={baseClasses}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    </>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-family: var(--font-sans);
        font-weight: 600;
        text-decoration: none;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        position: relative;
        white-space: nowrap;
      }

      .btn:disabled,
      .btn[aria-disabled="true"] {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Sizes */
      .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }

      .btn-md {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.125rem;
      }

      .btn-full-width {
        width: 100%;
      }

      /* Primary - Accent Green */
      .btn-primary {
        background-color: var(--color-accent);
        color: white;
        box-shadow: var(--shadow-sm);
      }

      .btn-primary:hover:not(:disabled) {
        background-color: var(--color-accent-hover);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }

      .btn-primary:focus-visible {
        outline: 3px solid var(--color-accent);
        outline-offset: 2px;
      }

      .btn-primary:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: var(--shadow-sm);
      }

      /* Secondary - Primary Blue */
      .btn-secondary {
        background-color: var(--color-primary);
        color: white;
        box-shadow: var(--shadow-sm);
      }

      .btn-secondary:hover:not(:disabled) {
        background-color: var(--color-primary-hover);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }

      .btn-secondary:focus-visible {
        outline: 3px solid var(--color-primary);
        outline-offset: 2px;
      }

      .btn-secondary:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: var(--shadow-sm);
      }

      /* Outline */
      .btn-outline {
        background-color: transparent;
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
      }

      .btn-outline:hover:not(:disabled) {
        background-color: var(--color-primary);
        color: white;
        transform: translateY(-1px);
      }

      .btn-outline:focus-visible {
        outline: 3px solid var(--color-primary);
        outline-offset: 2px;
      }

      .btn-outline:active:not(:disabled) {
        transform: translateY(0);
      }

      /* Ghost */
      .btn-ghost {
        background-color: transparent;
        color: var(--color-accent);
        border: none;
      }

      .btn-ghost:hover:not(:disabled) {
        background-color: var(--color-accent-lighter);
      }

      .btn-ghost:focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      /* Icon */
      .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.25em;
        height: 1.25em;
      }

      .btn-icon svg {
        width: 100%;
        height: 100%;
      }

      /* Loading Spinner */
      .btn-spinner {
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: btn-spin 0.6s linear infinite;
      }

      @keyframes btn-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  );
}

/**
 * ButtonGroup - Agrupa múltiplos botões
 */
interface ButtonGroupProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  vertical?: boolean;
}

export function ButtonGroup({ children, align = 'left', vertical = false }: ButtonGroupProps) {
  return (
    <>
      <style jsx>{`
        .btn-group {
          display: flex;
          gap: 1rem;
        }

        .btn-group-horizontal {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .btn-group-vertical {
          flex-direction: column;
        }

        .btn-group-align-left {
          justify-content: flex-start;
        }

        .btn-group-align-center {
          justify-content: center;
        }

        .btn-group-align-right {
          justify-content: flex-end;
        }
      `}</style>

      <div className={`btn-group ${vertical ? 'btn-group-vertical' : 'btn-group-horizontal'} btn-group-align-${align}`}>
        {children}
      </div>
    </>
  );
}
