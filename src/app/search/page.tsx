"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { AnimatedList } from '@/components/animated-list';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { queryAnilist, SEARCH_ANIME, SEARCH_MANGA } from '@/lib/anilist';
import { searchAnime as jikanSearchAnime, searchManga as jikanSearchManga } from '@/lib/jikan';
import { searchIndex } from '@/lib/site-data';

// Minimal type for AniList search result media items — avoids `any`
interface AnilistMediaItem {
    id: number;
    title?: { romaji?: string; english?: string };
    description?: string;
    status?: string;
    format?: string;
    averageScore?: number;
    genres?: string[];
    chapters?: number;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

type SearchResult = {
    kind: 'Anime' | 'Manga' | 'Light Novel';
    id: string;
    title: string;
    href: string;
    summary: string;
    meta: string[];
    tone: 'gold' | 'blue' | 'rose' | 'emerald' | 'slate';
    source: 'local' | 'anilist' | 'jikan';
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [apiResults, setApiResults] = useState<SearchResult[]>([]);
    const [apiLoading, setApiLoading] = useState(false);
    const [activeKind, setActiveKind] = useState<string | null>(null);
    const debouncedQuery = useDebounce(query, 400);
    const abortRef = useRef<AbortController | null>(null);

    // Search AniList when query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setApiResults([]);
            setApiLoading(false);
            return;
        }

        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        async function searchAPI() {
            setApiLoading(true);
            try {
                const [animeRaw, mangaRaw, jikanAnime, jikanManga] = await Promise.allSettled([
                    queryAnilist<{ Page: { media: AnilistMediaItem[] } }>(SEARCH_ANIME, { search: debouncedQuery, page: 1, perPage: 4 }),
                    queryAnilist<{ Page: { media: AnilistMediaItem[] } }>(SEARCH_MANGA, { search: debouncedQuery, page: 1, perPage: 4 }),
                    jikanSearchAnime(debouncedQuery, 1, 3),
                    jikanSearchManga(debouncedQuery, 1, 3),
                ]);

                const results: SearchResult[] = [];

                function addAnilistResults(data: { Page?: { media?: AnilistMediaItem[] } }, kind: 'Anime' | 'Manga') {
                    if (data?.Page?.media) {
                        for (const m of data.Page.media) {
                            const title = m.title?.romaji || m.title?.english || 'Unknown';
                            results.push({
                                kind,
                                id: String(m.id),
                                title,
                                href: `/${kind.toLowerCase()}/${m.id}`,
                                summary: m.description
                                    ? m.description.replace(/<[^>]*>/g, '').slice(0, 120)
                                    : 'Tidak ada deskripsi',
                                meta: [
                                    m.status === 'RELEASING' ? 'Ongoing' : m.status === 'FINISHED' ? 'Completed' : m.status ?? '',
                                    m.format ?? '',
                                    m.averageScore ? `${m.averageScore}%` : '',
                                    kind === 'Manga' && m.chapters ? `${m.chapters} ch` : '',
                                    ...(m.genres?.slice(0, 2) ?? []),
                                ].filter(Boolean),
                                tone: m.status === 'RELEASING' ? 'gold' : m.status === 'FINISHED' ? 'rose' : 'blue',
                                source: 'anilist',
                            });
                        }
                    }
                }

                function addJikanResults(data: { mal_id?: number; title_english?: string | null; title?: string; synopsis?: string | null; status?: string; type?: string; score?: number | null; genres?: { name: string }[] }[], kind: 'Anime' | 'Manga') {
                    if (data && data.length > 0) {
                        for (const m of data) {
                            const title = m.title_english || m.title || 'Unknown';
                            results.push({
                                kind,
                                id: String(m.mal_id),
                                title,
                                href: `/${kind.toLowerCase()}/${m.mal_id}`,
                                summary: m.synopsis
                                    ? m.synopsis.replace(/<[^>]*>/g, '').slice(0, 120)
                                    : 'Tidak ada deskripsi',
                                meta: [
                                    m.status === 'Currently Airing' || m.status === 'Currently Publishing' ? 'Ongoing' : m.status === 'Finished Airing' || m.status === 'Finished' ? 'Completed' : m.status ?? '',
                                    m.type ?? '',
                                    m.score ? `${m.score}/10` : '',
                                    ...(m.genres?.slice(0, 2).map((g: { name: string }) => g.name) ?? []),
                                ].filter(Boolean),
                                tone: m.status === 'Currently Airing' || m.status === 'Currently Publishing' ? 'gold' : m.status === 'Finished Airing' || m.status === 'Finished' ? 'rose' : 'blue',
                                source: 'jikan',
                            });
                        }
                    }
                }

                if (animeRaw.status === 'fulfilled' && animeRaw.value) addAnilistResults(animeRaw.value, 'Anime');
                if (mangaRaw.status === 'fulfilled' && mangaRaw.value) addAnilistResults(mangaRaw.value, 'Manga');
                if (jikanAnime.status === 'fulfilled' && jikanAnime.value) addJikanResults(jikanAnime.value, 'Anime');
                if (jikanManga.status === 'fulfilled' && jikanManga.value) addJikanResults(jikanManga.value, 'Manga');

                setApiResults(results);
            } catch (err) {
                if ((err as { name?: string })?.name !== 'AbortError') {
                    console.warn('[Search] API search failed:', err);
                }
            }
            setApiLoading(false);
        }

        searchAPI();
        return () => abortRef.current?.abort();
    }, [debouncedQuery]);

    const allResults: SearchResult[] = [
        ...searchIndex.map((item) => ({ ...item, source: 'local' as const, id: item.href, kind: item.kind as SearchResult['kind'] })),
        ...apiResults,
    ];

    const filtered = allResults.filter((item) => {
        if (!query.trim()) return true;
        if (activeKind && item.kind !== activeKind) return false;
        const metaText = item.meta.join(' ');
        const q = query.toLowerCase();
        return item.title.toLowerCase().includes(q) ||
            item.summary.toLowerCase().includes(q) ||
            item.kind.toLowerCase().includes(q) ||
            metaText.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Pencarian global"
                title="Cari anime, manga, dan light novel dari satu index yang sama."
                description="Pencarian ini menggabungkan data lokal dengan hasil real-time dari AniList API."
                actions={
                    <Link href="/wishlist" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
                        Buka wishlist
                    </Link>
                }
            />

            <Surface className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="search-query" className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">
                        Query
                    </label>
                    <div className="relative">
                        <input
                            id="search-query"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari judul, status, chapter, studio, atau volume..."
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/36 outline-none transition focus:border-amber-200/30 focus:bg-black/30"
                            autoFocus
                        />
                        {apiLoading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-200/30 border-t-amber-200" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {['Semua', 'Anime', 'Manga', 'Light Novel'].map((kind) => {
                        const isActive = kind === 'Semua' ? !activeKind : activeKind === kind;
                        return (
                            <button
                                key={kind}
                                onClick={() => setActiveKind(kind === 'Semua' ? null : kind)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 ${
                                    isActive
                                        ? 'border-accent-soft bg-accent-soft text-accent'
                                        : 'border-tag bg-tag text-ink-tertiary hover:border-white/20 hover:text-ink'
                                }`}
                            >
                                {kind}
                                {query.trim() && (
                                    <span className="ml-1.5 text-[10px] opacity-60">({filtered.filter(r => kind === 'Semua' || r.kind === kind).length})</span>
                                )}
                            </button>
                        );
                    })}
                    {query.trim() && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/64">
                            {filtered.length} hasil
                            {apiResults.length > 0 && ` (${apiResults.length} dari AniList)`}
                        </span>
                    )}
                </div>

                {apiResults.length > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-200/10 bg-amber-200/5 px-4 py-2 text-xs text-amber-100/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Menampilkan hasil real-time dari AniList API
                    </div>
                )}

                <AnimatedList>
                <div className="grid gap-4 lg:grid-cols-2">
                    {filtered.map((item) => (
                        <Reveal key={item.href + item.id}>
                        <Link
                            href={item.href}
                            className="group block rounded-3xl border border-white/10 bg-black/18 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/6 hover:shadow-[0_0_24px_rgba(247,195,95,0.08)]"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
                                        {item.kind}
                                        {item.source !== 'local' && (
                                            <span className="ml-2 rounded-full border border-amber-200/15 bg-amber-200/8 px-2 py-0.5 text-[9px] text-amber-200/70">
                {item.source === 'jikan' ? 'MAL' : 'AniList'}
            </span>
                                        )}
                                    </p>
                                    <h2 className="mt-2 font-display text-2xl font-semibold text-white transition-colors duration-200 group-hover:text-amber-50 truncate">{item.title}</h2>
                                </div>
                                <Pill tone={item.tone}>Buka</Pill>
                            </div>
                            <p className="mt-4 text-sm leading-7 text-white/68 line-clamp-2">{item.summary}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {item.meta.slice(0, 4).map((meta) => (
                                    <span key={meta} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/72 transition-all duration-200 group-hover:border-white/15 group-hover:bg-white/8">
                                        {meta}
                                    </span>
                                ))}
                            </div>
                        </Link>
                        </Reveal>
                    ))}
                </div>
                </AnimatedList>

                {filtered.length === 0 && !apiLoading && (
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-8 text-center">
                        <p className="text-2xl mb-2" aria-hidden="true">🔍</p>
                        <p className="font-semibold text-white">Tidak ada hasil</p>
                        <p className="mt-2 text-sm text-white/56">
                            {query.trim()
                                ? 'Tidak ditemukan untuk "' + query + '". Coba kata kunci lain.'
                                : 'Ketik judul untuk mulai mencari.'
                            }
                        </p>
                    </div>
                )}
            </Surface>
        </div>
    );
}