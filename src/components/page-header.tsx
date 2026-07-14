import type { ReactNode } from 'react';

type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    description: string;
    actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
                {eyebrow ? (
                    <p className="animate-fade-in mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-ink-muted">
                        {eyebrow}
                    </p>
                ) : null}
                <h1 className="animate-fade-in-up font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                    {title}
                </h1>
                <p className="animate-fade-in-up mt-4 max-w-2xl text-sm leading-7 text-ink-secondary sm:text-base" style={{ animationDelay: '80ms' }}>
                    {description}
                </p>
            </div>
            {actions ? (
                <div className="animate-fade-in flex flex-wrap gap-3" style={{ animationDelay: '120ms' }}>
                    {actions}
                </div>
            ) : null}
        </div>
    );
}