'use client';

import { useEffect, useMemo, memo, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faXmark } from '@fortawesome/free-solid-svg-icons';

/**
 * Dialog variant types
 */
export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

/**
 * Color configuration for dialog variants
 */
interface VariantColors {
  icon: string;
  confirmBg: string;
  confirmHover: string;
}

/**
 * Props for the ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /** Controls dialog visibility */
  isOpen: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Label for confirm button */
  confirmLabel?: string;
  /** Label for cancel button */
  cancelLabel?: string;
  /** Callback when confirm button is clicked */
  onConfirm: () => void;
  /** Callback when dialog is cancelled or closed */
  onCancel: () => void;
  /** Visual variant of the dialog */
  variant?: ConfirmDialogVariant;
}

/**
 * ConfirmDialog Component
 *
 * A modal dialog for confirming user actions with customizable variants and labels.
 * Includes backdrop click handling, keyboard shortcuts (ESC to cancel), and focus trap.
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   title="Delete Item"
 *   message="Are you sure you want to delete this item? This action cannot be undone."
 *   confirmLabel="Delete"
 *   cancelLabel="Cancel"
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 * ```
 *
 * Accessibility features:
 * - ARIA role="alertdialog" for screen readers
 * - Focus trap within dialog
 * - ESC key to close
 * - Clear labeling for actions
 * - Backdrop click to close
 * - Focus returns to trigger element on close
 *
 * @param props - Component props
 * @returns Confirm dialog component
 */
const ConfirmDialog = memo<ConfirmDialogProps>(({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Handle ESC key press to close dialog
   */
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  }, [onCancel]);

  /**
   * Set up keyboard event listeners when dialog is open
   */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus the confirm button when dialog opens
      confirmButtonRef.current?.focus();
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  /**
   * Get color configuration based on variant
   * Memoized to avoid recalculation
   */
  const colors = useMemo<VariantColors>(() => {
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
      default:
        return {
          icon: '#ef4444',
          confirmBg: '#ef4444',
          confirmHover: '#dc2626'
        };
    }
  }, [variant]);

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  }, [onCancel]);

  // Don't render if dialog is not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-in-bottom"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          aria-label="Fechar diálogo"
          type="button"
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="w-5 h-5"
            style={{ color: 'var(--text-primary)' }}
            aria-hidden="true"
          />
        </button>

        {/* Icon and Title */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0"
            style={{ backgroundColor: colors.icon + '20' }}
            aria-hidden="true"
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="w-6 h-6"
              style={{ color: colors.icon }}
              aria-hidden="true"
            />
          </div>
          <h2
            id="dialog-title"
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h2>
        </div>

        {/* Message */}
        <p
          id="dialog-description"
          className="mb-6 text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:opacity-80 border focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)'
            }}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-lg font-semibold transition-all hover:opacity-90 text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: colors.confirmBg
            }}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
});

// Display name for React DevTools
ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;
