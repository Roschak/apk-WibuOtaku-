"use client";

import { type ReactNode, useEffect, useRef, useState } from 'react';

type RevealProps = {
    children: ReactNode;
    className?: string;
    /** Default: fade-in-up */
    animation?: 'fade-in-up' | 'fade-in' | 'scale-in';
    /** Delay in ms before animation starts */
    delay?: number;
    /** Threshold for IntersectionObserver (0–1) */
    threshold?: number;
    /** Only animate once (default: true) */
    once?: boolean;
};

export function Reveal({
    children,
    className = '',
    animation = 'fade-in-up',
    delay = 0,
    threshold = 0.12,
    once = true,
}: RevealProps) {
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
            className={className}
            style={{
                opacity: isVisible ? undefined : 0,
                animation: isVisible
                    ? `${animation} 0.5s ease-out ${delay}ms both`
                    : undefined,
            }}
        >
            {children}
        </div>
    );
}
