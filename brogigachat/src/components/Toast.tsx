'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast types
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).slice(2);
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);

        // Auto remove after duration
        const duration = toast.duration ?? 4000;
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const success = (title: string, message?: string) => addToast({ type: 'success', title, message });
    const error = (title: string, message?: string) => addToast({ type: 'error', title, message });
    const info = (title: string, message?: string) => addToast({ type: 'info', title, message });
    const warning = (title: string, message?: string) => addToast({ type: 'warning', title, message });

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

// Toast Container
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

// Individual Toast
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const icons = {
        success: <CheckCircle className="text-success" size={20} />,
        error: <AlertCircle className="text-danger" size={20} />,
        info: <Info className="text-blue-400" size={20} />,
        warning: <AlertTriangle className="text-warning" size={20} />,
    };

    const colors = {
        success: 'border-success/30 bg-success/10',
        error: 'border-danger/30 bg-danger/10',
        info: 'border-blue-400/30 bg-blue-400/10',
        warning: 'border-warning/30 bg-warning/10',
    };

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm animate-slide-in ${colors[toast.type]}`}
        >
            {icons[toast.type]}
            <div className="flex-1">
                <p className="font-medium text-white">{toast.title}</p>
                {toast.message && <p className="text-sm text-gray-400 mt-1">{toast.message}</p>}
            </div>
            <button onClick={() => onRemove(toast.id)} className="p-1 hover:bg-white/10 rounded">
                <X size={16} className="text-gray-400" />
            </button>
        </div>
    );
}
