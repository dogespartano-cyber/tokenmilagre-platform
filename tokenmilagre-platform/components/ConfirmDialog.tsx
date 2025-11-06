'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faXmark } from '@fortawesome/free-solid-svg-icons';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantColors = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: '#ef4444',
          confirmBg: '#ef4444',
          confirmHover: '#dc2626'
        };
      case 'warning':
        return {
          icon: '#f59e0b',
          confirmBg: '#f59e0b',
          confirmHover: '#d97706'
        };
      case 'info':
        return {
          icon: '#3b82f6',
          confirmBg: '#3b82f6',
          confirmHover: '#2563eb'
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="relative rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-in-bottom"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Fechar"
        >
          <FontAwesomeIcon icon={faXmark} className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </button>

        {/* Icon */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full"
            style={{ backgroundColor: colors.icon + '20' }}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-6 h-6"
              style={{ color: colors.icon }}
            />
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="mb-6 text-base" style={{ color: 'var(--text-secondary)' }}>
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:opacity-80 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:opacity-90 text-white"
            style={{
              backgroundColor: colors.confirmBg
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
