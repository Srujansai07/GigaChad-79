import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // BroGigaChat Brand Colors
                background: '#0A0A0A',
                surface: '#1F1F1F',
                'surface-alt': '#2A2A2A',
                primary: '#DC2626',
                'primary-hover': '#B91C1C',
                aura: '#EAB308',
                streak: '#EA580C',
                success: '#22C55E',
                warning: '#FBBF24',
                danger: '#EF4444',
                // Level colors
                rookie: '#9CA3AF',
                grinder: '#3B82F6',
                hustler: '#A855F7',
                alpha: '#EAB308',
                sigma: '#EF4444',
                topg: '#F97316',
                legend: '#F472B6',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-fast': 'pulse 0.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
