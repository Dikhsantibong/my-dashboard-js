/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PORT: 3001,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
