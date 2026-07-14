import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AnimatedList } from '@/components/animated-list';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { getLightNovelBySlug, lightNovelCatalog } from '@/lib/site-data';
import { getScrapedLNBySlug, type ScrapedLNEntry } from '@/lib/ln-scraper-data';

export function generateStaticParams() {
    return lightNovelCatalog.map((item) => ({ id: item.slug }));
}

export default async function LightNovelDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Coba data scraped dulu, fallback ke static
    const scrapedItem = getScrapedLNBySlug(id);
    const staticItem = getLightNovelBySlug(id);
    const item = (scrapedItem || staticItem) as ScrapedLNEntry | typeof staticItem | null;

    if (!item) {
        notFound();
    }

    const isScraped = '_source' in item && item._source === 'scraped';

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Detail light novel"
                title={item.title}
                description={item.synopsis}
                actions={
                    <>
                        <Link href="/light-novel" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
                            Kembali ke list
                        </Link>
                        <Link href="/wishlist" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
                            Tandai wishlist
                        </Link>
                    </>
                }
            />

            <Surface className="space-y-6">
                <Reveal>
                <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={item.tone}>{item.kicker}</Pill>
                    <Pill tone="slate">{item.status}</Pill>
                    <Pill tone="slate">{item.gap}</Pill>
                    {isScraped && (
                        <span className="rounded-full border border-emerald-200/20 bg-emerald-900/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
                            Auto-tracked
                        </span>
                    )}
                    {isScraped && '_url' in item && item._url && (
                        <a
                            href={item._url}
                            target="_blank"
                            rel="noopener"
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60 transition hover:bg-white/10 hover:text-white/80"
                        >
                            Sumber
                        </a>
                    )}
                </div>
                </Reveal>

                <Reveal>
                <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5 transition-all duration-200 hover:border-white/15 hover:bg-black/22">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Volume Jepang</p>
                        <p className="mt-3 font-display text-3xl font-semibold text-white">{item.jpVolume}</p>
                        <p className="mt-2 text-sm text-white/62">{item.jpDate}</p>
                        <p className="mt-5 text-sm leading-7 text-white/68">Publisher: {item.publisherJP}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5 transition-all duration-200 hover:border-white/15 hover:bg-black/22">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Volume Indonesia</p>
                        <p className="mt-3 font-display text-3xl font-semibold text-white">{item.idVolume}</p>
                        <p className="mt-2 text-sm text-white/62">{item.idDate}</p>
                        <p className="mt-5 text-sm leading-7 text-white/68">Publisher: {item.publisherID}</p>
                    </div>
                </div>
                </Reveal>

                {/* Visual Gap Indicator — hanya jika data Jepang tersedia */}
                <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Visual Gap</p>
                    <div className="mt-4 space-y-3">
                        {(() => {
                            const jpNum = parseInt(String(item.jpVolume).replace(/\D/g, '')) || 0;
                            const idNum = parseInt(String(item.idVolume).replace(/\D/g, '')) || 0;

                            if (jpNum === 0) {
                                return (
                                    <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-6 text-center text-sm text-white/48">
                                        Data volume Jepang belum tersedia.
                                        {isScraped && ' Data akan ditambahkan setelah scraping berikutnya.'}
                                    </div>
                                );
                            }

                            const gap = jpNum - idNum;
                            const total = jpNum;
                            const idPercent = Math.min((idNum / total) * 100, 100);

                            return (
                                <>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm font-medium text-white/72">JP: {item.jpVolume}</span>
                                        <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-1000"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm font-medium text-white/72">ID: {item.idVolume}</span>
                                        <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-200 transition-all duration-1000"
                                                style={{ width: `${idPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                        <span className="inline-flex items-center rounded-full border border-rose-200/20 bg-rose-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-50">
                                            Gap {gap} volume
                                        </span>
                                        <span className="text-xs text-white/48">ID tertinggal {idNum}/{jpNum} volume</span>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                    <Reveal>
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5 transition-all duration-200 hover:border-white/15 hover:bg-black/22">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Detail rilis</p>
                        <AnimatedList>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {item.detailFacts.map((fact) => (
                                <div key={fact.label} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-white/15 hover:bg-white/6">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{fact.label}</p>
                                    <p className="mt-2 text-sm text-white/72">{fact.value}</p>
                                </div>
                            ))}
                        </div>
                        </AnimatedList>
                    </div>
                    </Reveal>
                    <Reveal delay={80}>
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5 transition-all duration-200 hover:border-white/15 hover:bg-black/22">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Cover & listing</p>
                        <AnimatedList>
                        <div className="mt-4 space-y-3">
                            {item.coverNotes.map((note) => (
                                <div key={note} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/72 transition-all duration-200 hover:border-white/15 hover:bg-white/6">
                                    {note}
                                </div>
                            ))}
                        </div>
                        </AnimatedList>
                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Metadata</p>
                        <div className="mt-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white/72 transition-all duration-200 hover:border-white/15 hover:bg-white/6">
                            Harga: {item.priceID} • ISBN: {item.isbn}
                        </div>
                    </div>
                    </Reveal>
                </div>

                <Reveal>
                <div className="rounded-3xl border border-white/10 bg-black/18 p-5 transition-all duration-200 hover:border-white/15 hover:bg-black/22">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Riwayat update</p>
                    <AnimatedList>
                    <div className="mt-4 space-y-3">
                        {item.releaseNotes.map((note) => (
                            <div key={note} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/72 transition-all duration-200 hover:border-white/15 hover:bg-white/6">
                                {note}
                            </div>
                        ))}
                    </div>
                    </AnimatedList>
                </div>
                </Reveal>
            </Surface>
        </div>
    );
}