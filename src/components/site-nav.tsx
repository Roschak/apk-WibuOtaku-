"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navItems } from '@/lib/site-data';

function isActive(pathname: string, href: string) {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08111f]/82 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200/20 bg-gradient-to-br from-amber-200 to-white text-sm font-black text-slate-950 shadow-lg shadow-amber-500/20">
              WO
            </span>
            <div>
              <p className="font-display text-lg font-semibold leading-none text-white">WibuOtaku</p>
              <p className="text-xs text-white/52">Anime, manga, LN tracker</p>
            </div>
          </Link>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/62 lg:block">
            PWA-ready blueprint untuk web + APK
          </div>
        </div>
        <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? 'border-amber-200/25 bg-amber-200/10 text-amber-50'
                    : 'border-white/10 bg-white/5 text-white/68 hover:border-white/20 hover:bg-white/10 hover:text-white'
                }`}
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