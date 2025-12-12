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
 * Style configuration for toast variants (Tailwind classes)
 */
interface ToastStyles {
  container: string;
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
   * Get Tailwind classes for the toast type
   * Uses CSS variables and Tailwind dark: prefix for theme compatibility
   */
  const styles = useMemo<ToastStyles>(() => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-800 dark:text-green-200',
          icon: 'text-green-500 dark:text-green-400'
        };
      case 'error':
        return {
          container: 'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-800 dark:text-red-200',
          icon: 'text-red-500 dark:text-red-400'
        };
      case 'warning':
        return {
          container: 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 dark:border-amber-600 text-amber-800 dark:text-amber-200',
          icon: 'text-amber-500 dark:text-amber-400'
        };
      case 'info':
        return {
          container: 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600 text-blue-800 dark:text-blue-200',
          icon: 'text-blue-500 dark:text-blue-400'
        };
      default:
        return {
          container: 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600 text-blue-800 dark:text-blue-200',
          icon: 'text-blue-500 dark:text-blue-400'
        };
    }
  }, [type]);

  return (
    <div
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in-right min-w-[300px] max-w-md ${styles.container}`}
    >
      {/* Icon */}
      <FontAwesomeIcon
        icon={icon}
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.icon}`}
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
