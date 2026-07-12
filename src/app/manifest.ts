import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'WibuOtaku',
        short_name: 'WO',
        description: 'Anime, manga, dan light novel tracker untuk pengguna Indonesia.',
        start_url: '/',
        display: 'standalone',
        background_color: '#08111f',
        theme_color: '#f7c35f',
        lang: 'id',
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    };
}