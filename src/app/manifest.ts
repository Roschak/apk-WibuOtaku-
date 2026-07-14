import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

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
        orientation: 'portrait',
        scope: '/',
        categories: ['entertainment', 'books', 'anime'],
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
            },
            {
                src: '/icon-maskable.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'maskable',
            },
        ],
    };
}