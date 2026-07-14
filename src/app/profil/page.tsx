"use client";

import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { useTheme, type AccentColor } from '@/lib/theme-context';

const ACCENTS: { color: AccentColor; label: string; fill: string }[] = [
    { color: 'gold', label: 'Gold', fill: '#f7c35f' },
    { color: 'blue', label: 'Biru', fill: '#63b3ed' },
    { color: 'rose', label: 'Rose', fill: '#f472b6' },
    { color: 'emerald', label: 'Hijau', fill: '#34d399' },
    { color: 'purple', label: 'Ungu', fill: '#a78bfa' },
    { color: 'cyan', label: 'Cyan', fill: '#22d3ee' },
    { color: 'pink', label: 'Pink', fill: '#f9a8d4' },
    { color: 'orange', label: 'Oranye', fill: '#fb923c' },
];

export default function ProfilePage() {
    const { theme, accent, setTheme, setAccent } = useTheme();

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Profil"
                title="Preferensi user, perangkat, dan kontrol tema."
                description="Atur tampilan aplikasi, notifikasi, dan preferensi personal sesuai keinginan."
            />

            {/* Theme Settings */}
            <Reveal>
                <Surface>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Mode tampilan</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Pilih tema yang nyaman di mata.</h2>
                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex flex-1 items-center justify-center gap-3 rounded-2xl border p-5 transition-all duration-200 ${
                                theme === 'dark'
                                    ? 'border-accent-soft bg-accent-soft'
                                    : 'border-surface bg-card hover:border-surface-hover'
                            }`}
                        >
                            <span className="text-2xl" aria-hidden="true">🌙</span>
                            <div className="text-left">
                                <p className={`font-semibold ${theme === 'dark' ? 'text-accent' : 'text-ink'}`}>Gelap</p>
                                <p className="text-sm text-ink-tertiary">Tampilan dark mode standar</p>
                            </div>
                            {theme === 'dark' && (
                                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-white">✓</span>
                            )}
                        </button>
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex flex-1 items-center justify-center gap-3 rounded-2xl border p-5 transition-all duration-200 ${
                                theme === 'light'
                                    ? 'border-accent-soft bg-accent-soft'
                                    : 'border-surface bg-card hover:border-surface-hover'
                            }`}
                        >
                            <span className="text-2xl" aria-hidden="true">☀️</span>
                            <div className="text-left">
                                <p className={`font-semibold ${theme === 'light' ? 'text-accent' : 'text-ink'}`}>Terang</p>
                                <p className="text-sm text-ink-tertiary">Tampilan light mode cerah</p>
                            </div>
                            {theme === 'light' && (
                                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-white">✓</span>
                            )}
                        </button>
                    </div>
                </Surface>
            </Reveal>

            {/* Accent Color */}
            <Reveal>
                <Surface>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Warna aksen</p>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Personalisasikan warna favorit kamu.</h2>
                    <p className="mt-3 text-sm leading-7 text-ink-secondary">
                        Warna aksen muncul di tombol, kartu aktif, badge, dan elemen interaktif lainnya.
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {ACCENTS.map(({ color, label, fill }) => {
                            const isActive = accent === color;
                            return (
                                <button
                                    key={color}
                                    onClick={() => setAccent(color)}
                                    className={`flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.02] ${
                                        isActive
                                            ? 'border-accent-soft bg-accent-soft'
                                            : 'border-surface bg-card hover:border-surface-hover'
                                    }`}
                                >
                                    <span
                                        className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white/10"
                                        style={{ backgroundColor: fill }}
                                    />
                                    <div className="text-left">
                                        <p className={`text-sm font-semibold ${isActive ? 'text-accent' : 'text-ink'}`}>{label}</p>
                                        {isActive && <p className="text-[11px] text-accent">Aktif</p>}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </Surface>
            </Reveal>

            {/* Profile Info */}
            <Reveal>
                <Surface>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Info akun</p>
                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                        {[
                            ['Nama tampilan', 'Wibu ID', 'Identitas utama di dashboard.'],
                            ['Wilayah', 'Indonesia', 'Format jadwal dan harga menyesuaikan WIB.'],
                            ['Mode notifikasi', 'Ringkas', 'Hanya update yang paling relevan.'],
                        ].map(([label, value, detail]) => (
                            <div key={label} className="rounded-3xl border border-surface bg-card p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">{label}</p>
                                <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
                                <p className="mt-2 text-sm leading-7 text-ink-secondary">{detail}</p>
                            </div>
                        ))}
                    </div>
                </Surface>
            </Reveal>

            <Reveal>
                <Surface>
                    <div className="flex flex-wrap gap-2">
                        {['ID / EN', 'Dark glass', 'Push ready', 'Progress sync', 'Discord later'].map((item) => (
                            <Pill key={item}>{item}</Pill>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/wishlist"
                            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#1a1a2e] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 active:scale-95"
                        >
                            Atur wishlist
                        </Link>
                        <Link
                            href="/notifikasi"
                            className="rounded-full border border-btn-secondary bg-btn-secondary px-5 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-surface-hover hover:bg-surface-hover active:scale-95"
                        >
                            Kelola alert
                        </Link>
                    </div>
                </Surface>
            </Reveal>
        </div>
    );
}
