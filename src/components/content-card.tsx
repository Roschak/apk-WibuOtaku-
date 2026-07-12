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
        <Surface className="flex h-full flex-col justify-between gap-6">
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <Pill tone={tone}>{kicker}</Pill>
                    <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium text-white/64">
                        {status}
                    </span>
                </div>
                <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
                    <p className="text-sm leading-7 text-white/68">{blurb}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {meta.map((item) => (
                        <span
                            key={item}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/72"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>
            <Link
                href={href}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/12"
            >
                {cta}
                <span aria-hidden="true">→</span>
            </Link>
        </Surface>
    );
}