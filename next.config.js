/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/showup' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/showup/' : '',
  images: {
    unoptimized: true, // Required for static export
    domains: ['images.unsplash.com'],
  },
  // Disable server-side features for static export
  trailingSlash: true,
}

module.exports = nextConfig

