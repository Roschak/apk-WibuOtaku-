import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AnimatedList } from '@/components/animated-list';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { queryAnilist, MANGA_BY_ID } from '@/lib/anilist';
import { adaptManga, getFallbackMangaBySlug, type RawManga } from '@/lib/ani-adapters';
import { getMangaById } from '@/lib/jikan';
import { adaptJikanManga } from '@/lib/jikan-adapters';
import { mangaCatalog } from '@/lib/site-data';

export function generateStaticParams() {
    return mangaCatalog.map((item) => ({ id: item.slug }));
}

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const numericId = Number(id);

    let item = !isNaN(numericId) ? undefined : getFallbackMangaBySlug(id);

    if (!item && !isNaN(numericId)) {
        try {
            const raw = await queryAnilist<{ Media: RawManga }>(MANGA_BY_ID, { id: numericId });
            if (raw?.Media) {
                item = adaptManga(raw.Media);
            }
        } catch (err) {
            console.warn('[Manga/' + id + '] AniList fetch failed, trying Jikan:', err);
        }

        if (!item) {
            try {
                const jikanData = await getMangaById(numericId);
                if (jikanData) {
                    item = adaptJikanManga(jikanData);
                }
            } catch (err2) {
                console.warn('[Manga/' + id + '] Jikan fallback also failed:', err2);
            }
        }
    }

    if (!item) {
        item = getFallbackMangaBySlug(id);
    }

    if (!item) {
        notFound();
    }

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Detail manga"
                title={item.title}
                description={item.synopsis}
                actions={
                    <>
                        <Link href="/manga" className="rounded-full border border-btn-secondary bg-btn-secondary px-5 py-3 text-sm font-semibold text-ink">
                            Kembali ke list
                        </Link>
                        <Link href="/wishlist" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#1a1a2e]">
                            Pin ke wishlist
                        </Link>
                    </>
                }
            />

            <Surface className="space-y-6">
                <Reveal>
                <div className="flex flex-wrap gap-2">
                    <Pill tone={item.tone}>{item.kicker}</Pill>
                    <Pill tone="slate">{item.status}</Pill>
                </div>
                </Reveal>

                <Reveal>
                <AnimatedList>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    {item.detailFacts.map((fact) => (
                        <div key={fact.label} className="rounded-2xl border border-surface bg-card p-4 transition-all duration-200 hover:border-surface-hover hover:bg-card-hover">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">{fact.label}</p>
                            <p className="mt-2 text-sm font-semibold text-ink">{fact.value}</p>
                        </div>
                    ))}
                </div>
                </AnimatedList>
                </Reveal>

                <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                    <Reveal>
                    <div className="rounded-3xl border border-surface bg-card p-5 transition-all duration-200 hover:border-surface-hover hover:bg-card-hover">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Summary</p>
                        <p className="mt-3 text-sm leading-7 text-ink-secondary">{item.blurb}</p>
                        <AnimatedList>
                        <div className="mt-5 space-y-3">
                            {item.releaseNotes.map((point) => (
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
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">Distribusi</p>
                        <AnimatedList>
                        <div className="mt-4 grid gap-3">
                            {[
                                ['Tipe', item.type],
                                ['Chapter global', item.globalChapter],
                                ['Chapter Indonesia', item.indoChapter],
                                ['Platform legal', item.legalPlatform],
                                ['Penerbit', item.publisher],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-2xl border border-surface bg-card px-4 py-3 transition-all duration-200 hover:border-surface-hover hover:bg-card-hover">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">{label}</p>
                                    <p className="mt-2 text-sm text-ink-secondary">{value}</p>
                                </div>
                            ))}
                        </div>
                        </AnimatedList>
                    </div>
                    </Reveal>
                </div>
            </Surface>
        </div>
    );
}
