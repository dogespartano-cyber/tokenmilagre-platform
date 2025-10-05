'use client';

import { ReactNode, CSSProperties } from 'react';

interface ThemeCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  gradient?: boolean;
}

export function ThemeCard({ children, className = '', variant = 'primary', gradient = false }: ThemeCardProps) {
  const getCardStyle = (): CSSProperties => {
    const baseStyle: CSSProperties = {
      backgroundColor: 'var(--bg-elevated)',
      borderColor: 'var(--border-medium)',
      color: 'var(--text-primary)'
    };

    if (gradient) {
      switch (variant) {
        case 'success':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, var(--success-bg), var(--bg-elevated))',
            borderColor: 'var(--success-border)'
          };
        case 'error':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, var(--error-bg), var(--bg-elevated))',
            borderColor: 'var(--error-border)'
          };
        case 'warning':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, var(--warning-bg), var(--bg-elevated))',
            borderColor: 'var(--warning-border)'
          };
        case 'info':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, var(--info-bg), var(--bg-elevated))',
            borderColor: 'var(--info-border)'
          };
        default:
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, var(--brand-bg), var(--bg-elevated))',
            borderColor: 'var(--brand-border)'
          };
      }
    }

    return baseStyle;
  };

  return (
    <div className={className} style={getCardStyle()}>
      {children}
    </div>
  );
}

interface ThemeTextProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'success' | 'error' | 'warning' | 'info' | 'brand';
  className?: string;
}

export function ThemeText({ children, variant = 'primary', className = '' }: ThemeTextProps) {
  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary': return 'var(--text-secondary)';
      case 'tertiary': return 'var(--text-tertiary)';
      case 'muted': return 'var(--text-muted)';
      case 'success': return 'var(--success)';
      case 'error': return 'var(--error)';
      case 'warning': return 'var(--warning)';
      case 'info': return 'var(--info)';
      case 'brand': return 'var(--brand-primary)';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <span className={className} style={{ color: getTextColor() }}>
      {children}
    </span>
  );
}
