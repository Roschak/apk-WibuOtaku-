import Link from 'next/link';

import { AnimatedList } from '@/components/animated-list';
import { ContentCard } from '@/components/content-card';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { lightNovelCatalog } from '@/lib/site-data';
import { loadScrapedLNData, hasScrapedData, getLastScrapedAt, type ScrapedLNEntry } from '@/lib/ln-scraper-data';

export default function LightNovelPage() {
    // Coba muat data dari scraper; fallback ke static catalog
    const scrapedData = loadScrapedLNData();
    const dataAvailable = hasScrapedData();
    const lastScraped = getLastScrapedAt();

    // Merge: scraped items + static items (tanpa duplikat slug)
    const scrapedItems: ScrapedLNEntry[] = scrapedData?.items || [];
    const scrapedSlugs = new Set(scrapedItems.map((i) => i.slug));
    const staticEntries = lightNovelCatalog
        .filter((i) => !scrapedSlugs.has(i.slug))
        .map((item) => ({ ...item, _source: 'static' as const }));
    const displayItems = [...scrapedItems, ...staticEntries];

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Modul light novel"
                title="Volume Jepang vs Indonesia ditampilkan berdampingan, bukan tersembunyi di paragraf panjang."
                description="Halaman ini adalah pembeda utama WibuOtaku: gap volume, tanggal rilis, ISBN, harga, dan link beli legal dibuat eksplisit."
                actions={
                    <>
                        <Link href="/koleksi" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
                            Koleksi fisik
                        </Link>
                        <Link href="/notifikasi" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
                            Alert rilis
                        </Link>
                    </>
                }
            />

            {/* Status scraper */}
            {dataAvailable && lastScraped && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200/15 bg-emerald-200/8 px-4 py-3 text-sm text-emerald-100/72">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Data diperbarui otomatis via scraper — {new Date(lastScraped).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })} WIB
                </div>
            )}

            <AnimatedList>
            <div className="grid gap-4 lg:grid-cols-3">
                {displayItems.map((item) => (
                    <div key={item.slug} className="relative">
                        {/* Source badge */}
                        {item._source === 'scraped' && (
                            <span className="absolute -top-2 -right-2 z-10 rounded-full border border-emerald-200/20 bg-emerald-900/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200 backdrop-blur-sm">
                                Auto-track
                            </span>
                        )}
                        <ContentCard
                            title={item.title}
                            kicker={item.kicker}
                            blurb={item.blurb}
                            status={item.status}
                            meta={item.meta}
                            tone={item.tone}
                            cta={item.cta}
                            href={`/light-novel/${item.slug}`}
                        />
                    </div>
                ))}
            </div>
            </AnimatedList>

            {/* Legend */}
            {dataAvailable && (
                <Reveal>
                <Surface>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/20 bg-emerald-900/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Auto-track
                        </span>
                        <span className="text-white/48">Data dari scraping otomatis via publisher API/katalog</span>
                    </div>
                </Surface>
                </Reveal>
            )}

            <Reveal>
            <Surface>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Kunci tampilan</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {[
                        ['JP vs ID', 'Volume terbaru Jepang dan Indonesia ditempatkan paralel.'],
                        ['Gap volume', 'Selisih volume dihitung dan disorot di kartu utama.'],
                        ['Beli legal', 'Harga, ISBN, dan link pre-order dibuat jelas.'],
                    ].map(([title, detail]) => (
                        <div key={title} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <p className="font-semibold text-white">{title}</p>
                            <p className="mt-2 text-sm leading-7 text-white/64">{detail}</p>
                        </div>
                    ))}
                </div>
            </Surface>
            </Reveal>
        </div>
    );
}