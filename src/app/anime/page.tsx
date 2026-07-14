"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { AnimatedList } from '@/components/animated-list';
import { ContentCard } from '@/components/content-card';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { queryAnilist, TRENDING_ANIME } from '@/lib/anilist';
import { mapAnimeList, getFallbackAnimeList, type RawMediaList } from '@/lib/ani-adapters';
import { getTopAnime } from '@/lib/jikan';
import { adaptJikanAnime } from '@/lib/jikan-adapters';
import { weeklyCalendar } from '@/lib/site-data';
import type { AnimeDetail } from '@/lib/site-data';

type SortKey = 'trending' | 'score' | 'popularity' | 'title';

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Supernatural', 'Thriller'];

export default function AnimePage() {
    const [animeList, setAnimeList] = useState<AnimeDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [activeStatus, setActiveStatus] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortKey>('trending');

    useEffect(() => {
        async function load() {
            try {
                const raw = await queryAnilist<RawMediaList>(TRENDING_ANIME, {
                    page: 1,
                    perPage: 12,
                });
                const mapped = mapAnimeList(raw);
                if (mapped.length > 0) {
                    setAnimeList(mapped);
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.warn('[Anime] AniList fetch failed, trying Jikan fallback:', err);
            }

            // Fallback: try Jikan API
            try {
                const jikanAnime = await getTopAnime(1, 9);
                if (jikanAnime && jikanAnime.length > 0) {
                    const mapped = jikanAnime.map(adaptJikanAnime);
                    setAnimeList(mapped);
                    setLoading(false);
                    return;
                }
            } catch (err2) {
                console.warn('[Anime] Jikan fallback also failed:', err2);
            }

            // Ultimate fallback: static data
            setAnimeList(getFallbackAnimeList());
            setLoading(false);
        }
        load();
    }, []);

    const filteredAndSorted = useMemo(() => {
        let items = [...animeList];

        // Filter by genre
        if (activeGenre) {
            items = items.filter((item) =>
                item.meta.some((m) => m.toLowerCase().includes(activeGenre.toLowerCase()))
            );
        }

        // Filter by status
        if (activeStatus) {
            if (activeStatus === 'sedang tayang') {
                items = items.filter((item) => item.kicker === 'Sedang tayang' || item.status.includes('Episode'));
            } else if (activeStatus === 'selesai') {
                items = items.filter((item) => item.kicker === 'Sudah tamat' || item.status.includes('Selesai'));
            } else if (activeStatus === 'akan tayang') {
                items = items.filter((item) => item.kicker === 'Akan tayang');
            }
        }

        // Sort
        switch (sortBy) {
            case 'score':
                items.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
                break;
            case 'popularity':
                items.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
                break;
            case 'title':
                items.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default: // trending — keep original order
                break;
        }

        return items;
    }, [animeList, activeGenre, activeStatus, sortBy]);

    if (loading) {
        return (
            <div className="space-y-8 pb-6">
                <div className="animate-shimmer rounded-[28px] border border-white/10 bg-white/5 p-6">
                    <div className="mb-8 space-y-4">
                        <div className="h-4 w-24 rounded-full bg-white/5" />
                        <div className="h-10 w-3/4 rounded-lg bg-white/5" />
                        <div className="h-4 w-1/2 rounded-lg bg-white/5" />
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 rounded-3xl bg-white/5" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Modul anime"
                title="Sedang tayang, akan tayang, tamat, dan klasik dalam satu tempat."
                description="List anime dipisah jelas, lengkap dengan jadwal simulcast, status rilisan, dan jalur notifikasi untuk episode berikutnya."
                actions={
                    <>
                        <Link href="/kalender" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#1a1a2e]">
                            Buka kalender
                        </Link>
                        <Link href="/wishlist" className="rounded-full border border-btn-secondary bg-btn-secondary px-5 py-3 text-sm font-semibold text-ink">
                            Masuk wishlist
                        </Link>
                    </>
                }
            />

            {/* Filter & Sort */}
            <Reveal>
            <Surface>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Filter by Status */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Status</span>
                        {['Semua', 'Sedang tayang', 'Akan tayang', 'Selesai'].map((status) => {
                            const isActive = status === 'Semua' ? !activeStatus : activeStatus === status.toLowerCase();
                            return (
                                <button
                                    key={status}
                                    onClick={() => setActiveStatus(status === 'Semua' ? null : status.toLowerCase())}
                                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 ${
                                        isActive
                                            ? 'border-accent-soft bg-accent-soft text-accent'
                                            : 'border-tag bg-tag text-ink-tertiary hover:border-white/20 hover:text-ink'
                                    }`}
                                >
                                    {status}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Urut</span>
                        {([['trending', 'Trending'], ['score', 'Skor'], ['popularity', 'Populer'], ['title', 'A-Z']] as const).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setSortBy(key)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 ${
                                    sortBy === key
                                        ? 'border-accent-soft bg-accent-soft text-accent'
                                        : 'border-tag bg-tag text-ink-tertiary hover:border-white/20 hover:text-ink'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter by Genre */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Genre</span>
                    {GENRES.slice(0, 8).map((genre) => (
                        <button
                            key={genre}
                            onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 ${
                                activeGenre === genre
                                    ? 'border-accent-soft bg-accent-soft text-accent'
                                    : 'border-tag bg-tag text-ink-tertiary hover:border-white/20 hover:text-ink'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-ink-tertiary">
                    <span>{filteredAndSorted.length} hasil</span>
                    {(activeGenre || activeStatus || sortBy !== 'trending') && (
                        <button
                            onClick={() => { setActiveGenre(null); setActiveStatus(null); setSortBy('trending'); }}
                            className="text-accent hover:underline"
                        >
                            Reset filter
                        </button>
                    )}
                </div>
            </Surface>
            </Reveal>

            {/* Anime Cards */}
            <AnimatedList>
            <div className="grid gap-4 lg:grid-cols-3">
                {filteredAndSorted.map((item) => (
                    <ContentCard key={item.slug} {...item} href={`/anime/${item.slug}`} />
                ))}
            </div>
            </AnimatedList>

            <Reveal>
            <Surface>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-muted">Kalender anime</p>
                        <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Rilis mingguan yang mudah dipindai.</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {['Season', 'Genre', 'Studio', 'Status', 'Rating'].map((item) => (
                            <Pill key={item}>{item}</Pill>
                        ))}
                    </div>
                </div>
                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                    {weeklyCalendar.map((day) => (
                        <div key={day.day} className="rounded-3xl border border-surface bg-card p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-display text-xl font-semibold text-ink">{day.day}</p>
                                    <p className="text-sm text-ink-tertiary">{day.subtitle}</p>
                                </div>
                                <span className="text-xs uppercase tracking-[0.24em] text-ink-low">{day.items.length} slot</span>
                            </div>
                            <div className="mt-4 space-y-3">
                                {day.items.map((item) => (
                                    <div key={`${day.day}-${item.title}`} className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3">
                                        <div>
                                            <p className="font-medium text-ink">{item.title}</p>
                                            <p className="text-sm text-ink-tertiary">{item.label}</p>
                                        </div>
                                        <Pill tone={item.tone}>{item.time}</Pill>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Surface>
            </Reveal>
        </div>
    );
}
