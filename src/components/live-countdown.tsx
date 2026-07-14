"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { AnimeDetail } from '@/lib/site-data';
import { animeCatalog } from '@/lib/site-data';

/** Single countdown timer that updates every second */
function CountdownTimer({ targetTime, label }: { targetTime: number; label: string }) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        function update() {
            const now = Date.now();
            const diff = targetTime * 1000 - now;
            if (diff <= 0) {
                setTimeLeft('Tayang sekarang!');
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${days}h ${hours}j ${minutes}m ${seconds}d`);
        }
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <div className="flex items-baseline gap-1.5">
            <span className="font-display text-2xl font-bold text-accent tabular-nums">{timeLeft}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</span>
        </div>
    );
}

/** Get anime that have upcoming episodes from the catalog */
function getUpcomingAnime(): (AnimeDetail & { nextEpisode: NonNullable<AnimeDetail['nextEpisode']> })[] {
    return animeCatalog.filter(
        (item): item is AnimeDetail & { nextEpisode: NonNullable<AnimeDetail['nextEpisode']> } =>
            item.nextEpisode !== undefined
    );
}

export function LiveCountdownSection() {
    const upcoming = getUpcomingAnime();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (upcoming.length === 0) return null;

    return (
        <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-halo backdrop-blur-xl transition-all duration-300 hover:border-white/15">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                        </span>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                            Tayang dalam waktu dekat
                        </p>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-semibold text-white">
                        Countdown episode berikutnya
                    </h3>
                </div>
                <Link
                    href="/anime"
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                    Lihat semua anime
                </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {upcoming.map((anime) => {
                    const targetTime = anime.nextEpisode.airingAt;
                    const now = Date.now();
                    const diff = targetTime * 1000 - now;
                    const isSoon = diff > 0 && diff < 86400000; // within 24 hours

                    return (
                        <Link
                            key={anime.slug}
                            href={`/anime/${anime.slug}`}
                            className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ${
                                isSoon
                                    ? 'border-accent-soft bg-gradient-to-br from-accent-soft/30 to-black/20 hover:shadow-[0_0_32px_var(--accent-glow, rgba(247,195,95,0.15))]'
                                    : 'border-white/10 bg-black/18 hover:border-white/20 hover:bg-black/25'
                            }`}
                        >
                            {/* Accent glow for soon-episode */}
                            {isSoon && (
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        background: `radial-gradient(circle at top right, var(--accent), transparent 60%)`,
                                    }}
                                    aria-hidden="true"
                                />
                            )}

                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/46">
                                            {anime.studio}
                                        </p>
                                        <p className="mt-1 font-display text-lg font-semibold text-white transition-colors duration-200 group-hover:text-accent truncate">
                                            {anime.title}
                                        </p>
                                    </div>
                                    {anime.coverColor && (
                                        <span
                                            className="mt-1 h-3 w-3 shrink-0 rounded-full ring-1 ring-white/20"
                                            style={{ backgroundColor: anime.coverColor }}
                                        />
                                    )}
                                </div>

                                <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
                                    <span>Episode {anime.nextEpisode.episode}</span>
                                    <span className="text-white/20">•</span>
                                    <span>{anime.schedule}</span>
                                </div>

                                <div className="mt-3">
                                    <CountdownTimer
                                        targetTime={targetTime}
                                        label={isSoon ? 'Tayang sebentar lagi!' : 'hingga tayang'}
                                    />
                                </div>

                                {/* Progress bar */}
                                {(() => {
                                    const maxDiff = 7 * 86400; // 7 days in seconds
                                    const elapsed = maxDiff - diff / 1000;
                                    const progress = Math.min(Math.max(elapsed / maxDiff, 0), 1);
                                    return (
                                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/8">
                                            <div
                                                className="h-full rounded-full bg-accent transition-all duration-1000"
                                                style={{ width: `${progress * 100}%` }}
                                            />
                                        </div>
                                    );
                                })()}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {!mounted && (
                <div className="mt-6 h-8 w-full animate-shimmer rounded-lg" />
            )}
        </section>
    );
}
