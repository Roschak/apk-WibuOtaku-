import Link from 'next/link';

import { AnimatedList } from '@/components/animated-list';
import { ContentCard } from '@/components/content-card';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { queryAnilist, TRENDING_MANGA } from '@/lib/anilist';
import { mapMangaList, getFallbackMangaList, type RawMangaList } from '@/lib/ani-adapters';
import { getTopManga } from '@/lib/jikan';
import { adaptJikanManga } from '@/lib/jikan-adapters';
import type { MangaDetail } from '@/lib/site-data';

function MangaPageContent({ mangaList }: { mangaList: MangaDetail[] }) {
    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Modul manga"
                title="Chapter global, chapter Indonesia, dan lisensi legal dalam satu tampilan."
                description="Fokus pada status ongoing, hiatus, atau tamat, lalu bandingkan chapter resmi dengan chapter di Indonesia ketika tersedia."
                actions={
                    <>
                        <Link href="/search" className="rounded-full border border-btn-secondary bg-btn-secondary px-5 py-3 text-sm font-semibold text-ink">
                            Cari judul
                        </Link>
                        <Link href="/koleksi" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#1a1a2e]">
                            Buka koleksi
                        </Link>
                    </>
                }
            />

            <AnimatedList>
            <div className="grid gap-4 lg:grid-cols-3">
                {mangaList.map((item) => (
                    <ContentCard key={item.slug} {...item} href={`/manga/${item.slug}`} />
                ))}
            </div>
            </AnimatedList>

            <Reveal>
            <Surface>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-muted">Panduan lisensi</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {[
                        ['Global chapter', 'Chapter terbaru dari sumber resmi atau agregat legal.'],
                        ['Chapter Indonesia', 'Pisahkan angka resmi lokal supaya tidak tercampur.'],
                        ['Platform baca', 'Tampilkan platform legal dan status lisensinya.'],
                    ].map(([title, detail]) => (
                        <div key={title} className="rounded-3xl border border-surface bg-card p-5">
                            <p className="font-semibold text-ink">{title}</p>
                            <p className="mt-2 text-sm leading-7 text-ink-secondary">{detail}</p>
                        </div>
                    ))}
                </div>
            </Surface>
            </Reveal>
        </div>
    );
}

export default async function MangaPage() {
    // Try AniList first
    try {
        const raw = await queryAnilist<RawMangaList>(TRENDING_MANGA, {
            page: 1,
            perPage: 9,
        });
        const mapped = mapMangaList(raw);
        if (mapped.length > 0) {
            return <MangaPageContent mangaList={mapped} />;
        }
    } catch (err) {
        console.warn('[Manga] AniList fetch failed, trying Jikan fallback:', err);
    }

    // Fallback: try Jikan API
    try {
        const jikanManga = await getTopManga(1, 9);
        if (jikanManga && jikanManga.length > 0) {
            return <MangaPageContent mangaList={jikanManga.map(adaptJikanManga)} />;
        }
    } catch (err2) {
        console.warn('[Manga] Jikan fallback also failed:', err2);
    }

    // Ultimate fallback: static data
    return <MangaPageContent mangaList={getFallbackMangaList()} />;
}
