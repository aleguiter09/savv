/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["cdn-icons-png.flaticon.com"],
  },
};

module.exports = nextConfig;
