import Link from 'next/link';

import { ContentCard } from '@/components/content-card';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { LiveCountdownSection } from '@/components/live-countdown';
import {
    animeCatalog,
    dashboardStats,
    lightNovelCatalog,
    notificationFeed,
    roadmap,
    releaseSources,
    weeklyCalendar,
    mangaCatalog,
} from '@/lib/site-data';

function MetricTile({ label, value, note, tone }: { label: string; value: string; note: string; tone: string }) {
    return (
        <Surface className="h-full">
            <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">{label}</p>
                <p className="font-display text-4xl font-bold text-white">{value}</p>
                <p className="text-sm leading-7 text-white/66">{note}</p>
                <span
                    className={`inline-flex animate-scale-in rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${tone === 'gold'
                        ? 'border-amber-200/20 bg-amber-200/10 text-amber-50'
                        : tone === 'blue'
                            ? 'border-sky-200/20 bg-sky-200/10 text-sky-50'
                            : tone === 'rose'
                                ? 'border-rose-200/20 bg-rose-200/10 text-rose-50'
                                : 'border-emerald-200/20 bg-emerald-200/10 text-emerald-50'
                        }`}
                >
                    live
                </span>
            </div>
        </Surface>
    );
}

export default function HomePage() {
    return (
        <div className="space-y-8 pb-6">
            <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <Reveal animation="scale-in">
                <Surface className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,195,95,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_32%)]" />
                    <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                        <div className="max-w-3xl space-y-6">
                            <Pill tone="gold">Blueprint produk</Pill>
                            <div className="space-y-4">
                                <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
                                    Satu dashboard untuk anime, manga, dan light novel Indonesia.
                                </h1>
                                <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                                    WibuOtaku dirancang untuk memantau tayangan, progres baca, gap volume Jepang vs Indonesia,
                                    serta pipeline scraping otomatis tanpa tampilan yang terasa generik.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/anime"
                                className="inline-flex items-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                            >
                                Lihat anime
                            </Link>
                            <Link
                                href="/light-novel"
                                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/12"
                            >
                                Cek gap LN
                            </Link>
                            <Link
                                href="/kalender"
                                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/12"
                            >
                                Buka kalender
                            </Link>
                        </div>
                    </div>
                </Surface>
                </Reveal>

                <Reveal animation="scale-in" delay={100}>
                <Surface className="flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Scrape pipeline</p>
                        <h2 className="font-display text-2xl font-semibold text-white">Jalur update yang harus selalu hidup.</h2>
                        <p className="text-sm leading-7 text-white/68">
                            Data ditarik dari API publik dan feed publisher, lalu siap untuk normalisasi, dedupe, dan review.
                        </p>
                    </div>
                    <div className="space-y-3">
                        {releaseSources.slice(0, 3).map((source) => (
                            <div key={source.name} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{source.name}</p>
                                        <p className="text-sm text-white/56">{source.kind} • {source.cadence}</p>
                                    </div>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/64">
                                        {source.status}
                                    </span>
                                </div>
                                <p className="mt-3 text-sm text-white/68">{source.delta} • {source.lastRun}</p>
                            </div>
                        ))}
                    </div>
                </Surface>
                </Reveal>
            </section>

            <Reveal>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                    <MetricTile key={stat.label} {...stat} />
                ))}
            </section>
            </Reveal>

            <LiveCountdownSection />

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                    <div className="grid gap-4 lg:grid-cols-3 [&>*]:opacity-0 [&>*]:animate-fade-in-up">
                        {animeCatalog.map((item, i) => (
                            <div key={item.slug} style={{ animationDelay: `${i * 60}ms` }}>
                                <ContentCard {...item} href={`/anime/${item.slug}`} />
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3 [&>*]:opacity-0 [&>*]:animate-fade-in-up">
                        {mangaCatalog.map((item, i) => (
                            <div key={item.slug} style={{ animationDelay: `${i * 60}ms` }}>
                                <ContentCard {...item} href={`/manga/${item.slug}`} />
                            </div>
                        ))}
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3 [&>*]:opacity-0 [&>*]:animate-fade-in-up">
                        {lightNovelCatalog.map((item, i) => (
                            <div key={item.slug} style={{ animationDelay: `${i * 60}ms` }}>
                                <ContentCard {...item} href={`/light-novel/${item.slug}`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Surface>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/48">Notifikasi terbaru</p>
                                <h3 className="mt-2 font-display text-2xl font-semibold text-white">Update yang harus muncul di depan.</h3>
                            </div>
                            <Link href="/notifikasi" className="text-sm font-semibold text-amber-100 hover:text-white">
                                Semua notifikasi
                            </Link>
                        </div>
                        <div className="mt-5 space-y-3">
                            {notificationFeed.map((item) => (
                                <Reveal key={item.title}>
                                <div className="rounded-2xl border border-white/10 bg-black/18 p-4 transition-all duration-200 hover:border-white/15 hover:bg-black/25">
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="font-semibold text-white">{item.title}</p>
                                        <Pill tone={item.tone}>{item.time}</Pill>
                                    </div>
                                    <p className="mt-2 text-sm leading-7 text-white/68">{item.detail}</p>
                                </div>
                                </Reveal>
                            ))}
                        </div>
                    </Surface>

                    <Reveal>
                    <Surface>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Roadmap</p>
                        <h3 className="mt-2 font-display text-2xl font-semibold text-white">Progress bertahap tanpa lompat terlalu jauh.</h3>
                        <div className="mt-5 space-y-3">
                            {roadmap.map((item) => (
                                <Reveal key={item.title}>
                                <div className="rounded-2xl border border-white/10 bg-black/18 p-4 transition-all duration-200 hover:border-white/15 hover:bg-black/25">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/46">
                                                {item.phase}
                                            </p>
                                            <p className="mt-1 font-semibold text-white">{item.title}</p>
                                        </div>
                                        <Pill tone={item.tone}>{item.progress}</Pill>
                                    </div>
                                    <p className="mt-3 text-sm leading-7 text-white/68">{item.note}</p>
                                </div>
                                </Reveal>
                            ))}
                        </div>
                    </Surface>
                    </Reveal>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <Reveal>
                <Surface>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Kalender singkat</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white">Ritme rilis mingguan yang gampang dipindai.</h3>
                    <div className="mt-5 space-y-3">
                        {weeklyCalendar.slice(0, 3).map((day) => (
                            <div key={day.day} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-white">{day.day}</p>
                                        <p className="text-sm text-white/54">{day.subtitle}</p>
                                    </div>
                                    <span className="text-xs uppercase tracking-[0.24em] text-white/40">{day.items.length} item</span>
                                </div>
                                <div className="mt-3 space-y-2">
                                    {day.items.map((item) => (
                                        <div key={`${day.day}-${item.title}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/4 px-3 py-2">
                                            <div>
                                                <p className="font-medium text-white">{item.title}</p>
                                                <p className="text-sm text-white/54">{item.label}</p>
                                            </div>
                                            <Pill tone={item.tone}>{item.time}</Pill>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Surface>
                </Reveal>

                <Reveal delay={100}>
                <Surface>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">Data model ready</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white">Struktur konten yang cocok untuk web, API, dan scraper.</h3>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {[
                            ['Anime', 'Jadwal tayang, episode, studio, dan source adaptasi.'],
                            ['Manga', 'Global chapter, chapter Indonesia, dan status lisensi.'],
                            ['Light Novel', 'Volume Jepang vs Indonesia, gap, dan ISBN.'],
                            ['Library', 'Pin, wishlist, progress, rating, dan koleksi fisik.'],
                        ].map(([title, detail]) => (
                            <div key={title} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                <p className="font-semibold text-white">{title}</p>
                                <p className="mt-2 text-sm leading-7 text-white/64">{detail}</p>
                            </div>
                        ))}
                    </div>
                </Surface>
                </Reveal>
            </section>
        </div>
    );
}