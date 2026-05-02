import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "turuhi.com",
      },
      {
        protocol: "https",
        hostname: "trawell.in",
      },
      {
        protocol: "https",
        hostname: "incredibleindia.gov.in",
      },
      {
        protocol: "https",
        hostname: "banjaranfoodie.com",
      },
      {
        protocol: "https",
        hostname: "timesofindia.indiatimes.com",
      },
      {
        protocol: "https",
        hostname: "tripadvisor.in",
      },
      {
        protocol: "https",
        hostname: "tripadvisor.com",
      },
      {
        protocol: "https",
        hostname: "youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "ytimg.com",
      },
    ],
  },
};

export default nextConfig;
