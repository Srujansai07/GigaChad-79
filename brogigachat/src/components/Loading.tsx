'use client';

// Loading Spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`${sizes[size]} animate-spin`}>
            <svg className="w-full h-full" viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}

// Full page loading
export function LoadingPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="text-4xl mb-4 animate-pulse">ðŸ”¥</div>
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 mt-4">Loading...</p>
            </div>
        </div>
    );
}

// Skeleton components
export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
        </div>
    );
}

export function SkeletonTask() {
    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800 flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonTask key={i} />
            ))}
        </div>
    );
}

export function SkeletonProfile() {
    return (
        <div className="bg-surface rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="text-center">
                        <Skeleton className="h-8 w-16 mx-auto mb-2" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Loading button state
export function LoadingButton({
    loading,
    children,
    disabled,
    className = '',
    ...props
}: {
    loading?: boolean;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    [key: string]: any;
}) {
    return (
        <button
            disabled={loading || disabled}
            className={`flex items-center justify-center gap-2 ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            {...props}
        >
            {loading && <LoadingSpinner size="sm" />}
            {children}
        </button>
    );
}
