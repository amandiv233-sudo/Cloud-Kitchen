/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Disable ESLint errors from failing the build (fix lint issues separately)
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Disable TypeScript errors from failing the build
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'drive.google.com',
            }
        ],
    },
};

export default nextConfig;
