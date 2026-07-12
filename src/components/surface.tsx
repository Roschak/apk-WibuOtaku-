import type { ReactNode } from 'react';

type SurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function Surface({ children, className = '' }: SurfaceProps) {
  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-halo backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}