'use client';

import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faInfoCircle, faXmark } from '@fortawesome/free-solid-svg-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationTriangle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
    }
  };

  const getColors = () => {
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
    }
  };

  const colors = getColors();

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-slide-in-right min-w-[300px] max-w-md"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text
      }}
    >
      <FontAwesomeIcon
        icon={getIcon()}
        className="w-5 h-5 mt-0.5 flex-shrink-0"
        style={{ color: colors.icon }}
      />
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Fechar"
      >
        <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
      </button>
    </div>
  );
}
