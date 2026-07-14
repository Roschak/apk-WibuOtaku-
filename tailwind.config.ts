import type { Config } from 'tailwindcss';

const config = {
    darkMode: 'class',
    content: ['./src/**/*.{ts,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                ink: 'var(--foreground)',
                'ink-secondary': 'var(--text-secondary)',
                'ink-tertiary': 'var(--text-tertiary)',
                'ink-muted': 'var(--text-muted)',
                'ink-low': 'var(--text-low)',
                mist: 'var(--foreground-secondary)',
                surface: 'var(--panel-bg)',
                'surface-hover': 'var(--panel-hover-bg)',
                panel: 'var(--panel-bg)',
                line: 'var(--panel-border)',
                'line-hover': 'var(--panel-hover-border)',
                card: 'var(--card-bg)',
                tag: 'var(--tag-bg)',
                'tag-border': 'var(--tag-border)',
                nav: 'var(--nav-bg)',
                'nav-border': 'var(--nav-border)',
                'btn-secondary': 'var(--btn-secondary-bg)',
                'btn-secondary-border': 'var(--btn-secondary-border)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    soft: 'var(--accent-soft)',
                    light: 'var(--accent-light)',
                    dark: 'var(--accent-dark)',
                },
            },
            boxShadow: {
                halo: 'var(--shadow-halo)',
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