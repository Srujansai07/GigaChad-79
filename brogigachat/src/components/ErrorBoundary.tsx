'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
        // TODO: Send to error reporting service
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[200px] flex flex-col items-center justify-center p-6 bg-surface rounded-xl border border-gray-800">
                    <AlertTriangle size={48} className="text-danger mb-4" />
                    <h2 className="text-lg font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-gray-400 text-sm text-center mb-4">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        <RefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Error message component
interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-xl text-center">
            <p className="text-danger text-sm mb-2">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-xs text-danger underline hover:no-underline"
                >
                    Try again
                </button>
            )}
        </div>
    );
}

// Inline error for forms
export function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-danger text-xs mt-1">{message}</p>;
}
