/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000', // leave empty for default port
                pathname: '/screenshots/**',
            },
        ],
    },
};

export default nextConfig;
