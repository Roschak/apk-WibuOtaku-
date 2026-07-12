import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';
import { getMangaBySlug } from '@/lib/site-data';

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const item = getMangaBySlug(id);

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
                        <Link href="/manga" className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white">
                            Kembali ke list
                        </Link>
                        <Link href="/wishlist" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
                            Pin ke wishlist
                        </Link>
                    </>
                }
            />

            <Surface className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    <Pill tone={item.tone}>{item.kicker}</Pill>
                    <Pill tone="slate">{item.status}</Pill>
                </div>

                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    {item.detailFacts.map((fact) => (
                        <div key={fact.label} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{fact.label}</p>
                            <p className="mt-2 text-sm font-semibold text-white">{fact.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Summary</p>
                        <p className="mt-3 text-sm leading-7 text-white/68">{item.blurb}</p>
                        <div className="mt-5 space-y-3">
                            {item.releaseNotes.map((point) => (
                                <div key={point} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/72">
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Distribusi</p>
                        <div className="mt-4 grid gap-3">
                            {[
                                ['Tipe', item.type],
                                ['Chapter global', item.globalChapter],
                                ['Chapter Indonesia', item.indoChapter],
                                ['Platform legal', item.legalPlatform],
                                ['Penerbit', item.publisher],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{label}</p>
                                    <p className="mt-2 text-sm text-white/72">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Surface>
        </div>
    );
}