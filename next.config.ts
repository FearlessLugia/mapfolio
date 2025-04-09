import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mapfolio.tor1.cdn.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;
