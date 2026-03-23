import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'PlanetsSwaad — Cloud Kitchen Bhagalpur',
        short_name: 'PlanetsSwaad',
        description: 'Order delicious 100% pure veg food online from Bhagalpur\'s top cloud kitchen. Fast delivery!',
        start_url: '/',
        display: 'standalone',
        background_color: '#faf7f3',
        theme_color: '#468f71',
        orientation: 'portrait',
        categories: ['food', 'shopping'],
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
