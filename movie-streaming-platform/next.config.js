/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'streamflex-movies-api.up.railway.app',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
