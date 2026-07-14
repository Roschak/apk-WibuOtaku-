/**
 * jikan.ts — Jikan API v4 client (unofficial MyAnimeList API)
 *
 * Rate limit: ~60 req/min. Cache-friendly (Jikan caches results for 24h).
 * Retry logic with exponential backoff on 429.
 */

const JIKAN_API = 'https://api.jikan.moe/v4';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1200;

let lastRequestTime = 0;
const MIN_INTERVAL = 1100; // slightly above 1 req/sec to stay safe

async function rateLimit() {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < MIN_INTERVAL) {
        await new Promise((r) => setTimeout(r, MIN_INTERVAL - elapsed));
    }
    lastRequestTime = Date.now();
}

/**
 * Generic Jikan GET request with retry logic.
 */
export async function fetchJikan<T>(path: string): Promise<T> {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            await rateLimit();

            const res = await fetch(`${JIKAN_API}${path}`, {
                headers: { Accept: 'application/json' },
                next: { revalidate: 7200 }, // cache 2 hours
            });

            if (res.status === 429) {
                const wait = RETRY_DELAY * Math.pow(2, attempt);
                await new Promise((r) => setTimeout(r, wait));
                continue;
            }

            if (!res.ok) {
                if (attempt === MAX_RETRIES) {
                    throw new Error(`Jikan ${res.status}: ${res.statusText}`);
                }
                await new Promise((r) => setTimeout(r, RETRY_DELAY));
                continue;
            }

            const json = await res.json();
            return json.data as T;
        } catch (err) {
            if (attempt === MAX_RETRIES) throw err;
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
    }
    throw new Error('Jikan request failed after retries');
}

// ─── Response types ───

export type JikanAnime = {
    mal_id: number;
    url: string;
    images: {
        jpg: { image_url: string; small_image_url: string; large_image_url: string };
        webp: { image_url: string; small_image_url: string; large_image_url: string };
    };
    trailer: {
        youtube_id: string | null;
        url: string | null;
        embed_url: string | null;
    };
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    type: string;
    source: string;
    episodes: number | null;
    status: string;
    airing: boolean;
    aired: { from: string | null; to: string | null };
    duration: string;
    rating: string;
    score: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    synopsis: string | null;
    background: string | null;
    season: string | null;
    year: number | null;
    broadcast: { day: string | null; time: string | null; timezone: string | null; string: string | null };
    studios: { mal_id: number; name: string }[];
    genres: { mal_id: number; name: string }[];
    themes: { mal_id: number; name: string }[];
    demographics: { mal_id: number; name: string }[];
    relations?: Record<string, unknown>[];
    external?: { name: string; url: string }[];
    streaming?: { name: string; url: string }[];
};

export type JikanManga = {
    mal_id: number;
    url: string;
    images: {
        jpg: { image_url: string; small_image_url: string; large_image_url: string };
        webp: { image_url: string; small_image_url: string; large_image_url: string };
    };
    title: string;
    title_english: string | null;
    title_japanese: string | null;
    type: string;
    chapters: number | null;
    volumes: number | null;
    status: string;
    publishing: boolean;
    published: { from: string | null; to: string | null };
    score: number | null;
    scored_by: number | null;
    rank: number | null;
    popularity: number | null;
    members: number | null;
    favorites: number | null;
    synopsis: string | null;
    background: string | null;
    authors: { mal_id: number; name: string }[];
    genres: { mal_id: number; name: string }[];
    themes: { mal_id: number; name: string }[];
    demographics: { mal_id: number; name: string }[];
    serializations: { mal_id: number; name: string }[];
    relations?: Record<string, unknown>[];
    external?: { name: string; url: string }[];
};

// ─── API Methods ───

/** Get top anime list */
export async function getTopAnime(page = 1, limit = 9): Promise<JikanAnime[]> {
    return fetchJikan<JikanAnime[]>(`/top/anime?page=${page}&limit=${limit}`);
}

/** Get anime detail by MAL ID */
export async function getAnimeById(id: number): Promise<JikanAnime | null> {
    try {
        return await fetchJikan<JikanAnime>(`/anime/${id}/full`);
    } catch (err) {
        // 404 or other errors — return null
        console.warn(`[Jikan] Anime ${id} not found:`, err);
        return null;
    }
}

/** Search anime by query */
export async function searchAnime(query: string, page = 1, limit = 4): Promise<JikanAnime[]> {
    return fetchJikan<JikanAnime[]>(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw`);
}

/** Get top manga list */
export async function getTopManga(page = 1, limit = 9): Promise<JikanManga[]> {
    return fetchJikan<JikanManga[]>(`/top/manga?page=${page}&limit=${limit}`);
}

/** Get manga detail by MAL ID */
export async function getMangaById(id: number): Promise<JikanManga | null> {
    try {
        return await fetchJikan<JikanManga>(`/manga/${id}/full`);
    } catch (err) {
        console.warn(`[Jikan] Manga ${id} not found:`, err);
        return null;
    }
}

/** Search manga by query */
export async function searchManga(query: string, page = 1, limit = 4): Promise<JikanManga[]> {
    return fetchJikan<JikanManga[]>(`/manga?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sfw`);
}
