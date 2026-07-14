import type { AnimeDetail, MangaDetail, Tone, CharacterInfo } from '@/lib/site-data';
import { animeCatalog, mangaCatalog, lightNovelCatalog } from '@/lib/site-data';

// ─── Type helpers for AniList raw responses ───

type AniTitle = { romaji?: string | null; english?: string | null; native?: string | null };
type AniDate = { year?: number | null; month?: number | null; day?: number | null };
type AniCover = { large?: string | null; color?: string | null };
type AniStudioEdge = { nodes?: { name: string }[] | null };
type AniCharacterEdge = {
    role: string;
    node: { id: number; name: { full: string }; image?: { medium?: string | null } | null };
    voiceActors?: { name: { full: string }; language?: string }[] | null;
};
type AniStaffEdge = { role: string; node: { name: { full: string } } };
type AniRelationEdge = {
    relationType: string;
    node: { id: number; title: { romaji?: string | null }; type: string; format?: string | null };
};
type AniRecommendationEdge = {
    node: { mediaRecommendation: { id: number; title: { romaji?: string | null } } };
};

// ─── Tone mapping ───

const ANS: Record<string, Tone> = {
    FINISHED: 'gold',
    RELEASING: 'blue',
    NOT_YET_RELEASED: 'rose',
    CANCELLED: 'slate',
    HIATUS: 'slate',
};

function toneFromStatus(status?: string | null): Tone {
    return ANS[status ?? ''] ?? 'slate';
}

function seasonLabel(season?: string | null, year?: number | null): string {
    if (!season) return 'Unknown season';
    const map: Record<string, string> = {
        WINTER: 'Winter',
        SPRING: 'Spring',
        SUMMER: 'Summer',
        FALL: 'Fall',
    };
    const s = map[season ?? ''] ?? season ?? 'Unknown';
    return year ? `${s} ${year}` : s;
}

function formatLabel(format?: string | null): string {
    const map: Record<string, string> = {
        TV: 'TV Series',
        TV_SHORT: 'TV Short',
        MOVIE: 'Movie',
        ONA: 'ONA',
        OVA: 'OVA',
        SPECIAL: 'Special',
        MUSIC: 'Music',
        MANGA: 'Manga',
        NOVEL: 'Light Novel',
        ONE_SHOT: 'One-shot',
    };
    return map[format ?? ''] ?? format ?? 'Unknown';
}

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

// ─── Anime adapter ───

export type RawAnime = {
    id: number;
    title: AniTitle;
    coverImage?: AniCover | null;
    bannerImage?: string | null;
    description?: string | null;
    episodes?: number | null;
    duration?: number | null;
    status?: string | null;
    season?: string | null;
    seasonYear?: number | null;
    format?: string | null;
    studios?: AniStudioEdge | null;
    source?: string | null;
    genres?: string[] | null;
    tags?: { name: string }[] | null;
    averageScore?: number | null;
    meanScore?: number | null;
    popularity?: number | null;
    favourites?: number | null;
    startDate?: AniDate | null;
    endDate?: AniDate | null;
    nextAiringEpisode?: { airingAt: number; episode: number } | null;
    characters?: { edges?: AniCharacterEdge[] | null } | null;
    staff?: { edges?: AniStaffEdge[] | null } | null;
    relations?: { edges?: AniRelationEdge[] | null } | null;
    recommendations?: { edges?: AniRecommendationEdge[] | null } | null;
    trailer?: { id: string; site: string } | null;
    streamingEpisodes?: { title?: string | null; url?: string | null }[] | null;
};

export function adaptAnime(ani: RawAnime): AnimeDetail {
    const title = ani.title?.romaji || ani.title?.english || 'Unknown Title';
    const cleanDesc = stripHtml(ani.description);
    const tone = toneFromStatus(ani.status);
    const studio = ani.studios?.nodes?.[0]?.name || 'Unknown';
    const seasonStr = seasonLabel(ani.season, ani.seasonYear);
    const format = formatLabel(ani.format);

    // Build status string
    let status = 'Unknown';
    if (ani.status === 'RELEASING') {
        const next = ani.nextAiringEpisode;
        if (next) {
            status = `Episode ${next.episode} — tayang berkala`;
        } else {
            status = 'Sedang tayang';
        }
    } else if (ani.status === 'FINISHED') {
        status = `Selesai — ${ani.episodes ?? '?'} episode`;
    } else if (ani.status === 'NOT_YET_RELEASED') {
        status = 'Akan tayang';
    } else if (ani.status === 'CANCELLED') {
        status = 'Dibatalkan';
    }

    const episodeCount = ani.status === 'FINISHED'
        ? `${ani.episodes ?? '?'} episode`
        : ani.nextAiringEpisode
            ? `Episode ${ani.nextAiringEpisode.episode}/${ani.episodes ?? '?'}`
            : `${ani.episodes ?? '?'} episode`;

    // Schedule
    const schedule = ani.nextAiringEpisode
        ? new Date(ani.nextAiringEpisode.airingAt * 1000).toLocaleDateString('id-ID', {
              weekday: 'long',
              hour: '2-digit',
              minute: '2-digit',
          })
        : seasonStr;

    const meta = [studio, seasonStr, format];
    if (ani.genres && ani.genres.length > 0) {
        meta.push(ani.genres[0]);
    }

    const detailFacts = [
        { label: 'Status', value: ani.status === 'FINISHED' ? 'Completed' : ani.status === 'RELEASING' ? 'Ongoing' : ani.status ?? 'Unknown' },
        { label: 'Episode', value: `${ani.episodes ?? '?'}` },
        { label: 'Skor', value: ani.averageScore ? `${ani.averageScore}%` : 'N/A' },
        { label: 'Studio', value: studio },
        { label: 'Musim', value: seasonStr },
        { label: 'Format', value: format },
    ];
    if (ani.duration) {
        detailFacts.push({ label: 'Durasi', value: `${ani.duration} menit` });
    }
    if (ani.popularity) {
        detailFacts.push({ label: 'Popularitas', value: `${ani.popularity.toLocaleString()}` });
    }

    const highlights = [
        `Skor rata-rata: ${ani.averageScore ?? 'N/A'}%`,
        `Genre: ${ani.genres?.slice(0, 4).join(', ') || 'N/A'}`,
        ani.nextAiringEpisode ? `Episode ${ani.nextAiringEpisode.episode} berikutnya dalam jadwal` : 'Tersedia untuk ditonton',
        `Studio: ${studio}`,
    ];

    const cast = ani.characters?.edges?.slice(0, 6).map((e) => e.node.name.full) ?? [];

    // Richer character data with images and voice actors
    const characters: CharacterInfo[] = (ani.characters?.edges?.slice(0, 6) ?? []).map((e) => ({
        name: e.node.name.full,
        image: e.node.image?.medium ?? undefined,
        voiceActor: e.voiceActors?.[0]?.name?.full ?? undefined,
        role: e.role ?? undefined,
    }));

    // Build trailer URL from AniList trailer data
    let trailerUrl: string | undefined;
    if (ani.trailer?.id && ani.trailer?.site === 'youtube') {
        trailerUrl = `https://www.youtube.com/embed/${ani.trailer.id}`;
    }

    const related = [
        ...(ani.relations?.edges?.slice(0, 3).map((e) => e.node.title?.romaji || e.relationType) ?? []),
        ...(ani.recommendations?.edges?.slice(0, 2).map((e) => e.node.mediaRecommendation.title?.romaji || 'Rekomendasi') ?? []),
    ];

    return {
        slug: String(ani.id),
        title,
        kicker: ani.status === 'RELEASING' ? 'Sedang tayang' : ani.status === 'NOT_YET_RELEASED' ? 'Akan tayang' : ani.status === 'FINISHED' ? 'Sudah tamat' : format,
        blurb: truncate(cleanDesc || title, 160),
        status,
        meta,
        tone,
        cta: 'Buka detail anime',
        season: seasonStr,
        studio,
        schedule,
        source: ani.source?.replace(/_/g, ' ') || 'Original',
        episodeCount,
        synopsis: cleanDesc || 'Belum ada sinopsis.',
        detailFacts,
        highlights,
        cast,
        characters,
        related,
        trailerUrl,
        nextEpisode: ani.nextAiringEpisode ?? undefined,
        coverColor: ani.coverImage?.color ?? undefined,
        score: ani.averageScore ?? undefined,
        popularity: ani.popularity ?? undefined,
    };
}

// ─── Manga adapter ───

export type RawManga = {
    id: number;
    title: AniTitle;
    coverImage?: AniCover | null;
    bannerImage?: string | null;
    description?: string | null;
    chapters?: number | null;
    volumes?: number | null;
    status?: string | null;
    format?: string | null;
    genres?: string[] | null;
    tags?: { name: string }[] | null;
    averageScore?: number | null;
    meanScore?: number | null;
    popularity?: number | null;
    favourites?: number | null;
    startDate?: AniDate | null;
    endDate?: AniDate | null;
    staff?: { edges?: AniStaffEdge[] | null } | null;
    relations?: { edges?: AniRelationEdge[] | null } | null;
    recommendations?: { edges?: AniRecommendationEdge[] | null } | null;
};

export function adaptManga(raw: RawManga): MangaDetail {
    const title = raw.title?.romaji || raw.title?.english || 'Unknown Title';
    const cleanDesc = stripHtml(raw.description);
    const tone = toneFromStatus(raw.status);

    let status = 'Unknown';
    if (raw.status === 'RELEASING') status = 'Ongoing — rilis berkala';
    else if (raw.status === 'FINISHED') status = `Selesai — ${raw.chapters ?? '?'} chapter`;
    else if (raw.status === 'NOT_YET_RELEASED') status = 'Akan rilis';
    else if (raw.status === 'HIATUS') status = 'Hiatus';
    else if (raw.status === 'CANCELLED') status = 'Dibatalkan';

    const type = formatLabel(raw.format);
    const globalChapter = raw.chapters ? `Chapter ${raw.chapters}` : 'Ongoing';
    const publisher = raw.staff?.edges?.find((e) => e.role === 'Publisher')?.node?.name?.full ?? 'Unknown';

    return {
        slug: String(raw.id),
        title,
        kicker: raw.status === 'RELEASING' ? 'Manga ongoing' : raw.status === 'FINISHED' ? 'Manga selesai' : type,
        blurb: truncate(cleanDesc || title, 160),
        status,
        meta: [
            type,
            raw.status === 'RELEASING' ? 'Ongoing' : raw.status ?? 'Unknown',
            ...(raw.genres?.slice(0, 1) ?? []),
        ],
        tone,
        cta: 'Buka detail manga',
        type,
        globalChapter,
        indoChapter: 'Cek penerbit lokal', // AniList doesn't have Indonesia-specific data
        legalPlatform: 'Cek platform baca legal terdekat',
        publisher,
        synopsis: cleanDesc || 'Belum ada sinopsis.',
        detailFacts: [
            { label: 'Status', value: raw.status === 'RELEASING' ? 'Ongoing' : raw.status ?? 'Unknown' },
            { label: 'Chapter global', value: `${raw.chapters ?? '?'}` },
            { label: 'Volume', value: `${raw.volumes ?? '?'}` },
            { label: 'Skor', value: raw.averageScore ? `${raw.averageScore}%` : 'N/A' },
            { label: 'Popularitas', value: raw.popularity ? `${raw.popularity.toLocaleString()}` : 'N/A' },
            { label: 'Format', value: type },
        ],
        releaseNotes: [
            `Data dari AniList API — ${raw.chapters ?? '?'} chapter global tercatat`,
            `Skor rata-rata: ${raw.averageScore ?? 'N/A'}% dari ${raw.popularity?.toLocaleString() ?? 'N/A'} pengguna`,
            `Genre: ${raw.genres?.join(', ') || 'N/A'}`,
            'Info chapter Indonesia & lisensi lokal: cek publisher terdekat',
        ],
        related: [
            ...(raw.relations?.edges?.slice(0, 3).map((e) => e.node.title?.romaji || e.relationType) ?? []),
            ...(raw.recommendations?.edges?.slice(0, 2).map((e) => e.node.mediaRecommendation.title?.romaji || 'Informasi') ?? []),
        ],
        score: raw.averageScore ?? undefined,
        popularity: raw.popularity ?? undefined,
        coverColor: raw.coverImage?.color ?? undefined,
    };
}

// ─── Map list results ───

export type RawMediaList = {
    Page: {
        media: RawAnime[];
        pageInfo?: { total: number; currentPage: number; lastPage: number; hasNextPage: boolean };
    };
};

export type RawMangaList = {
    Page: {
        media: RawManga[];
        pageInfo?: { total: number; currentPage: number; lastPage: number; hasNextPage: boolean };
    };
};

export function mapAnimeList(raw: RawMediaList): AnimeDetail[] {
    if (!raw?.Page?.media) return [];
    return raw.Page.media.map(adaptAnime);
}

export function mapMangaList(raw: RawMangaList): MangaDetail[] {
    if (!raw?.Page?.media) return [];
    return raw.Page.media.map(adaptManga);
}

// ─── Fallback data from static site-data ───

export function getFallbackAnimeList(): AnimeDetail[] {
    // Map static anime catalog to ensure all fields exist with proper types
    return animeCatalog.map((item) => ({
        ...item,
        tone: item.tone as Tone,
    }));
}

export function getFallbackAnimeBySlug(slug: string): AnimeDetail | undefined {
    return animeCatalog.find((item) => item.slug === slug);
}

export function getFallbackMangaList(): MangaDetail[] {
    return mangaCatalog.map((item) => ({
        ...item,
        tone: item.tone as Tone,
    }));
}

export function getFallbackMangaBySlug(slug: string): MangaDetail | undefined {
    return mangaCatalog.find((item) => item.slug === slug);
}

export function getFallbackLNBySlug(slug: string) {
    return lightNovelCatalog.find((item) => item.slug === slug);
}

export function getFallbackLNList() {
    return lightNovelCatalog;
}
