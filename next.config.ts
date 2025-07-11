import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "s2982.pcdn.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
