const ANILIST_API = 'https://graphql.anilist.co';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

/** Rate limiter: max 30 req/min per AniList ToS */
let lastRequestTime = 0;
const MIN_INTERVAL = 2000; // 2 seconds between requests

async function rateLimit() {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < MIN_INTERVAL) {
        await new Promise((r) => setTimeout(r, MIN_INTERVAL - elapsed));
    }
    lastRequestTime = Date.now();
}

type AnilistResponse<T> = {
    data?: T;
    errors?: { message: string }[];
};

export async function queryAnilist<T>(
    query: string,
    variables: Record<string, unknown> = {},
): Promise<T> {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            await rateLimit();

            const res = await fetch(ANILIST_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ query, variables }),
                next: { revalidate: 3600 },
            });

            if (res.status === 429) {
                // Rate limited — wait and retry
                await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
                continue;
            }

            const json: AnilistResponse<T> = await res.json();

            if (json.errors) {
                console.error('[AniList] GraphQL errors:', json.errors);
                if (attempt < MAX_RETRIES) {
                    await new Promise((r) => setTimeout(r, RETRY_DELAY));
                    continue;
                }
                throw new Error(json.errors[0]?.message || 'AniList API error');
            }

            return json.data as T;
        } catch (err) {
            if (attempt === MAX_RETRIES) throw err;
            await new Promise((r) => setTimeout(r, RETRY_DELAY));
        }
    }

    throw new Error('AniList request failed after retries');
}

// ─── Queries ───

export const TRENDING_ANIME = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
      id
      title { romaji english native }
      coverImage { large color }
      episodes
      status
      season
      seasonYear
      format
      studios(isMain: true) { nodes { name } }
      source
      genres
      averageScore
      meanScore
      description
      nextAiringEpisode { airingAt episode }
      startDate { year month day }
      endDate { year month day }
    }
  }
}
`;

export const ANIME_BY_ID = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title { romaji english native }
    coverImage { large color }
    bannerImage
    description
    episodes
    duration
    status
    season
    seasonYear
    format
    studios(isMain: true) { nodes { name } }
    source
    genres
    tags { name }
    averageScore
    meanScore
    popularity
    favourites
    startDate { year month day }
    endDate { year month day }
    nextAiringEpisode { airingAt episode }
    characters(sort: [ROLE], perPage: 8) {
      edges {
        role
        node { id name { full } image { medium } }
        voiceActors(sort: [LANGUAGE]) { name { full } language }
      }
    }
    staff(perPage: 6) {
      edges { role node { name { full } } }
    }
    relations(perPage: 6) {
      edges {
        relationType
        node { id title { romaji } type format }
      }
    }
    recommendations(perPage: 4, sort: [RATING_DESC]) {
      edges {
        node { mediaRecommendation { id title { romaji } } }
      }
    }
    trailer { id site }
    streamingEpisodes { title url }
  }
}
`;

export const SEARCH_ANIME = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME, isAdult: false) {
      id
      title { romaji english }
      coverImage { large color }
      episodes
      status
      format
      season
      seasonYear
      studios(isMain: true) { nodes { name } }
      genres
      averageScore
      description
    }
    pageInfo { total currentPage lastPage hasNextPage }
  }
}
`;

export const TRENDING_MANGA = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: MANGA, sort: TRENDING_DESC, isAdult: false) {
      id
      title { romaji english native }
      coverImage { large color }
      chapters
      volumes
      status
      format
      genres
      averageScore
      description
      startDate { year month day }
    }
  }
}
`;

export const MANGA_BY_ID = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id
    title { romaji english native }
    coverImage { large color }
    bannerImage
    description
    chapters
    volumes
    status
    format
    genres
    tags { name }
    averageScore
    meanScore
    popularity
    favourites
    startDate { year month day }
    endDate { year month day }
    staff(perPage: 5) {
      edges { role node { name { full } } }
    }
    relations(perPage: 6) {
      edges {
        relationType
        node { id title { romaji } type format }
      }
    }
    recommendations(perPage: 4, sort: [RATING_DESC]) {
      edges {
        node { mediaRecommendation { id title { romaji } } }
      }
    }
  }
}
`;

export const SEARCH_MANGA = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: MANGA, isAdult: false) {
      id
      title { romaji english }
      coverImage { large color }
      chapters
      volumes
      status
      format
      genres
      averageScore
      description
    }
    pageInfo { total currentPage lastPage hasNextPage }
  }
}
`;
