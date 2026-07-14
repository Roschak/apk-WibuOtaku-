import type { ReactNode } from 'react';

type SurfaceProps = {
    children: ReactNode;
    className?: string;
};

export function Surface({ children, className = '' }: SurfaceProps) {
    return (
        <section
            className={`group/surface rounded-[28px] border border-surface bg-surface p-6 shadow-halo backdrop-blur-xl transition-all duration-300 hover:border-surface-hover hover:bg-surface-hover ${className}`}
        >
            {children}
        </section>
    );
}