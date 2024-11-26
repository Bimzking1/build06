/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  // uncomment script below before run build script
  // dont push this file with uncomment output property
  output: 'standalone',
  reactStrictMode: false,
  images: {
    domains: [
      'slashdot.org',
      'consent.google.com',
      'markets.businessinsider.com',
      'www.businessinsider.com',
      'coinpaper.com',
      'www.erlang.org',
      'cdn.vox-cdn.com',
      'a.fsdn.com',
      'i.insider.com',
      'res.cloudinary.com',
      'pict.sindonews.net',
      'images.unsplash.com',
      'seeds-bucket-new.s3.ap-southeast-3.amazonaws.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.fsdn.com',
        port: '',
        pathname: '*'
      },
      {
        protocol: 'https',
        hostname: 'i.insider.com',
        port: '',
        pathname: '*'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '*'
      }
      // {
      //   protocol: 'https',
      //   hostname: 'a.fsdn.com',
      //   port: '',
      //   pathname: '*'
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'a.fsdn.com',
      //   port: '',
      //   pathname: '*'
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'a.fsdn.com',
      //   port: '',
      //   pathname: '*'
      // }
    ]
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es']
  },
  images: {
    domains: [
      'dev-assets.seeds.finance',
      'assets.seeds.finance',
      'cdn06.pramborsfm.com',
      'i.pravatar.cc',
      'images.unsplash.com',
      'seeds-bucket-new.s3.ap-southeast-3.amazonaws.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-assets.seeds.finance',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'assets.seeds.finance',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

module.exports = nextConfig;
