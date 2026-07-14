/**
 * jikan-adapters.ts — Map Jikan API v4 responses to our AnimeDetail / MangaDetail types
 */

import type { AnimeDetail, MangaDetail, Tone } from '@/lib/site-data';
import type { JikanAnime, JikanManga } from '@/lib/jikan';

// ─── Helpers ───

function stripHtml(html?: string | null): string {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function truncate(text: string, max = 350): string {
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + '…';
}

function statusTone(status: string): Tone {
    if (status === 'Currently Airing' || status === 'Currently Publishing') return 'blue';
    if (status === 'Not yet aired' || status === 'Not yet published') return 'rose';
    if (status === 'Finished Airing' || status === 'Finished') return 'gold';
    return 'slate';
}

function formatLabel(type?: string): string {
    const map: Record<string, string> = {
        TV: 'TV Series',
        Movie: 'Movie',
        OVA: 'OVA',
        ONA: 'ONA',
        Special: 'Special',
        Music: 'Music',
        Manga: 'Manga',
        Novel: 'Light Novel',
        Manhwa: 'Manhwa',
        Manhua: 'Manhua',
        Doujinshi: 'Doujinshi',
        Oneshot: 'One-shot',
    };
    return map[type ?? ''] ?? type ?? 'Unknown';
}

function pickTitle(item: JikanAnime | JikanManga): string {
    return item.title_english || item.title || item.title_japanese || 'Unknown Title';
}

// ─── Anime Adapter ───

export function adaptJikanAnime(ani: JikanAnime): AnimeDetail {
    const title = pickTitle(ani);
    const cleanDesc = stripHtml(ani.synopsis);
    const tone = statusTone(ani.status);
    const studio = ani.studios?.[0]?.name || 'Unknown';
    const seasonStr = ani.season && ani.year ? `${ani.season} ${ani.year}` : ani.year ? `${ani.year}` : 'Unknown season';
    const format = formatLabel(ani.type);

    const status =
        ani.status === 'Currently Airing'
            ? `Sedang tayang — ${ani.episodes ?? '?'} episode`
            : ani.status === 'Finished Airing'
                ? `Selesai — ${ani.episodes ?? '?'} episode`
                : ani.status === 'Not yet aired'
                    ? 'Akan tayang'
                    : ani.status || 'Unknown';

    const episodeCount = ani.episodes ? `${ani.episodes} episode` : 'TBA';

    const meta = [studio, seasonStr, format];
    if (ani.genres?.[0]) meta.push(ani.genres[0].name);

    const detailFacts = [
        { label: 'Status', value: ani.status === 'Finished Airing' ? 'Completed' : ani.status === 'Currently Airing' ? 'Ongoing' : ani.status || 'Unknown' },
        { label: 'Episode', value: `${ani.episodes ?? '?'}` },
        { label: 'Skor', value: ani.score ? `${ani.score}/10` : 'N/A' },
        { label: 'Studio', value: studio },
        { label: 'Musim', value: seasonStr },
        { label: 'Format', value: format },
    ];

    if (ani.popularity) detailFacts.push({ label: 'Popularitas', value: `#${ani.popularity.toLocaleString()}` });

    const highlights = [
        `Skor: ${ani.score ?? 'N/A'}/10`,
        `Genre: ${ani.genres?.slice(0, 4).map((g) => g.name).join(', ') || 'N/A'}`,
        `Rank: #${ani.rank ?? 'N/A'} · Popularitas: #${ani.popularity ?? 'N/A'}`,
        `Studio: ${studio}`,
    ];

    // Build trailer URL
    let trailerUrl: string | undefined;
    if (ani.trailer?.embed_url) {
        trailerUrl = ani.trailer.embed_url;
    } else if (ani.trailer?.youtube_id) {
        trailerUrl = `https://www.youtube.com/embed/${ani.trailer.youtube_id}`;
    }

    return {
        slug: String(ani.mal_id),
        title,
        kicker: ani.status === 'Currently Airing' ? 'Sedang tayang' : ani.status === 'Not yet aired' ? 'Akan tayang' : ani.status === 'Finished Airing' ? 'Sudah tamat' : format,
        blurb: truncate(cleanDesc || title, 160),
        status,
        meta,
        tone,
        cta: 'Buka detail anime',
        season: seasonStr,
        studio,
        schedule: ani.broadcast?.string || seasonStr,
        source: ani.source?.replace(/_/g, ' ') || 'Original',
        episodeCount,
        synopsis: cleanDesc || 'Belum ada sinopsis.',
        detailFacts,
        highlights,
        cast: [],
        characters: [],
        related: [],
        trailerUrl,
        score: ani.score ? Math.round(ani.score * 10) : undefined, // normalize to 0-100 scale
        popularity: ani.popularity ?? undefined,
    };
}

// ─── Manga Adapter ───

export function adaptJikanManga(raw: JikanManga): MangaDetail {
    const title = pickTitle(raw);
    const cleanDesc = stripHtml(raw.synopsis);
    const tone = statusTone(raw.status);

    const status =
        raw.status === 'Currently Publishing'
            ? `Ongoing — ${raw.chapters ?? '?'} chapter`
            : raw.status === 'Finished'
                ? `Selesai — ${raw.chapters ?? '?'} chapter`
                : raw.status === 'Not yet published'
                    ? 'Akan rilis'
                    : raw.status || 'Unknown';

    const type = formatLabel(raw.type);
    const globalChapter = raw.chapters ? `Chapter ${raw.chapters}` : 'Ongoing';
    const publisher = raw.authors?.[0]?.name || 'Unknown';

    return {
        slug: String(raw.mal_id),
        title,
        kicker: raw.status === 'Currently Publishing' ? 'Manga ongoing' : raw.status === 'Finished' ? 'Manga selesai' : type,
        blurb: truncate(cleanDesc || title, 160),
        status,
        meta: [
            type,
            raw.status === 'Currently Publishing' ? 'Ongoing' : raw.status || 'Unknown',
            ...(raw.genres?.slice(0, 1).map((g) => g.name) ?? []),
        ],
        tone,
        cta: 'Buka detail manga',
        type,
        globalChapter,
        indoChapter: 'Cek penerbit lokal',
        legalPlatform: 'Cek platform baca legal terdekat',
        publisher,
        synopsis: cleanDesc || 'Belum ada sinopsis.',
        detailFacts: [
            { label: 'Status', value: raw.status === 'Currently Publishing' ? 'Ongoing' : raw.status || 'Unknown' },
            { label: 'Chapter global', value: `${raw.chapters ?? '?'}` },
            { label: 'Volume', value: `${raw.volumes ?? '?'}` },
            { label: 'Skor', value: raw.score ? `${raw.score}/10` : 'N/A' },
            { label: 'Popularitas', value: raw.popularity ? `#${raw.popularity.toLocaleString()}` : 'N/A' },
            { label: 'Format', value: type },
        ],
        releaseNotes: [
            `Data dari Jikan API (MyAnimeList) — ${raw.chapters ?? '?'} chapter global tercatat`,
            `Skor: ${raw.score ?? 'N/A'}/10 · Rank: #${raw.rank ?? 'N/A'}`,
            `Genre: ${raw.genres?.map((g) => g.name).join(', ') || 'N/A'}`,
            'Info chapter Indonesia & lisensi lokal: cek publisher terdekat',
        ],
        related: [],
        score: raw.score ? Math.round(raw.score * 10) : undefined,
        popularity: raw.popularity ?? undefined,
    };
}
