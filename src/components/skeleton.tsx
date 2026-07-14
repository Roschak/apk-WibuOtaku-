"use client";

type SkeletonProps = {
    className?: string;
    /** Renders as a circle when true */
    circle?: boolean;
    /** Width (Tailwind class or custom) */
    width?: string;
    /** Height (Tailwind class or custom) */
    height?: string;
    /** Number of lines for text skeleton */
    lines?: number;
    /** Last line width for text skeleton (e.g. '60%') */
    lastLineWidth?: string;
};

const shimmerBase = 'animate-shimmer rounded-lg bg-white/5';

export function Skeleton({
    className = '',
    circle = false,
    width,
    height,
}: SkeletonProps) {
    return (
        <div
            className={`${shimmerBase} ${circle ? 'rounded-full' : ''} ${className}`}
            style={{
                width: width || undefined,
                height: height || undefined,
            }}
            aria-hidden="true"
        />
    );
}

export function SkeletonText({
    lines = 3,
    lastLineWidth = '60%',
    className = '',
}: SkeletonProps) {
    return (
        <div className={`space-y-2.5 ${className}`} aria-hidden="true">
            {Array.from({ length: lines }).map((_, i) => {
                const isLast = i === lines - 1;
                return (
                    <div
                        key={i}
                        className={shimmerBase}
                        style={{
                            width: isLast ? lastLineWidth : '100%',
                            height: '14px',
                        }}
                    />
                );
            })}
        </div>
    );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div
            className={`rounded-[28px] border border-white/10 bg-white/5 p-6 ${className}`}
            aria-hidden="true"
        >
            <div className="flex items-start justify-between gap-3">
                <Skeleton width="80px" height="24px" className="rounded-full" />
                <Skeleton width="100px" height="22px" className="rounded-full" />
            </div>
            <div className="mt-5 space-y-3">
                <Skeleton width="70%" height="28px" />
                <SkeletonText lines={2} lastLineWidth="80%" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton width="90px" height="26px" className="rounded-full" />
                <Skeleton width="110px" height="26px" className="rounded-full" />
                <Skeleton width="70px" height="26px" className="rounded-full" />
            </div>
            <div className="mt-6">
                <Skeleton width="130px" height="36px" className="rounded-full" />
            </div>
        </div>
    );
}

export function SkeletonPill({ width = '60px', className = '' }: { width?: string; className?: string }) {
    return <Skeleton width={width} height="22px" className={`rounded-full ${className}`} />;
}
