'use client';

import { useState, useCallback } from 'react';
import { ToastType } from '@/components/shared/Toast';

interface ToastData {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const show = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: ToastData = { id, type, message, duration };

        setToasts((prev) => [...prev, newToast]);

        return id;
    }, []);

    const success = useCallback((message: string, duration?: number) => {
        return show('success', message, duration);
    }, [show]);

    const error = useCallback((message: string, duration?: number) => {
        return show('error', message, duration);
    }, [show]);

    const warning = useCallback((message: string, duration?: number) => {
        return show('warning', message, duration);
    }, [show]);

    const info = useCallback((message: string, duration?: number) => {
        return show('info', message, duration);
    }, [show]);

    const close = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const closeAll = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        show,
        success,
        error,
        warning,
        info,
        close,
        closeAll
    };
}
