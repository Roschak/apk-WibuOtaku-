"use client";

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AnimatedList } from '@/components/animated-list';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { queryAnilist, ANIME_BY_ID } from '@/lib/anilist';
import { adaptAnime, getFallbackAnimeBySlug, type RawAnime } from '@/lib/ani-adapters';
import { getAnimeById } from '@/lib/jikan';
import { adaptJikanAnime } from '@/lib/jikan-adapters';

import type { AnimeDetail } from '@/lib/site-data';

function CountdownTimer({ targetTime }: { targetTime: number }) {
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
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-soft bg-accent-soft/50 px-4 py-2 text-sm font-semibold text-accent animate-pulse-glow">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            {timeLeft}
        </div>
    );
}

export default function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [item, setItem] = useState<AnimeDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { id } = await params;
            const numericId = Number(id);

            let found: AnimeDetail | undefined = !isNaN(numericId)
                ? undefined
                : getFallbackAnimeBySlug(id);

            if (!found && !isNaN(numericId)) {
                try {
                    const raw = await queryAnilist<{ Media: RawAnime }>(ANIME_BY_ID, { id: numericId });
                    if (raw?.Media) {
                        found = adaptAnime(raw.Media);
                    }
                } catch (err) {
                    console.warn('[Anime/' + id + '] AniList fetch failed, trying Jikan:', err);
                }

                // Fallback: try Jikan with same numeric ID (MAL ID)
                if (!found) {
                    try {
                        const jikanData = await getAnimeById(numericId);
                        if (jikanData) {
                            found = adaptJikanAnime(jikanData);
                        }
                    } catch (err2) {
                        console.warn('[Anime/' + id + '] Jikan fallback also failed:', err2);
                    }
                }
            }

            if (!found) {
                found = getFallbackAnimeBySlug(id);
            }

            setItem(found ?? null);
            setLoading(false);
        }
        load();
    }, [params]);

    if (loading) {
        return (
            <div className="space-y-8 pb-6">
                <div className="animate-shimmer rounded-[28px] border border-white/10 bg-white/5 p-6">
                    <div className="space-y-4">
                        <div className="h-4 w-24 rounded-full bg-white/5" />
                        <div className="h-10 w-3/4 rounded-lg bg-white/5" />
                        <div className="h-4 w-1/2 rounded-lg bg-white/5" />
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        notFound();
    }

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Detail anime"
                title={item.title}
                description={item.synopsis}
                actions={
                    <>
                        <Link href="/anime" className="rounded-full border border-btn-secondary bg-btn-secondary px-5 py-3 text-sm font-semibold text-ink">
                            Kembali ke list
                        </Link>
                        {item.score && item.score > 0 && (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/20 bg-amber-200/10 px-4 py-3 text-sm font-semibold text-amber-50">
                                ⭐ {item.score}%
                            </span>
                        )}
                        <Link href="/wishlist" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#1a1a2e]">
                            Pin ke wishlist
                        </Link>
                    </>
                }
            />

            <Surface className="space-y-6">
                <Reveal>
                {/* Kicker + Status + Countdown */}
                <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={item.tone}>{item.kicker}</Pill>
                    <Pill tone="slate">{item.status}</Pill>
                    {item.nextEpisode && (
                        <CountdownTimer targetTime={item.nextEpisode.airingAt} />
                    )}
                </div>
                </Reveal>

                {/* Trailer Section */}
                {item.trailerUrl && (
                    <Reveal>
                    <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black/30">
                        <iframe
                            src={item.trailerUrl}
                            title="Trailer"
                            className="absolute inset-0 h-full w-full"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                    </Reveal>
                )}

                <Reveal>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-4">
                        <h2 className="font-display text-3xl font-semibold text-ink">{item.title}</h2>
                        <p className="max-w-3xl text-sm leading-7 text-ink-secondary">{item.blurb}</p>
                    </div>
                    <AnimatedList>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {item.detailFacts.map((fact) => (
                            <div key={fact.label} className="rounded-2xl border border-surface bg-card p-4 transition-all duration-200 hover:border-surface-hover hover:bg-card-hover">
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">{fact.label}</p>
                                <p className="mt-2 text-sm font-semibold text-ink">{fact.value}</p>
                            </div>
                        ))}
                    </div>
                    </AnimatedList>
                </div>
                </Reveal>

                <Reveal>
                <AnimatedList>
                <div className="grid gap-4 lg:grid-cols-3">
                    {[
                        ['Season', item.season],
                        ['Studio', item.studio],
                        ['Schedule', item.schedule],
                        ['Source', item.source],
                        ['Episode', item.episodeCount],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-surface bg-card p-4 transition-all duration-200 hover:border-surface-hover hover:bg-card-hover">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">{label}</p>
                            <p className="mt-2 font-semibold text-ink">{value}</p>
                        </div>
                    ))}
                </div>
                </AnimatedList>
                </Reveal>

                <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                    <Reveal>
                    <div className="rounded-3xl border border-surface bg-card p-5 transition-all duration-200 hover:border-surface-hover hover:bg-card-hover">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Ringkasan</p>
                        <p className="mt-3 text-sm leading-7 text-ink-secondary">{item.synopsis}</p>
                        <AnimatedList>
                        <div className="mt-5 space-y-3">
                            {item.highlights.map((point) => (
                                <div key={point} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-ink-secondary transition-all duration-200 hover:border-surface-hover hover:bg-surface-hover">
                                    {point}
                                </div>
                            ))}
                        </div>
                        </AnimatedList>
                    </div>
                    </Reveal>
                    <Reveal delay={80}>
                    <div className="rounded-3xl border border-surface bg-card p-5 transition-all duration-200 hover:border-surface-hover hover:bg-card-hover">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">
                            Karakter & Seiyuu
                        </p>
                        <div className="mt-4 grid gap-3">
                            {item.characters.slice(0, 6).map((char) => (
                                <div
                                    key={char.name}
                                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-surface-hover hover:bg-surface-hover"
                                >
                                    {/* Character avatar */}
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-light/30 to-accent-soft text-xs font-bold text-accent"
                                        title={char.name}
                                    >
                                        {char.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-ink truncate">{char.name}</p>
                                        <p className="text-xs text-ink-tertiary">
                                            {char.voiceActor
                                                ? `Seiyuu: ${char.voiceActor}`
                                                : char.role
                                                    ? `Peran: ${char.role}`
                                                    : 'Karakter'
                                            }
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {item.cast.length > 0 && (
                            <>
                                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Cast lainnya</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {item.cast.slice(0, 6).map((name) => (
                                        <span key={name} className="rounded-full border border-tag bg-tag px-3 py-1 text-sm text-ink-tertiary transition-all duration-200 hover:scale-105 hover:border-surface-hover hover:bg-surface-hover">
                                            {name}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Related</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {item.related.map((name) => (
                                <span key={name} className="rounded-full border border-tag bg-tag px-3 py-1 text-sm text-ink-tertiary transition-all duration-200 hover:scale-105 hover:border-surface-hover hover:bg-surface-hover">
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                    </Reveal>
                </div>
            </Surface>
        </div>
    );
}
