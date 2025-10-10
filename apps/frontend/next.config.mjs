import path from 'path';

/** @type {import('next').NextConfig} */
const documentPermissionPolicy =
    'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()';

const assetPrefix = '/resources/html/error';

const nextConfig = {
    assetPrefix: process.env.NODE_ENV === 'production' ? assetPrefix : '',
    images: {
        path: `${
            process.env.NODE_ENV === 'production' ? assetPrefix : ''
        }/_next/image`,
    },
    async headers() {
        return [
            {
                source: '/(fonts|images|favicons)/(.*)',
                headers: [
                    {
                        key: 'cache-control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/',
                headers: [
                    {
                        key: 'strict-transport-security',
                        value: 'max-age=7776000',
                    },
                    { key: 'x-content-type-options', value: 'nosniff' },
                    {
                        key: 'referrer-policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'permission-policy',
                        value: documentPermissionPolicy,
                    },
                    { key: 'x-frame-options', value: 'SAMEORIGIN' },
                ],
            },
        ];
    },
    compress: false,
    eslint: { ignoreDuringBuilds: true },
    poweredByHeader: false,
    reactStrictMode: true,
    typescript: { ignoreBuildErrors: true },
    sassOptions: { includePaths: [path.join(process.cwd(), 'node_modules')] },
};

export default nextConfig;
