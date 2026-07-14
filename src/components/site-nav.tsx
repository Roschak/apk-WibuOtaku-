"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/lib/site-data';
import { ThemeToggle } from '@/components/theme-toggle';

function isActive(pathname: string, href: string) {
    if (href === '/') {
        return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
    const pathname = usePathname();

    return (
        <header className="site-header sticky top-0 z-50 border-b border-nav bg-nav backdrop-blur-2xl">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    <Link href="/" className="group flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-soft bg-gradient-to-br from-accent-light via-accent to-white text-sm font-black text-[#1a1a2e] shadow-lg shadow-accent/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-accent/40">
                            WO
                        </span>
                        <div className="transition-opacity duration-200 group-hover:opacity-80">
                            <p className="font-display text-lg font-semibold leading-none text-ink">WibuOtaku</p>
                            <p className="text-xs text-ink-tertiary">Anime, manga, LN tracker</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="hidden animate-fade-in rounded-full border border-tag bg-tag px-4 py-2 text-xs text-ink-tertiary lg:block">
                            PWA-ready blueprint untuk web + APK
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
                <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1">
                    {navItems.map((item, index) => {
                        const active = isActive(pathname, item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all duration-200 animate-fade-in hover:-translate-y-0.5 active:scale-95 ${active
                                    ? 'border-accent-soft bg-accent-soft text-accent animate-pulse-glow'
                                    : 'border-tag bg-tag text-ink-tertiary hover:border-white/20 hover:bg-white/10 hover:text-ink'
                                    }`}
                                style={{ animationDelay: `${40 + index * 20}ms` }}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}