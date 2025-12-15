'use client';

import { cn } from '@/lib/helpers';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({
    className,
    variant = 'rounded',
    width,
    height,
    animation = 'shimmer',
}: SkeletonProps) {
    const baseClasses = 'bg-gray-800';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-xl',
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-700 before:to-transparent',
        none: '',
    };

    const style = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
    };

    return (
        <div
            className={cn(baseClasses, variantClasses[variant], animationClasses[animation], className)}
            style={style}
        />
    );
}

// Pre-built skeleton components
export function TaskCardSkeleton() {
    return (
        <div className="bg-surface rounded-xl p-4 border border-gray-800">
            <div className="flex items-start gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1">
                    <Skeleton width="60%" height={20} className="mb-2" />
                    <Skeleton width="40%" height={14} />
                </div>
                <Skeleton width={60} height={24} />
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="bg-surface rounded-xl p-6 border border-gray-800">
            <div className="flex items-center gap-4 mb-4">
                <Skeleton variant="circular" width={64} height={64} />
                <div>
                    <Skeleton width={120} height={24} className="mb-2" />
                    <Skeleton width={80} height={16} />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Skeleton height={60} />
                <Skeleton height={60} />
                <Skeleton height={60} />
            </div>
        </div>
    );
}

export function LeaderboardSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-gray-800">
                    <Skeleton width={24} height={24} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <div className="flex-1">
                        <Skeleton width="50%" height={18} className="mb-1" />
                        <Skeleton width="30%" height={14} />
                    </div>
                    <Skeleton width={50} height={20} />
                </div>
            ))}
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface rounded-xl p-4 border border-gray-800">
                    <Skeleton width="60%" height={16} className="mb-2" />
                    <Skeleton width="40%" height={28} />
                </div>
            ))}
        </div>
    );
}

export default Skeleton;
