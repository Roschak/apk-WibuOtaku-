"use client";

import { type ReactNode, useEffect, useRef, useState } from 'react';

type AnimatedListProps = {
    children: ReactNode;
    className?: string;
    /** Threshold for IntersectionObserver */
    threshold?: number;
    /** Only animate once (default: true) */
    once?: boolean;
};

export function AnimatedList({
    children,
    className = '',
    threshold = 0.08,
    once = true,
}: AnimatedListProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) {
                        observer.unobserve(el);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold },
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [threshold, once]);

    return (
        <div
            ref={ref}
            className={`${isVisible ? 'stagger-children' : 'opacity-0'} ${className}`}
        >
            {children}
        </div>
    );
}
