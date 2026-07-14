import type { ReactNode } from 'react';

import { Skeleton, SkeletonCard, SkeletonPill, SkeletonText } from '@/components/skeleton';

function SkeletonSection({ children }: { children: ReactNode }) {
    return (
        <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl" aria-hidden="true">
            {children}
        </section>
    );
}

/** Dashboard homepage skeleton */
export function DashboardSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading dashboard">
            {/* Hero + scrape pipeline */}
            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <SkeletonSection>
                    <div className="space-y-6">
                        <SkeletonPill width="120px" />
                        <Skeleton width="80%" height="48px" />
                        <SkeletonText lines={2} lastLineWidth="65%" />
                        <div className="flex gap-3 pt-6">
                            <Skeleton width="130px" height="44px" className="rounded-full" />
                            <Skeleton width="120px" height="44px" className="rounded-full" />
                            <Skeleton width="120px" height="44px" className="rounded-full" />
                        </div>
                    </div>
                </SkeletonSection>
                <SkeletonSection>
                    <div className="space-y-4">
                        <SkeletonPill width="100px" />
                        <Skeleton width="75%" height="32px" />
                        <SkeletonText lines={2} lastLineWidth="70%" />
                        <div className="space-y-3 pt-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                    <Skeleton width="60%" height="20px" />
                                    <Skeleton width="40%" height="14px" className="mt-1" />
                                    <Skeleton width="50%" height="14px" className="mt-3" />
                                </div>
                            ))}
                        </div>
                    </div>
                </SkeletonSection>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonSection key={i}>
                        <div className="space-y-3">
                            <SkeletonPill width="80px" />
                            <Skeleton width="60px" height="40px" />
                            <SkeletonText lines={1} lastLineWidth="90%" />
                            <SkeletonPill width="50px" />
                        </div>
                    </SkeletonSection>
                ))}
            </div>

            {/* Content grid + sidebar */}
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                    {[1, 2, 3].map((row) => (
                        <div key={row} className="grid gap-4 lg:grid-cols-3">
                            {[1, 2, 3].map((col) => (
                                <SkeletonCard key={col} />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="space-y-6">
                    <SkeletonSection>
                        <SkeletonPill width="120px" />
                        <Skeleton width="70%" height="32px" className="mt-4" />
                        <div className="mt-5 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <Skeleton width="60%" height="20px" />
                                        <SkeletonPill width="80px" />
                                    </div>
                                    <SkeletonText lines={1} className="mt-2" />
                                </div>
                            ))}
                        </div>
                    </SkeletonSection>
                    <SkeletonSection>
                        <SkeletonPill width="80px" />
                        <Skeleton width="65%" height="32px" className="mt-4" />
                        <div className="mt-5 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                    <SkeletonPill width="70px" />
                                    <Skeleton width="55%" height="20px" className="mt-1" />
                                    <SkeletonText lines={1} className="mt-3" />
                                </div>
                            ))}
                        </div>
                    </SkeletonSection>
                </div>
            </div>

            {/* Bottom section */}
            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                <SkeletonSection>
                    <SkeletonPill width="100px" />
                    <Skeleton width="60%" height="32px" className="mt-4" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="mt-4 rounded-2xl border border-white/10 bg-black/18 p-4">
                            <Skeleton width="40%" height="20px" />
                            <Skeleton width="30%" height="14px" className="mt-1" />
                            <Skeleton width="60%" height="14px" className="mt-3" />
                        </div>
                    ))}
                </SkeletonSection>
                <SkeletonSection>
                    <SkeletonPill width="100px" />
                    <Skeleton width="60%" height="32px" className="mt-4" />
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                <Skeleton width="50%" height="20px" />
                                <SkeletonText lines={1} className="mt-2" lastLineWidth="80%" />
                            </div>
                        ))}
                    </div>
                </SkeletonSection>
            </div>
        </div>
    );
}

/** ── Anime List Page Skeleton ── */
export function AnimeListSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading anime list">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="100px" />
                <Skeleton width="75%" height="48px" />
                <SkeletonText lines={2} lastLineWidth="60%" />
                <div className="flex gap-3 pt-2">
                    <Skeleton width="120px" height="44px" className="rounded-full" />
                    <Skeleton width="130px" height="44px" className="rounded-full" />
                </div>
            </div>

            {/* 3 anime cards */}
            <div className="grid gap-4 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Weekly calendar section */}
            <SkeletonSection>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <SkeletonPill width="100px" />
                        <Skeleton width="50%" height="32px" className="mt-2" />
                    </div>
                    <div className="flex gap-2">
                        <SkeletonPill width="60px" />
                        <SkeletonPill width="60px" />
                        <SkeletonPill width="60px" />
                        <SkeletonPill width="60px" />
                        <SkeletonPill width="60px" />
                    </div>
                </div>
                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <Skeleton width="40%" height="28px" />
                            <Skeleton width="30%" height="14px" className="mt-1" />
                            <div className="mt-4 space-y-3">
                                {[1, 2].map((j) => (
                                    <div key={j} className="rounded-2xl border border-white/8 bg-white/4 p-3">
                                        <Skeleton width="55%" height="20px" />
                                        <Skeleton width="35%" height="14px" className="mt-1" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </SkeletonSection>
        </div>
    );
}

/** ── Manga List Page Skeleton ── */
export function MangaListSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading manga list">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="100px" />
                <Skeleton width="75%" height="48px" />
                <SkeletonText lines={2} lastLineWidth="60%" />
                <div className="flex gap-3 pt-2">
                    <Skeleton width="120px" height="44px" className="rounded-full" />
                    <Skeleton width="130px" height="44px" className="rounded-full" />
                </div>
            </div>

            {/* 3 manga cards */}
            <div className="grid gap-4 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* License guide section */}
            <SkeletonSection>
                <SkeletonPill width="100px" />
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <Skeleton width="55%" height="22px" />
                            <SkeletonText lines={2} className="mt-2" lastLineWidth="80%" />
                        </div>
                    ))}
                </div>
            </SkeletonSection>
        </div>
    );
}

/** ── Light Novel List Page Skeleton ── */
export function LNListSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading LN list">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="100px" />
                <Skeleton width="75%" height="48px" />
                <SkeletonText lines={2} lastLineWidth="60%" />
                <div className="flex gap-3 pt-2">
                    <Skeleton width="120px" height="44px" className="rounded-full" />
                    <Skeleton width="120px" height="44px" className="rounded-full" />
                </div>
            </div>

            {/* 3 LN cards */}
            <div className="grid gap-4 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Key features section (JP vs ID / Gap / Buy) */}
            <SkeletonSection>
                <SkeletonPill width="100px" />
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <Skeleton width="50%" height="22px" />
                            <SkeletonText lines={2} className="mt-2" lastLineWidth="75%" />
                        </div>
                    ))}
                </div>
            </SkeletonSection>
        </div>
    );
}

/** ── Anime Detail Page Skeleton ── */
export function AnimeDetailSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading anime detail">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="100px" />
                <Skeleton width="55%" height="48px" />
                <SkeletonText lines={2} lastLineWidth="55%" />
                <div className="flex gap-3 pt-2">
                    <Skeleton width="130px" height="44px" className="rounded-full" />
                    <Skeleton width="140px" height="44px" className="rounded-full" />
                </div>
            </div>

            <SkeletonSection>
                <div className="space-y-6">
                    {/* Pills */}
                    <div className="flex gap-2">
                        <SkeletonPill width="100px" />
                        <SkeletonPill width="120px" />
                    </div>
                    <Skeleton width="45%" height="36px" />
                    <SkeletonText lines={1} lastLineWidth="65%" />

                    {/* Detail facts (4-column) */}
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                <SkeletonPill width="70px" />
                                <Skeleton width="50%" height="20px" className="mt-2" />
                            </div>
                        ))}
                    </div>

                    {/* Info grid (5 items) */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                <SkeletonPill width="60px" />
                                <Skeleton width="70%" height="20px" className="mt-2" />
                            </div>
                        ))}
                    </div>

                    {/* Two column: Synopsis + Cast */}
                    <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="80px" />
                            <SkeletonText lines={4} className="mt-3" lastLineWidth="70%" />
                            <div className="mt-5 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-3">
                                        <Skeleton width="70%" height="14px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="50px" />
                            <div className="mt-3 flex flex-wrap gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} width="80px" height="28px" className="rounded-full" />
                                ))}
                            </div>
                            <SkeletonPill width="70px" className="mt-6" />
                            <div className="mt-3 flex flex-wrap gap-2">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} width="90px" height="28px" className="rounded-full" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonSection>
        </div>
    );
}

/** ── Manga Detail Page Skeleton ── */
export function MangaDetailSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading manga detail">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="100px" />
                <Skeleton width="55%" height="48px" />
                <SkeletonText lines={2} lastLineWidth="55%" />
                <div className="flex gap-3 pt-2">
                    <Skeleton width="130px" height="44px" className="rounded-full" />
                    <Skeleton width="140px" height="44px" className="rounded-full" />
                </div>
            </div>

            <SkeletonSection>
                <div className="space-y-6">
                    {/* Pills */}
                    <div className="flex gap-2">
                        <SkeletonPill width="100px" />
                        <SkeletonPill width="120px" />
                    </div>

                    {/* Detail facts (4-column) */}
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                                <SkeletonPill width="70px" />
                                <Skeleton width="50%" height="20px" className="mt-2" />
                            </div>
                        ))}
                    </div>

                    {/* Two column: Summary + Distribusi */}
                    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="70px" />
                            <SkeletonText lines={3} className="mt-3" lastLineWidth="65%" />
                            <div className="mt-5 space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-3">
                                        <Skeleton width="75%" height="14px" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="80px" />
                            <div className="mt-4 grid gap-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="rounded-2xl border border-white/10 bg-white/4 p-3">
                                        <SkeletonPill width="60px" />
                                        <Skeleton width="60%" height="14px" className="mt-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SkeletonSection>
        </div>
    );
}

/** LN Detail page skeleton (with gap comparison) */
export function LNDetailSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading LN detail">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="100px" />
                <Skeleton width="60%" height="48px" />
                <SkeletonText lines={2} lastLineWidth="55%" />
                <div className="flex gap-3 pt-2">
                    <Skeleton width="130px" height="44px" className="rounded-full" />
                    <Skeleton width="140px" height="44px" className="rounded-full" />
                </div>
            </div>

            <SkeletonSection>
                <div className="space-y-6">
                    {/* Pills */}
                    <div className="flex gap-2">
                        <SkeletonPill width="100px" />
                        <SkeletonPill width="120px" />
                        <SkeletonPill width="80px" />
                    </div>

                    {/* JP vs ID comparison */}
                    <div className="grid gap-4 xl:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="100px" />
                            <Skeleton width="120px" height="36px" className="mt-3" />
                            <Skeleton width="180px" height="14px" className="mt-2" />
                            <Skeleton width="140px" height="14px" className="mt-5" />
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="120px" />
                            <Skeleton width="110px" height="36px" className="mt-3" />
                            <Skeleton width="180px" height="14px" className="mt-2" />
                            <Skeleton width="140px" height="14px" className="mt-5" />
                        </div>
                    </div>

                    {/* Gap visual */}
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                        <SkeletonPill width="80px" />
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton width="60px" height="14px" />
                                <div className="flex-1 h-3 rounded-full bg-white/8" />
                            </div>
                            <div className="flex items-center gap-4">
                                <Skeleton width="60px" height="14px" />
                                <div className="flex-1 h-3 rounded-full bg-white/8">
                                    <div className="h-full w-3/5 rounded-full bg-white/10" />
                                </div>
                            </div>
                            <SkeletonPill width="120px" />
                        </div>
                    </div>

                    {/* Two column */}
                    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="80px" />
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="rounded-2xl border border-white/10 bg-white/4 p-3">
                                        <SkeletonPill width="60px" />
                                        <Skeleton width="50%" height="14px" className="mt-2" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="100px" />
                            <div className="mt-4 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-3">
                                        <Skeleton width="80%" height="14px" />
                                    </div>
                                ))}
                            </div>
                            <SkeletonPill width="70px" className="mt-6" />
                            <div className="mt-3 rounded-2xl border border-white/10 bg-white/4 p-3">
                                <Skeleton width="70%" height="14px" />
                            </div>
                        </div>
                    </div>

                    {/* History */}
                    <div className="rounded-3xl border border-white/10 bg-black/18 p-5">
                        <SkeletonPill width="100px" />
                        <div className="mt-4 space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-3">
                                    <Skeleton width="85%" height="14px" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SkeletonSection>
        </div>
    );
}

/** Kalender page skeleton */
export function CalendarSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading calendar">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="80px" />
                <Skeleton width="70%" height="48px" />
                <SkeletonText lines={1} lastLineWidth="55%" />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <SkeletonSection key={i}>
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <Skeleton width="120px" height="32px" />
                                <Skeleton width="100px" height="14px" className="mt-1" />
                            </div>
                            <SkeletonPill width="50px" />
                        </div>
                        <div className="mt-5 space-y-3">
                            {[1, 2].map((j) => (
                                <div key={j} className="rounded-2xl border border-white/8 bg-black/18 p-3">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <Skeleton width="55%" height="20px" />
                                            <Skeleton width="40%" height="14px" className="mt-1" />
                                        </div>
                                        <SkeletonPill width="60px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SkeletonSection>
                ))}
            </div>
        </div>
    );
}

/** Wishlist page skeleton */
export function WishlistSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading wishlist">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="80px" />
                <Skeleton width="65%" height="48px" />
                <SkeletonText lines={1} lastLineWidth="60%" />
            </div>

            <SkeletonSection>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="80px" />
                            <Skeleton width="50px" height="40px" className="mt-3" />
                            <SkeletonText lines={1} className="mt-2" lastLineWidth="70%" />
                        </div>
                    ))}
                </div>
            </SkeletonSection>

            <div className="space-y-8">
                {[1, 2].map((section) => (
                    <section key={section} className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <SkeletonPill width="80px" />
                                <Skeleton width="300px" height="32px" className="mt-2" />
                            </div>
                            <SkeletonPill width="60px" />
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {[1, 2].map((card) => (
                                <SkeletonSection key={card}>
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <SkeletonPill width="60px" />
                                                <Skeleton width="150px" height="32px" className="mt-2" />
                                            </div>
                                            <SkeletonPill width="70px" />
                                        </div>
                                        <SkeletonText lines={1} lastLineWidth="70%" />
                                        <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
                                            <SkeletonPill width="70px" />
                                            <Skeleton width="50%" height="14px" className="mt-2" />
                                        </div>
                                    </div>
                                    <Skeleton width="100px" height="36px" className="rounded-full mt-6" />
                                </SkeletonSection>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

/** Collection/Profil page skeleton */
export function CardGridSkeleton({ columns = 2, rows = 2 }: { columns?: number; rows?: number }) {
    const gridClass = columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';

    return (
        <div className="space-y-8 pb-6" aria-label="Loading page">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="80px" />
                <Skeleton width="65%" height="48px" />
                <SkeletonText lines={1} lastLineWidth="55%" />
            </div>

            <div className={`grid gap-4 ${gridClass}`}>
                {Array.from({ length: columns * rows }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        </div>
    );
}

/** Notifikasi page skeleton */
export function NotificationsSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading notifications">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="90px" />
                <Skeleton width="65%" height="48px" />
                <SkeletonText lines={1} lastLineWidth="60%" />
            </div>

            <SkeletonSection>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <SkeletonPill width="70px" />
                            <Skeleton width="40px" height="40px" className="mt-3" />
                            <SkeletonText lines={1} className="mt-2" lastLineWidth="60%" />
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <SkeletonPill key={i} width="60px" />
                    ))}
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
                    <Skeleton width="70%" height="14px" />
                </div>

                <div className="mt-6 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl border border-white/10 bg-black/18 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <Skeleton width="55%" height="20px" />
                                    <SkeletonText lines={1} className="mt-2" />
                                </div>
                                <SkeletonPill width="60px" />
                            </div>
                            <SkeletonPill width="100px" className="mt-3" />
                        </div>
                    ))}
                </div>
            </SkeletonSection>
        </div>
    );
}

/** Admin page skeleton */
export function AdminSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading admin">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="90px" />
                <Skeleton width="65%" height="48px" />
                <SkeletonText lines={1} lastLineWidth="60%" />
                <Skeleton width="100px" height="44px" className="rounded-full" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonSection key={i}>
                        <SkeletonPill width="80px" />
                        <Skeleton width="40px" height="40px" className="mt-3" />
                    </SkeletonSection>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <SkeletonSection>
                    <SkeletonPill width="100px" />
                    <Skeleton width="60%" height="32px" className="mt-4" />
                    <div className="mt-5 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <Skeleton width="60%" height="20px" />
                                        <Skeleton width="40%" height="14px" className="mt-1" />
                                    </div>
                                    <SkeletonPill width="50px" />
                                </div>
                                <Skeleton width="50%" height="14px" className="mt-3" />
                            </div>
                        ))}
                    </div>
                </SkeletonSection>
                <SkeletonSection>
                    <SkeletonPill width="90px" />
                    <Skeleton width="60%" height="32px" className="mt-4" />
                    <div className="mt-5 space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                                <Skeleton width="80%" height="14px" />
                            </div>
                        ))}
                    </div>
                </SkeletonSection>
            </div>

            <SkeletonSection>
                <SkeletonPill width="100px" />
                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <SkeletonPill width="60px" />
                                    <Skeleton width="150px" height="20px" className="mt-2" />
                                </div>
                                <SkeletonPill width="50px" />
                            </div>
                            <SkeletonText lines={1} className="mt-3" lastLineWidth="70%" />
                        </div>
                    ))}
                </div>
            </SkeletonSection>
        </div>
    );
}

/** Search page skeleton */
export function SearchSkeleton() {
    return (
        <div className="space-y-8 pb-6" aria-label="Loading search">
            <div className="mb-8 space-y-3">
                <SkeletonPill width="90px" />
                <Skeleton width="55%" height="48px" />
                <SkeletonText lines={1} lastLineWidth="60%" />
            </div>

            <SkeletonSection>
                <div className="space-y-2">
                    <SkeletonPill width="50px" />
                    <Skeleton width="100%" height="44px" className="rounded-2xl" />
                </div>

                <div className="mt-4 flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <SkeletonPill key={i} width="70px" />
                    ))}
                    <SkeletonPill width="90px" />
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-3xl border border-white/10 bg-black/18 p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <SkeletonPill width="60px" />
                                    <Skeleton width="200px" height="32px" className="mt-2" />
                                </div>
                                <SkeletonPill width="50px" />
                            </div>
                            <SkeletonText lines={2} className="mt-4" lastLineWidth="70%" />
                            <div className="mt-4 flex gap-2">
                                <Skeleton width="80px" height="22px" className="rounded-full" />
                                <Skeleton width="100px" height="22px" className="rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </SkeletonSection>
        </div>
    );
}
