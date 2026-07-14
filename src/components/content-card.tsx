import Link from 'next/link';

import type { Tone } from '@/lib/site-data';

import { Pill } from '@/components/pill';
import { Surface } from '@/components/surface';

type ContentCardProps = {
    kicker: string;
    status: string;
    title: string;
    blurb: string;
    meta: string[];
    href: string;
    cta: string;
    tone: Tone;
};

export function ContentCard({ kicker, status, title, blurb, meta, href, cta, tone }: ContentCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <Surface className="flex h-full flex-col justify-between gap-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_0_32px_var(--accent-glow, rgba(247,195,95,0.12))]">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <Pill tone={tone}>{kicker}</Pill>
                        <span className="rounded-full border border-tag bg-card px-3 py-1 text-[11px] font-medium text-ink-tertiary transition-colors duration-200 group-hover:border-surface-hover group-hover:bg-card-hover">
                            {status}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-display text-2xl font-semibold text-ink transition-colors duration-200 group-hover:text-accent">
                            {title}
                            <span className="ml-2 inline-block opacity-0 transition-all duration-200 group-hover:opacity-60 group-hover:translate-x-1">→</span>
                        </h3>
                        <p className="text-sm leading-7 text-ink-secondary">{blurb}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {meta.map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-tag bg-tag px-3 py-1 text-xs text-ink-tertiary transition-all duration-200 group-hover:border-surface-hover group-hover:bg-surface-hover"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-btn-secondary bg-btn-secondary px-4 py-2 text-sm font-semibold text-ink-secondary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-accent-soft group-hover:bg-accent-soft group-hover:text-accent">
                    {cta}
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
            </Surface>
        </Link>
    );
}