import Link from 'next/link';

import { AnimatedList } from '@/components/animated-list';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { roadmap, releaseSources } from '@/lib/site-data';

export default function AdminPage() {
    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Admin panel"
                title="Kelola sumber scrape, review match, dan status pipeline dari satu tempat."
                description="Halaman ini menjadi pusat kontrol untuk verifikasi manual, sumber aktif, dan monitoring perubahan data yang masuk."
                actions={
                    <Link href="/search" className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950">
                        Cari data
                    </Link>
                }
            />

            <Reveal>
            <AnimatedList>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    ['Sumber aktif', '4'],
                    ['Antrian review', '7'],
                    ['Update hari ini', '37'],
                    ['Error sumber', '1'],
                ].map(([label, value]) => (
                    <Surface key={label} className="space-y-3 transition-all duration-200 hover:border-white/15">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{label}</p>
                        <p className="font-display text-4xl font-semibold text-white">{value}</p>
                    </Surface>
                ))}
            </div>
            </AnimatedList>
            </Reveal>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <Reveal>
                <Surface className="space-y-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Scrape sources</p>
                        <h2 className="mt-2 font-display text-2xl font-semibold text-white">Status sumber yang sedang dijalankan.</h2>
                    </div>
                    <AnimatedList>
                    <div className="space-y-3">
                        {releaseSources.map((source) => (
                            <div key={source.name} className="rounded-3xl border border-white/10 bg-black/18 p-4 transition-all duration-200 hover:border-white/15 hover:bg-black/22">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{source.name}</p>
                                        <p className="text-sm text-white/56">{source.kind} • {source.cadence}</p>
                                    </div>
                                    <Pill tone={source.status === 'Aktif' ? 'emerald' : 'rose'}>{source.status}</Pill>
                                </div>
                                <p className="mt-3 text-sm text-white/68">{source.delta} • {source.lastRun}</p>
                            </div>
                        ))}
                    </div>
                    </AnimatedList>
                </Surface>
                </Reveal>

                <Reveal delay={80}>
                <Surface className="space-y-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Queue review</p>
                        <h2 className="mt-2 font-display text-2xl font-semibold text-white">Entitas yang butuh verifikasi manual.</h2>
                    </div>
                    <AnimatedList>
                    <div className="space-y-3">
                        {[
                            'Light Novel: match ISBN baru dari publisher lokal.',
                            'Anime: sinkronisasi judul romaji vs judul Indonesia.',
                            'Manga: chapter legal Indonesia belum punya publisher tetap.',
                            'Feed komunitas: berita pre-order butuh konfirmasi.',
                        ].map((item) => (
                            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white/72 transition-all duration-200 hover:border-white/15 hover:bg-white/8">
                                {item}
                            </div>
                        ))}
                    </div>
                    </AnimatedList>
                </Surface>
                </Reveal>
            </div>

            <Reveal>
            <Surface>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Roadmap view</p>
                <AnimatedList>
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {roadmap.map((item) => (
                        <div key={item.title} className="rounded-3xl border border-white/10 bg-black/18 p-5 transition-all duration-200 hover:border-white/15 hover:bg-black/22">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{item.phase}</p>
                                    <p className="mt-2 font-semibold text-white">{item.title}</p>
                                </div>
                                <Pill tone={item.tone}>{item.progress}</Pill>
                            </div>
                            <p className="mt-3 text-sm leading-7 text-white/68">{item.note}</p>
                        </div>
                    ))}
                </div>
                </AnimatedList>
            </Surface>
            </Reveal>
        </div>
    );
}