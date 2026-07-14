"use client";

import { ErrorUI } from '@/components/error-boundary-ui';

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
    return (
        <ErrorUI
            code="500"
            title="Terjadi kesalahan"
            description="Ada yang tidak beres saat memuat halaman ini. Jangan khawatir, ini sementara — coba refresh atau kembali sebentar lagi."
            icon="⚡"
            showRetry
            onRetry={reset}
            actionLabel="Ke beranda"
            actionHref="/"
        />
    );
}
