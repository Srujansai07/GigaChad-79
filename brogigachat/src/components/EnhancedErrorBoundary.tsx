'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export default class EnhancedErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        // Log to analytics/error tracking
        console.error('Error Boundary Caught:', error, errorInfo);

        // Could send to external service
        // logErrorToService(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-surface rounded-2xl p-6 border border-gray-800 text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-danger" />
                        </div>

                        {/* Title */}
                        <h1 className="text-xl font-bold text-white mb-2">
                            Something Went Wrong
                        </h1>
                        <p className="text-gray-400 mb-6">
                            Don't worry bro, even TopGs hit roadblocks. Let's get back on track.
                        </p>

                        {/* Error Details (Collapsible) */}
                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer hover:text-gray-300">
                                    <Bug size={14} />
                                    Technical Details
                                </summary>
                                <div className="mt-2 p-3 bg-gray-800 rounded-lg text-xs font-mono text-gray-400 overflow-auto max-h-32">
                                    {this.state.error.message}
                                </div>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={this.handleGoHome}
                                className="flex-1 py-3 bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
                            >
                                <Home size={18} />
                                Go Home
                            </button>
                            <button
                                onClick={this.handleRetry}
                                className="flex-1 py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
