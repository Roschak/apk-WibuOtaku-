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
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/50">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}