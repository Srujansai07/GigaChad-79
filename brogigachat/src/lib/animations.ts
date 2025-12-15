// Animation utilities for BroGigaChad
// CSS-in-JS animation helpers

export const animations = {
    // Fade animations
    fadeIn: 'animate-[fadeIn_0.3s_ease-out]',
    fadeOut: 'animate-[fadeOut_0.3s_ease-out]',

    // Slide animations
    slideInUp: 'animate-[slideInUp_0.3s_ease-out]',
    slideInDown: 'animate-[slideInDown_0.3s_ease-out]',
    slideInLeft: 'animate-[slideInLeft_0.3s_ease-out]',
    slideInRight: 'animate-[slideInRight_0.3s_ease-out]',

    // Scale animations
    scaleIn: 'animate-[scaleIn_0.2s_ease-out]',
    scaleOut: 'animate-[scaleOut_0.2s_ease-out]',

    // Bounce and shake
    bounce: 'animate-bounce',
    shake: 'animate-[shake_0.5s_ease-in-out]',

    // Pulse effects
    pulse: 'animate-pulse',
    glow: 'animate-[glow_2s_ease-in-out_infinite]',

    // Special effects
    confetti: 'animate-[confetti_1s_ease-out]',
    celebration: 'animate-[celebration_0.6s_ease-out]',
    shimmer: 'animate-[shimmer_2s_infinite]',
} as const;

// Keyframe definitions for tailwind.config.js
export const keyframes = {
    fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
    },
    fadeOut: {
        '0%': { opacity: '1' },
        '100%': { opacity: '0' },
    },
    slideInUp: {
        '0%': { transform: 'translateY(10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideInDown: {
        '0%': { transform: 'translateY(-10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    slideInLeft: {
        '0%': { transform: 'translateX(-10px)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    slideInRight: {
        '0%': { transform: 'translateX(10px)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
    },
    scaleIn: {
        '0%': { transform: 'scale(0.95)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
    },
    scaleOut: {
        '0%': { transform: 'scale(1)', opacity: '1' },
        '100%': { transform: 'scale(0.95)', opacity: '0' },
    },
    shake: {
        '0%, 100%': { transform: 'translateX(0)' },
        '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
        '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
    },
    glow: {
        '0%, 100%': { boxShadow: '0 0 5px var(--primary)' },
        '50%': { boxShadow: '0 0 20px var(--primary), 0 0 30px var(--primary)' },
    },
    shimmer: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
    },
    celebration: {
        '0%': { transform: 'scale(1)' },
        '25%': { transform: 'scale(1.1) rotate(-5deg)' },
        '50%': { transform: 'scale(1.2)' },
        '75%': { transform: 'scale(1.1) rotate(5deg)' },
        '100%': { transform: 'scale(1)' },
    },
    confetti: {
        '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
        '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
    },
};

// Transition presets
export const transitions = {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-300 ease-out',
    slow: 'transition-all duration-500 ease-out',
    spring: 'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
} as const;

// Motion preferences check
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Get animation class with reduced motion support
export function getAnimation(
    animation: keyof typeof animations,
    respectReducedMotion = true
): string {
    if (respectReducedMotion && prefersReducedMotion()) {
        return '';
    }
    return animations[animation];
}
