"use client";

import { useState } from 'react';

import type { AccentColor } from '@/lib/theme-context';
import { useTheme } from '@/lib/theme-context';

const ACCENT_SWATCHES: { color: AccentColor; fill: string }[] = [
    { color: 'gold', fill: '#f7c35f' },
    { color: 'blue', fill: '#63b3ed' },
    { color: 'rose', fill: '#f472b6' },
    { color: 'emerald', fill: '#34d399' },
    { color: 'purple', fill: '#a78bfa' },
    { color: 'cyan', fill: '#22d3ee' },
    { color: 'pink', fill: '#f9a8d4' },
    { color: 'orange', fill: '#fb923c' },
];

export function ThemeToggle() {
    const { theme, accent, toggleTheme, setAccent } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/62 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white/80 active:scale-95"
                aria-label="Pengaturan tema"
            >
                {/* Theme icon */}
                <span className="text-sm leading-none" aria-hidden="true">
                    {theme === 'dark' ? '🌙' : '☀️'}
                </span>

                {/* Accent dot */}
                <span
                    className="h-2.5 w-2.5 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: `var(--accent, ${ACCENT_SWATCHES.find(s => s.color === accent)?.fill})` }}
                    aria-hidden="true"
                />

                <span className="hidden sm:inline">Tema</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full z-50 mt-2 w-72 animate-fade-in-up origin-top-right rounded-2xl border border-white/10 bg-[#0f1a2e]/95 p-5 shadow-halo backdrop-blur-2xl">
                        <div className="space-y-5">
                            {/* Dark/Light Toggle */}
                            <div>
                                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/46">
                                    Mode tampilan
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            if (theme !== 'dark') toggleTheme();
                                        }}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                                            theme === 'dark'
                                                ? 'border-accent-soft bg-accent-soft text-accent'
                                                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
                                        }`}
                                    >
                                        <span aria-hidden="true">🌙</span>
                                        <span>Gelap</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (theme !== 'light') toggleTheme();
                                        }}
                                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                                            theme === 'light'
                                                ? 'border-accent-soft bg-accent-soft text-accent'
                                                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
                                        }`}
                                    >
                                        <span aria-hidden="true">☀️</span>
                                        <span>Terang</span>
                                    </button>
                                </div>
                            </div>

                            {/* Accent Picker */}
                            <div>
                                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/46">
                                    Warna aksen
                                </p>
                                <div className="grid grid-cols-4 gap-2">
                                    {ACCENT_SWATCHES.map(({ color, fill }) => {
                                        const isActive = accent === color;
                                        return (
                                            <button
                                                key={color}
                                                onClick={() => setAccent(color)}
                                                className={`group relative flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all duration-200 hover:scale-105 ${
                                                    isActive
                                                        ? 'border-accent-soft bg-accent-soft'
                                                        : 'border-white/8 bg-white/5 hover:border-white/20 hover:bg-white/10'
                                                }`}
                                                aria-label={`Aksen ${color}`}
                                            >
                                                <span
                                                    className="h-6 w-6 rounded-full ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-110"
                                                    style={{ backgroundColor: fill }}
                                                />
                                                <span className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${
                                                    isActive ? 'text-accent' : 'text-white/50'
                                                }`}>
                                                    {color}
                                                </span>
                                                {isActive && (
                                                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] text-white">
                                                        ✓
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
