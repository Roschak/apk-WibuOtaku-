import type { Metadata } from 'next';

import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';

import '@/app/globals.css';

import { SiteNav } from '@/components/site-nav';

export const metadata: Metadata = {
    title: 'WibuOtaku',
    description: 'Anime, manga, dan light novel tracker untuk pengguna Indonesia.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="id">
            <body className="text-white antialiased">
                <SiteNav />
                <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
            </body>
        </html>
    );
}