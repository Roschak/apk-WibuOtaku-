import type { Config } from 'tailwindcss';

const config = {
    content: ['./src/**/*.{ts,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                ink: 'var(--foreground)',
                mist: 'var(--muted)',
                panel: 'var(--panel)',
                line: 'var(--line)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    soft: 'var(--accent-soft)',
                },
            },
            boxShadow: {
                halo: '0 24px 80px rgba(0, 0, 0, 0.32)',
            },
            fontFamily: {
                sans: ['var(--font-body)'],
                display: ['var(--font-display)'],
            },
            backgroundImage: {
                'hero-grid': 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            },
        },
    },
    plugins: [],
} satisfies Config;

export default config;