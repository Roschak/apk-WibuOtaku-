import { ErrorUI } from '@/components/error-boundary-ui';

export default function NotFound() {
    return (
        <ErrorUI
            code="404"
            title="Halaman tidak ditemukan"
            description="Mungkin judul ini belum masuk katalog, slug-nya berubah, atau kamu salah ketik. Coba cek halaman utama atau cari lewat navigasi di atas."
            icon="🔍"
            actionLabel="Ke dashboard"
            actionHref="/"
        />
    );
}
