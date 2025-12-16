import React from 'react';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({
    className = '',
    width,
    height,
    variant = 'rectangular'
}: SkeletonProps) {

    const baseStyles = "bg-surface-alt animate-pulse-subtle";
    const variantStyles = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
    };

    const style = {
        width: width,
        height: height,
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
}
