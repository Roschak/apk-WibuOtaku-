"use client";

import Link from 'next/link';

type ErrorUIProps = {
    /** Status code to display */
    code?: string;
    /** Main heading */
    title: string;
    /** Description text */
    description: string;
    /** Whether to show a retry button (for error boundaries) */
    showRetry?: boolean;
    /** Retry callback (from error.tsx) */
    onRetry?: () => void;
    /** Custom action label */
    actionLabel?: string;
    /** Custom action href */
    actionHref?: string;
    /** Emoji or icon */
    icon?: string;
};

const navLinks = [
    { label: 'Dashboard', href: '/' },
    { label: 'Anime', href: '/anime' },
    { label: 'Manga', href: '/manga' },
    { label: 'Light Novel', href: '/light-novel' },
    { label: 'Kalender', href: '/kalender' },
];

export function ErrorUI({
    code = '404',
    title,
    description,
    showRetry = false,
    onRetry,
    actionLabel = 'Kembali ke beranda',
    actionHref = '/',
    icon = '💫',
}: ErrorUIProps) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-lg text-center">
                {/* Animated code */}
                <div className="relative mb-2 animate-fade-in">
                    <div
                        className="font-display text-[140px] font-bold leading-none tracking-tight sm:text-[180px]"
                        style={{
                            background: `linear-gradient(135deg, var(--accent, #f7c35f) 0%, var(--accent-light, #fce8b0) 50%, var(--accent, #f7c35f) 100%)`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 0 40px var(--accent-glow, rgba(247,195,95,0.15)))',
                        }}
                    >
                        {code}
                    </div>
                    {/* Glitch overlay */}
                    <div
                        className="absolute inset-0 animate-pulse-glow"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, var(--accent-soft, rgba(247,195,95,0.08)), transparent 70%)`,
                            mixBlendMode: 'overlay',
                        }}
                        aria-hidden="true"
                    />
                </div>

                {/* Icon */}
                <div className="mb-4 animate-float text-4xl sm:text-5xl" aria-hidden="true">
                    {icon}
                </div>

                {/* Title */}
                <h1 className="animate-fade-in-up font-display text-3xl font-bold text-ink sm:text-4xl">
                    {title}
                </h1>

                {/* Description */}
                <p
                    className="animate-fade-in-up mx-auto mt-4 max-w-md text-sm leading-7 text-ink-secondary sm:text-base"
                    style={{ animationDelay: '80ms' }}
                >
                    {description}
                </p>

                {/* Action buttons */}
                <div
                    className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-3"
                    style={{ animationDelay: '160ms' }}
                >
                    <Link
                        href={actionHref}
                        className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#1a1a2e] shadow-lg shadow-accent/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent/40 active:scale-95"
                    >
                        <span aria-hidden="true">{icon}</span>
                        {actionLabel}
                    </Link>

                    {showRetry && onRetry && (
                        <button
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 rounded-full border border-btn-secondary bg-btn-secondary px-6 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-surface-hover hover:bg-surface-hover active:scale-95"
                        >
                            <span aria-hidden="true">🔄</span>
                            Coba lagi
                        </button>
                    )}
                </div>

                {/* Quick nav links */}
                <div
                    className="animate-fade-in-up mx-auto mt-10 max-w-sm border-t border-surface pt-6"
                    style={{ animationDelay: '240ms' }}
                >
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
                        Atau langsung ke:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="rounded-full border border-tag bg-tag px-3 py-1.5 text-xs text-ink-tertiary transition-all duration-200 hover:border-surface-hover hover:bg-surface-hover hover:text-ink"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
