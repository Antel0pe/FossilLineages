import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "humanorigins.si.edu",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "media.springernature.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
