/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
};

// Untuk build APK (static export), set env BUILD_STATIC=true
// npm run build  → SSR/vercel
// BUILD_STATIC=true npm run build → APK/static
if (process.env.BUILD_STATIC === 'true') {
    nextConfig.output = 'export';
    nextConfig.trailingSlash = true;
    nextConfig.skipTrailingSlashRedirect = true;
}

export default nextConfig;