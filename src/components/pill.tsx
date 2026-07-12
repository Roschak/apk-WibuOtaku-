import type { ReactNode } from 'react';

import type { Tone } from '@/lib/site-data';

const toneClasses: Record<Tone, string> = {
    gold: 'border-amber-200/20 bg-amber-200/10 text-amber-50',
    blue: 'border-sky-200/20 bg-sky-200/10 text-sky-50',
    rose: 'border-rose-200/20 bg-rose-200/10 text-rose-50',
    emerald: 'border-emerald-200/20 bg-emerald-200/10 text-emerald-50',
    slate: 'border-white/10 bg-white/5 text-white/70',
};

type PillProps = {
    children: ReactNode;
    tone?: Tone;
};

export function Pill({ children, tone = 'slate' }: PillProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${toneClasses[tone]}`}
        >
            {children}
        </span>
    );
}