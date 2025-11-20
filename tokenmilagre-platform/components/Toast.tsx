'use client';

import { useEffect, useMemo, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * Available toast notification types
 * - success: Indicates successful operation
 * - error: Indicates error or failure
 * - info: Provides informational message
 * - warning: Indicates warning or caution
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Color configuration for toast variants
 */
interface ToastColors {
  bg: string;
  border: string;
  text: string;
  icon: string;
}

/**
 * Props for the Toast component
 */
export interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Type of toast notification */
  type: ToastType;
  /** Message to display in the toast */
  message: string;
  /** Duration in milliseconds before auto-close (0 to disable) */
  duration?: number;
  /** Callback function when toast is closed */
  onClose: (id: string) => void;
}

/**
 * Toast Component
 *
 * Displays a temporary notification message with various types (success, error, info, warning).
 * Automatically dismisses after a specified duration and provides a manual close button.
 *
 * @example
 * ```tsx
 * <Toast
 *   id="toast-1"
 *   type="success"
 *   message="Operation completed successfully!"
 *   duration={5000}
 *   onClose={(id) => console.log('Toast closed:', id)}
 * />
 * ```
 *
 * Accessibility features:
 * - ARIA role="alert" for screen readers (implicitly through live region)
 * - Clear close button with aria-label
 * - High contrast color combinations
 * - Keyboard accessible close button
 *
 * @param props - Component props
 * @returns Toast notification component
 */
const Toast = memo<ToastProps>(({ id, type, message, duration = 5000, onClose }) => {
  // Auto-close timer effect
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  /**
   * Get the appropriate icon for the toast type
   */
  const icon = useMemo<IconDefinition>(() => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  }, [type]);

  /**
   * Get color configuration for the toast type
   * Memoized to avoid recalculation on every render
   */
  const colors = useMemo<ToastColors>(() => {
    switch (type) {
      case 'success':
        return {
          bg: '#d1fae5',
          border: '#10b981',
          text: '#065f46',
          icon: '#10b981'
        };
      case 'error':
        return {
          bg: '#fee2e2',
          border: '#ef4444',
          text: '#991b1b',
          icon: '#ef4444'
        };
      case 'warning':
        return {
          bg: '#fef3c7',
          border: '#f59e0b',
          text: '#92400e',
          icon: '#f59e0b'
        };
      case 'info':
        return {
          bg: '#dbeafe',
          border: '#3b82f6',
          text: '#1e40af',
          icon: '#3b82f6'
        };
      default:
        return {
          bg: '#dbeafe',
          border: '#3b82f6',
          text: '#1e40af',
          icon: '#3b82f6'
        };
    }
  }, [type]);

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in-right min-w-[300px] max-w-md"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text
      }}
    >
      {/* Icon */}
      <FontAwesomeIcon
        icon={icon}
        className="w-5 h-5 mt-0.5 flex-shrink-0"
        style={{ color: colors.icon }}
        aria-hidden="true"
      />

      {/* Message */}
      <p className="flex-1 font-medium text-sm">{message}</p>

      {/* Close button */}
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
        aria-label="Fechar notificação"
        type="button"
      >
        <FontAwesomeIcon icon={faXmark} className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
});

// Display name for React DevTools
Toast.displayName = 'Toast';

export default Toast;
