"use client";

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type AccentColor = 'gold' | 'blue' | 'rose' | 'emerald' | 'purple' | 'cyan' | 'pink' | 'orange';
export type ThemeMode = 'dark' | 'light';

const ACCENT_LABELS: Record<AccentColor, string> = {
    gold: 'Gold',
    blue: 'Biru',
    rose: 'Rose',
    emerald: 'Hijau',
    purple: 'Ungu',
    cyan: 'Cyan',
    pink: 'Pink',
    orange: 'Oranye',
};

const STORAGE_KEY_THEME = 'wo-theme';
const STORAGE_KEY_ACCENT = 'wo-accent';

type ThemeContextValue = {
    theme: ThemeMode;
    accent: AccentColor;
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
    setAccent: (color: AccentColor) => void;
    accentLabel: (color: AccentColor) => string;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): ThemeMode {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem(STORAGE_KEY_THEME);
    if (stored === 'light' || stored === 'dark') return stored;
    return 'dark';
}

function getInitialAccent(): AccentColor {
    if (typeof window === 'undefined') return 'gold';
    const stored = localStorage.getItem(STORAGE_KEY_ACCENT);
    const validAccents: AccentColor[] = ['gold', 'blue', 'rose', 'emerald', 'purple', 'cyan', 'pink', 'orange'];
    if (validAccents.includes(stored as AccentColor)) return stored as AccentColor;
    return 'gold';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>('dark');
    const [accent, setAccentState] = useState<AccentColor>('gold');
    const [mounted, setMounted] = useState(false);

    // Hydrate from localStorage on mount
    useEffect(() => {
        setThemeState(getInitialTheme());
        setAccentState(getInitialAccent());
        setMounted(true);
    }, []);

    // Apply theme to <html>
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;

        // Remove old theme class
        root.classList.remove('dark', 'light');

        // Set data attribute (our CSS uses data-theme)
        root.setAttribute('data-theme', theme);

        // Also set class for Tailwind dark mode support
        if (theme === 'dark') {
            root.classList.add('dark');
        }

        localStorage.setItem(STORAGE_KEY_THEME, theme);
    }, [theme, mounted]);

    // Apply accent to <html>
    useEffect(() => {
        if (!mounted) return;

        document.documentElement.setAttribute('data-accent', accent);
        localStorage.setItem(STORAGE_KEY_ACCENT, accent);
    }, [accent, mounted]);

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setAccent = useCallback((color: AccentColor) => {
        setAccentState(color);
    }, []);

    const accentLabel = useCallback((color: AccentColor) => {
        return ACCENT_LABELS[color];
    }, []);

    // Prevent flash of wrong theme by hiding until mounted.
    // Selalu bungkus dengan Provider agar useTheme() bisa dipanggil
    // selama server-side pre-render (static export).
    const ctxValue = { theme, accent, setTheme, toggleTheme, setAccent, accentLabel };

    if (!mounted) {
        return (
            <ThemeContext.Provider value={ctxValue}>
                <div style={{ visibility: 'hidden' }}>
                    {children}
                </div>
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={ctxValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return ctx;
}
