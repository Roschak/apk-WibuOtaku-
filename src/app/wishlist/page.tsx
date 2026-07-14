import Link from 'next/link';

import { AnimatedList } from '@/components/animated-list';
import { PageHeader } from '@/components/page-header';
import { Pill } from '@/components/pill';
import { Reveal } from '@/components/reveal';
import { Surface } from '@/components/surface';
import { libraryItems } from '@/lib/site-data';

export default function WishlistPage() {
    const pinnedItems = libraryItems.filter((item) => item.status === 'Pinned');
    const wishlistItems = libraryItems.filter((item) => item.status === 'Wishlist');

    return (
        <div className="space-y-8 pb-6">
            <PageHeader
                eyebrow="Wishlist"
                title="Daftar yang belum mulai, tapi sudah mau ditonton atau dibaca nanti."
                description="Pin dan wishlist dipisah supaya dashboard utama tetap bersih: pin untuk favorit aktif, wishlist untuk target berikutnya."
            />

            <Reveal>
            <Surface>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        ['Pin aktif', String(pinnedItems.length), 'Masuk dashboard utama'],
                        ['Wishlist', String(wishlistItems.length), 'Belum mulai tapi ingin diikuti'],
                        ['Progress tersimpan', `${libraryItems.length}`, 'Episode, chapter, dan volume terakhir'],
                    ].map(([label, value, detail]) => (
                        <div key={label} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{label}</p>
                            <p className="mt-3 font-display text-4xl font-semibold text-white">{value}</p>
                            <p className="mt-2 text-sm leading-7 text-white/64">{detail}</p>
                        </div>
                    ))}
                </div>
            </Surface>
            </Reveal>

            <div className="space-y-8">
                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Pin aktif</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold text-white">Yang paling sering dibuka dan dipantau.</h2>
                        </div>
                        <Pill tone="gold">{pinnedItems.length} item</Pill>
                    </div>
                    <AnimatedList>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {pinnedItems.map((item) => (
                            <Reveal key={item.title}>
                            <Surface className="flex flex-col justify-between gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(247,195,95,0.1)]">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{item.kind}</p>
                                            <h3 className="mt-2 font-display text-2xl font-semibold text-white transition-colors duration-200 group-hover/surface:text-amber-50">{item.title}</h3>
                                        </div>
                                        <Pill tone={item.tone}>{item.status}</Pill>
                                    </div>
                                    <p className="text-sm leading-7 text-white/68">{item.note}</p>
                                    <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 transition-all duration-200 hover:border-white/15 hover:bg-black/25">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Progress</p>
                                        <p className="mt-2 text-sm text-white/72">{item.progress}</p>
                                    </div>
                                </div>
                                <Link
                                    href={item.href}
                                    className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-200/20 hover:bg-amber-200/10 hover:text-amber-50 active:scale-95"
                                >
                                    Buka detail
                                </Link>
                            </Surface>
                            </Reveal>
                        ))}
                    </div>
                    </AnimatedList>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Wishlist</p>
                            <h2 className="mt-2 font-display text-2xl font-semibold text-white">Target berikutnya untuk ditonton atau dibaca.</h2>
                        </div>
                        <Pill tone="blue">{wishlistItems.length} item</Pill>
                    </div>
                    <AnimatedList>
                    <div className="grid gap-4 lg:grid-cols-2">
                        {wishlistItems.map((item) => (
                            <Reveal key={item.title}>
                            <Surface className="flex flex-col justify-between gap-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(99,179,237,0.1)]">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">{item.kind}</p>
                                            <h3 className="mt-2 font-display text-2xl font-semibold text-white">{item.title}</h3>
                                        </div>
                                        <Pill tone={item.tone}>{item.status}</Pill>
                                    </div>
                                    <p className="text-sm leading-7 text-white/68">{item.note}</p>
                                    <div className="rounded-2xl border border-white/10 bg-black/18 px-4 py-3 transition-all duration-200 hover:border-white/15 hover:bg-black/25">
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/46">Progress</p>
                                        <p className="mt-2 text-sm text-white/72">{item.progress}</p>
                                    </div>
                                </div>
                                <Link
                                    href={item.href}
                                    className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-200/20 hover:bg-sky-200/10 hover:text-sky-50 active:scale-95"
                                >
                                    Buka detail
                                </Link>
                            </Surface>
                            </Reveal>
                        ))}
                    </div>
                    </AnimatedList>
                </section>
            </div>
        </div>
    );
}